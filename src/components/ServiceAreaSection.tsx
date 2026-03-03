import { MapPin } from "lucide-react";

const areas = [
  "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham",
  "Richmond Hill", "Oakville", "Burlington", "Milton", "Ajax",
  "Pickering", "Whitby", "Oshawa", "Newmarket", "Aurora",
  "Caledon", "King City", "Etobicoke", "Scarborough", "North York",
];

const ServiceAreaSection = () => (
  <section className="bg-section-dark py-20 text-section-dark-foreground">
    <div className="container text-center">
      <h2 className="text-3xl font-extrabold md:text-4xl">Service Areas</h2>
      <p className="mt-3 text-section-dark-foreground/70">We proudly serve the entire GTA and surrounding communities</p>
      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        {areas.map((a) => (
          <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-section-dark-foreground/20 px-4 py-2 text-sm font-medium">
            <MapPin className="h-3.5 w-3.5 text-primary" /> {a}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceAreaSection;
