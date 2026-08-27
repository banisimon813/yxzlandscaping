import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceSeoRow {
  service_slug: string;
  meta_title: string | null;
  meta_description: string | null;
}

/** Admin-managed SEO overrides for service pages (all rows, or one slug). */
export const useServiceSeo = (slug?: string) => {
  const [rows, setRows] = useState<ServiceSeoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("service_seo").select("service_slug, meta_title, meta_description");
    if (slug) query = query.eq("service_slug", slug);
    const { data } = await query;
    setRows(data ?? []);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const get = useCallback(
    (target: string) => rows.find((r) => r.service_slug === target) ?? null,
    [rows],
  );

  return { rows, get, loading, reload: load };
};

export const saveServiceSeo = async (
  service_slug: string,
  meta_title: string,
  meta_description: string,
) =>
  supabase.from("service_seo").upsert(
    {
      service_slug,
      meta_title: meta_title.trim() || null,
      meta_description: meta_description.trim() || null,
    },
    { onConflict: "service_slug" },
  );
