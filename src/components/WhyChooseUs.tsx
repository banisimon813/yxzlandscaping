import { Award, Clock, DollarSign, MapPin } from "lucide-react";

const reasons = [
  { icon: Award, title: "Experienced Team", desc: "Years of expertise in interlock repair and restoration." },
  { icon: Clock, title: "Reliable & On-Time", desc: "We show up when we say we will and finish on schedule." },
  { icon: DollarSign, title: "Competitive Pricing", desc: "Transparent pricing with no hidden fees or surprises." },
  { icon: MapPin, title: "Serving the GTA", desc: "Proudly covering Toronto, Mississauga, Brampton, Vaughan & more." },
];

const WhyChooseUs = () => (
  <section className="py-20">
    <div className="container">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">Why Choose YXZ Landscaping?</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <div key={r.title} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-light text-primary">
              <r.icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
