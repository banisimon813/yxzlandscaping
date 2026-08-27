import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SERVICE_PHOTO_BUCKET = "service-photos";
const URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface ServicePhoto {
  id: string;
  service_slug: string;
  storage_path: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  url: string;
}

/** Fetches the photos an admin uploaded for a service (or all services when slug is omitted). */
export const useServicePhotos = (slug?: string) => {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("service_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (slug) query = query.eq("service_slug", slug);

    const { data, error } = await query;
    if (error || !data) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const { data: signed } = await supabase.storage
      .from(SERVICE_PHOTO_BUCKET)
      .createSignedUrls(
        data.map((p) => p.storage_path),
        URL_TTL_SECONDS,
      );

    const urlByPath = new Map((signed ?? []).map((s) => [s.path ?? "", s.signedUrl]));

    setPhotos(
      data.map((p) => ({
        id: p.id,
        service_slug: p.service_slug,
        storage_path: p.storage_path,
        caption: p.caption,
        alt_text: p.alt_text,
        sort_order: p.sort_order,
        url: urlByPath.get(p.storage_path) ?? "",
      })),
    );
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return { photos, loading, reload: load };
};
