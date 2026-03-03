import { Link } from "react-router-dom";
import { Droplets, Wind, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Wind, title: "Power Washing", desc: "High-pressure cleaning to restore your interlock to like-new condition.", price: "From $0.60/sq ft" },
  { icon: Droplets, title: "Power Wash & Sand", desc: "Complete wash with polymeric sand replacement for joint stability.", price: "From $1.50/sq ft" },
  { icon: ShieldCheck, title: "Sealing", desc: "Protective sealant application to extend the life and look of your interlock.", price: "From $1.25/sq ft" },
  { icon: Layers, title: "Full Restoration", desc: "Combined services for a total interlock refresh — wash, sand, and seal.", price: "Custom Quote" },
];

const ServicesOverview = () => (
  <section className="bg-secondary py-20">
    <div className="container">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">Our Services</h2>
        <p className="mt-3 text-muted-foreground">Professional interlock maintenance at competitive prices</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div key={s.title} className="group rounded-lg border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <p className="mt-3 font-heading text-sm font-bold text-primary">{s.price}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline" className="gap-2 font-bold">
          <Link to="/services">
            View Full Pricing <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default ServicesOverview;
