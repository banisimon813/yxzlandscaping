-- Table holding the photos the owner uploads for each service page
CREATE TABLE public.service_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug text NOT NULL,
  storage_path text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX service_photos_slug_idx ON public.service_photos (service_slug, sort_order);

GRANT SELECT ON public.service_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_photos TO authenticated;
GRANT ALL ON public.service_photos TO service_role;

ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service photos"
  ON public.service_photos FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert service photos"
  ON public.service_photos FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service photos"
  ON public.service_photos FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service photos"
  ON public.service_photos FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_photos_updated_at
  BEFORE UPDATE ON public.service_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage access for the service-photos bucket
CREATE POLICY "Service photos are readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'service-photos');

CREATE POLICY "Admins can upload service photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'service-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service photo files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'service-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service photo files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'service-photos' AND public.has_role(auth.uid(), 'admin'));