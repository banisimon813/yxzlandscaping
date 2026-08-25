import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SERVICE_PHOTO_BUCKET, useServicePhotos } from "@/hooks/useServicePhotos";
import { services } from "@/data/services";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";

const MAX_BYTES = 15 * 1024 * 1024;

const AdminPhotos = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const { photos, reload } = useServicePhotos();
  const [slug, setSlug] = useState(services[0].slug);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !session) navigate("/auth", { replace: true });
  }, [loading, session, navigate]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;

    const existing = photos.filter((p) => p.service_slug === slug).length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is larger than 15MB`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${slug}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(SERVICE_PHOTO_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });

      if (uploadError) {
        toast.error(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { error: insertError } = await supabase.from("service_photos").insert({
        service_slug: slug,
        storage_path: path,
        sort_order: existing + added,
      });

      if (insertError) {
        await supabase.storage.from(SERVICE_PHOTO_BUCKET).remove([path]);
        toast.error(`${file.name}: ${insertError.message}`);
        continue;
      }
      added++;
    }

    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    if (added > 0) {
      toast.success(`${added} photo${added > 1 ? "s" : ""} uploaded`);
      reload();
    }
  };

  const saveCaption = async (id: string, caption: string) => {
    const { error } = await supabase
      .from("service_photos")
      .update({ caption: caption.trim() || null })
      .eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Caption saved");
  };

  const remove = async (id: string, path: string) => {
    if (!window.confirm("Delete this photo?")) return;
    const { error } = await supabase.from("service_photos").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.storage.from(SERVICE_PHOTO_BUCKET).remove([path]);
    toast.success("Photo deleted");
    reload();
  };

  const move = async (id: string, direction: -1 | 1) => {
    const list = photos.filter((p) => p.service_slug === slug);
    const index = list.findIndex((p) => p.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;

    const a = list[index];
    const b = list[target];
    const results = await Promise.all([
      supabase.from("service_photos").update({ sort_order: target }).eq("id", a.id),
      supabase.from("service_photos").update({ sort_order: index }).eq("id", b.id),
    ]);
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(failed.error.message);
    reload();
  };

  const current = photos.filter((p) => p.service_slug === slug);

  return (
    <>
      <Helmet>
        <title>Service Photos — YXZ Landscaping Admin</title>
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
              You're signed in as {session?.user.email}, but this account isn't an admin yet. Open the blog admin to
              enable access.
            </p>
            <Button className="mt-6" onClick={() => navigate("/admin/blog")}>
              Go to admin
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-extrabold">Service Photos</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick a service, upload your own photos, and they appear on that service page instantly.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin/blog")}>
                Blog admin
              </Button>
            </div>

            <div className="mt-10 grid gap-6 rounded-lg border border-border bg-card p-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Service page</Label>
                <Select value={slug} onValueChange={setSlug}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">Upload photos (JPG or PNG, up to 15MB each)</Label>
                <Input
                  id="photos"
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={(e) => upload(e.target.files)}
                />
                <p className="text-xs text-muted-foreground">
                  {uploading ? "Uploading…" : "You can select several photos at once."}
                </p>
              </div>
              <div className="md:col-span-2">
                <Button variant="outline" asChild className="gap-2">
                  <a href={`/services/${slug}`} target="_blank" rel="noreferrer">
                    <Upload className="h-4 w-4" /> View this service page
                  </a>
                </Button>
              </div>
            </div>

            <h2 className="mt-12 font-heading text-xl font-bold">
              {current.length} photo{current.length === 1 ? "" : "s"} on this page
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {current.map((photo, i) => (
                <div key={photo.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  <img src={photo.url} alt={photo.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <Input
                      defaultValue={photo.caption ?? ""}
                      placeholder="Caption (optional)"
                      onBlur={(e) => {
                        if ((photo.caption ?? "") !== e.target.value.trim()) saveCaption(photo.id, e.target.value);
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" disabled={i === 0} onClick={() => move(photo.id, -1)} aria-label="Move up">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={i === current.length - 1}
                          onClick={() => move(photo.id, 1)}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" variant="destructive" className="gap-2" onClick={() => remove(photo.id, photo.storage_path)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AdminPhotos;
