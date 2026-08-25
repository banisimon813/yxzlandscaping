import { useServicePhotos } from "@/hooks/useServicePhotos";

interface Props {
  slug: string;
  serviceName: string;
}

const ServicePhotoGallery = ({ slug, serviceName }: Props) => {
  const { photos, loading } = useServicePhotos(slug);

  if (loading || photos.length === 0) return null;

  return (
    <section className="bg-secondary py-20">
      <div className="container">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl">Our {serviceName} Work</h2>
        <p className="mt-3 text-center text-muted-foreground">Recent projects across the Greater Toronto Area</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <figure key={photo.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={photo.url}
                alt={photo.caption || `${serviceName} project by YXZ Landscaping & Hardscaping in the GTA`}
                loading={i < 3 ? "eager" : "lazy"}
                className="aspect-[4/3] w-full object-cover"
              />
              {photo.caption && (
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{photo.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePhotoGallery;
