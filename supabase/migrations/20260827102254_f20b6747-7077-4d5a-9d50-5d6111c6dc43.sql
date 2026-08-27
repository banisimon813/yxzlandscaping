ALTER TABLE public.service_photos ADD COLUMN IF NOT EXISTS alt_text TEXT;

CREATE TABLE IF NOT EXISTS public.service_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_seo TO authenticated;
GRANT ALL ON public.service_seo TO service_role;

ALTER TABLE public.service_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service SEO is publicly readable"
ON public.service_seo FOR SELECT USING (true);

CREATE POLICY "Admins can insert service SEO"
ON public.service_seo FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service SEO"
ON public.service_seo FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service SEO"
ON public.service_seo FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_seo_updated_at
BEFORE UPDATE ON public.service_seo
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();