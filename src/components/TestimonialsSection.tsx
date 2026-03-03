import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", location: "Mississauga", text: "YXZ completely transformed our driveway. It looks brand new! Great price and fast service." },
  { name: "James T.", location: "Brampton", text: "Professional, on-time, and the results speak for themselves. Highly recommend their power washing service." },
  { name: "Priya K.", location: "Vaughan", text: "We had our entire patio washed, sanded, and sealed. The team was fantastic and the result is stunning." },
];

const TestimonialsSection = () => (
  <section className="py-20">
    <div className="container">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">What Our Customers Say</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 flex gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
            <div className="mt-4 font-heading text-sm font-bold">
              {t.name} <span className="font-normal text-muted-foreground">— {t.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
