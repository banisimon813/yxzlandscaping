import { supabase } from "@/integrations/supabase/client";

export const BLOG_IMAGE_BUCKET = "blog-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days

const isExternal = (value: string) => /^(https?:)?\/\//i.test(value) || value.startsWith("data:");

/** Resolves a stored cover value: external URLs pass through, storage paths get a signed URL. */
export const resolveBlogImageUrl = async (value: string | null): Promise<string | null> => {
  if (!value) return null;
  if (isExternal(value)) return value;

  const { data } = await supabase.storage.from(BLOG_IMAGE_BUCKET).createSignedUrl(value, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
};

/** Resolves many cover values at once, keyed by the original stored value. */
export const resolveBlogImageUrls = async (values: (string | null)[]): Promise<Map<string, string>> => {
  const map = new Map<string, string>();
  const paths: string[] = [];

  for (const value of values) {
    if (!value) continue;
    if (isExternal(value)) map.set(value, value);
    else if (!paths.includes(value)) paths.push(value);
  }

  if (paths.length > 0) {
    const { data } = await supabase.storage.from(BLOG_IMAGE_BUCKET).createSignedUrls(paths, SIGNED_URL_TTL);
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
    }
  }

  return map;
};

/** Uploads a hero image and returns the storage path to save on the post. */
export const uploadBlogImage = async (file: File): Promise<{ path?: string; error?: string }> => {
  if (!file.type.startsWith("image/")) return { error: "That file isn't an image." };
  if (file.size > 15 * 1024 * 1024) return { error: "Image must be smaller than 15MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `covers/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BLOG_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "3600" });

  if (error) return { error: error.message };
  return { path };
};

/** Removes an uploaded hero image file (ignores external URLs). */
export const deleteBlogImage = async (value: string | null) => {
  if (!value || isExternal(value)) return;
  await supabase.storage.from(BLOG_IMAGE_BUCKET).remove([value]);
};
