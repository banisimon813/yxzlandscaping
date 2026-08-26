import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { supabase } from "@/integrations/supabase/client";
import { resolveBlogImageUrl } from "@/lib/blogImages";

interface Post {
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("title, excerpt, content, cover_image_url, published_at, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  return (
    <>
      {post && (
        <SEO
          title={`${post.title} | YXZ Landscaping & Hardscaping`}
          description={post.excerpt ?? post.content.slice(0, 155)}
          path={`/blog/${slug}`}
        />
      )}
      <Navbar />
      <main>
        <article className="container max-w-3xl py-16">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !post ? (
            <div className="py-20 text-center">
              <h1 className="text-3xl font-extrabold">Post not found</h1>
              <Link to="/blog" className="mt-4 inline-block text-primary underline">
                Back to the blog
              </Link>
            </div>
          ) : (
            <>
              <Link to="/blog" className="text-sm text-primary hover:underline">
                ← All posts
              </Link>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>
              <time className="mt-3 block text-sm text-muted-foreground">
                {formatDate(post.published_at ?? post.created_at)}
              </time>
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  loading="lazy"
                  className="mt-8 w-full rounded-lg object-cover"
                />
              )}
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                {post.content.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </>
          )}
        </article>
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
