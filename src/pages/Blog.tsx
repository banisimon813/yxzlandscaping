import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { supabase } from "@/integrations/supabase/client";
import { resolveBlogImageUrls } from "@/lib/blogImages";

interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

const Blog = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [coverUrls, setCoverUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .then(async ({ data }) => {
        setPosts(data ?? []);
        setCoverUrls(await resolveBlogImageUrls((data ?? []).map((p) => p.cover_image_url)));
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="Blog — Interlock & Hardscaping Tips | YXZ Landscaping"
        description="Interlock care, power washing, sanding and sealing advice from YXZ Landscaping & Hardscaping in the Greater Toronto Area."
        path="/blog"
      />
      <Navbar />
      <main>
        <section className="bg-section-dark py-20 text-section-dark-foreground">
          <div className="container text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-section-dark-foreground/70">
              Interlock and hardscaping advice from our crews across the GTA.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading posts…</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-muted-foreground">No posts yet — check back soon.</p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article key={post.id} className="overflow-hidden rounded-lg border border-border bg-card">
                    {post.cover_image_url && coverUrls.get(post.cover_image_url) && (
                      <img
                        src={coverUrls.get(post.cover_image_url)}
                        alt={post.title}
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <time className="text-xs uppercase tracking-wider text-muted-foreground">
                        {formatDate(post.published_at ?? post.created_at)}
                      </time>
                      <h2 className="mt-2 font-heading text-xl font-bold">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt && <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="mt-4 inline-block font-heading text-sm font-bold text-primary hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Blog;
