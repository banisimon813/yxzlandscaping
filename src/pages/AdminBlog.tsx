import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { deleteBlogImage, resolveBlogImageUrl, uploadBlogImage } from "@/lib/blogImages";
import { toast } from "sonner";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const emptyDraft = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  published: false,
};

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

const AdminBlog = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<typeof emptyDraft>(emptyDraft);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !session) navigate("/auth", { replace: true });
  }, [loading, session, navigate]);

  // Keep the hero image preview in sync with whatever is stored on the draft.
  useEffect(() => {
    let active = true;
    resolveBlogImageUrl(draft.cover_image_url || null).then((url) => {
      if (active) setCoverPreview(url);
    });
    return () => {
      active = false;
    };
  }, [draft.cover_image_url]);

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingCover(true);
    const { path, error } = await uploadBlogImage(file);
    setUploadingCover(false);
    if (coverInput.current) coverInput.current.value = "";
    if (error || !path) {
      toast.error(error ?? "Upload failed");
      return;
    }
    setDraft((d) => ({ ...d, cover_image_url: path }));
    toast.success("Hero image uploaded");
  };

  const loadPosts = () =>
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setPosts(data ?? []);
      });

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin]);

  const startNew = () => {
    setDraft(emptyDraft);
    setEditing(true);
  };

  const startEdit = (post: Post) => {
    setDraft({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      cover_image_url: post.cover_image_url ?? "",
      published: post.published,
    });
    setEditing(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = draft.slug ? slugify(draft.slug) : slugify(draft.title);
    const payload = {
      slug,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim() || null,
      content: draft.content,
      cover_image_url: draft.cover_image_url.trim() || null,
      published: draft.published,
      published_at: draft.published ? new Date().toISOString() : null,
      author_id: session?.user.id ?? null,
    };

    const { error } = draft.id
      ? await supabase.from("blog_posts").update(payload).eq("id", draft.id)
      : await supabase.from("blog_posts").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Post updated" : "Post created");
    setEditing(false);
    setDraft(emptyDraft);
    loadPosts();
  };

  const remove = async (post: Post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) toast.error(error.message);
    else {
      await deleteBlogImage(post.cover_image_url);
      toast.success("Post deleted");
      loadPosts();
    }
  };

  const togglePublished = async (post: Post) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) toast.error(error.message);
    else loadPosts();
  };

  return (
    <>
      <Helmet>
        <title>Blog Admin — YXZ Landscaping</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="container py-16">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !isAdmin ? (
          <div className="mx-auto max-w-lg rounded-lg border border-border bg-card p-8 text-center">
            <h1 className="font-heading text-2xl font-extrabold">No admin access</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You're signed in as {session?.user.email}, but this account isn't an admin yet.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                onClick={async () => {
                  const { data, error } = await supabase.rpc("claim_owner_admin");
                  if (error) toast.error(error.message);
                  else if (data) {
                    toast.success("Admin access granted");
                    window.location.reload();
                  } else {
                    toast.error("This account is not allowed to claim admin access.");
                  }
                }}
              >
                Enable admin access
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/auth");
                }}
              >
                Sign out
              </Button>
            </div>

          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-heading text-3xl font-extrabold">Blog Admin</h1>
              <div className="flex gap-3">
                {!editing && (
                  <Button onClick={startNew} className="gap-2">
                    <Plus className="h-4 w-4" /> New Post
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>

            {editing ? (
              <form onSubmit={save} className="mt-10 max-w-3xl space-y-6 rounded-lg border border-border bg-card p-8">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL slug (optional)</Label>
                  <Input
                    id="slug"
                    value={draft.slug}
                    placeholder={slugify(draft.title) || "my-post-title"}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Short summary</Label>
                  <Textarea id="excerpt" rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cover">Featured / hero image (optional)</Label>
                  {coverPreview && (
                    <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border">
                      <img src={coverPreview} alt="Hero image preview" className="aspect-[16/9] w-full object-cover" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute right-2 top-2"
                        aria-label="Remove hero image"
                        onClick={async () => {
                          await deleteBlogImage(draft.cover_image_url);
                          setDraft({ ...draft, cover_image_url: "" });
                          toast.success("Hero image removed");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="cover"
                    ref={coverInput}
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  />
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {uploadingCover
                      ? "Uploading…"
                      : "JPG or PNG up to 15MB. Wide images (16:9) look best at the top of a post."}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" rows={16} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} required />
                  <p className="text-xs text-muted-foreground">Leave a blank line between paragraphs.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="published" checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
                  <Label htmlFor="published">Published (visible on the site)</Label>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Post"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); setDraft(emptyDraft); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-10 space-y-4">
                {posts.length === 0 && <p className="text-muted-foreground">No posts yet. Create your first one.</p>}
                {posts.map((post) => (
                  <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5">
                    <div>
                      <h2 className="font-heading font-bold">{post.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        /blog/{post.slug} · {post.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch checked={post.published} onCheckedChange={() => togglePublished(post)} aria-label="Toggle published" />
                        <span className="text-xs text-muted-foreground">Live</span>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => startEdit(post)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-2" onClick={() => remove(post)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AdminBlog;
