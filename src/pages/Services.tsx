import { Phone } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import servicesBg from "@/assets/services-bg.jpg";

const pricingTables = [
  {
    title: "Light Power Washing",
    description: "High-pressure cleaning to remove dirt, algae, and debris from your interlock surface.",
    rows: [
      { range: "750 sq ft and below", price: "$1.00 / sq ft" },
      { range: "750 – 2,000 sq ft", price: "$0.80 / sq ft" },
      { range: "2,000+ sq ft", price: "$0.60 / sq ft" },
    ],
  },
  {
    title: "Power Wash & Sand",
    description: "Complete power wash with polymeric sand replacement for joint stability and weed prevention.",
    rows: [
      { range: "Below 1,000 sq ft", price: "$1.75 / sq ft" },
      { range: "1,000+ sq ft", price: "$1.50 / sq ft" },
    ],
  },
  {
    title: "Sealer",
    description: "Protective sealant applied after washing to enhance colour and protect against the elements.",
    rows: [
      { range: "1 Coat", price: "$1.25 / sq ft" },
      { range: "2 Coats", price: "$1.75 / sq ft" },
    ],
  },
  {
    title: "Repair",
    description: "Professional interlock repair including leveling, replacing damaged stones, and fixing drainage issues.",
    callForDetails: true,
  },
  {
    title: "Installation",
    description: "New interlock installation for driveways, walkways, patios, and more — built to last.",
    callForDetails: true,
  },
  {
    title: "Other Services",
    description: "Additional landscaping and hardscaping services tailored to your needs.",
    callForDetails: true,
  },
];
const Services = () => (
  <>
    <SEO
      title="Services & Pricing — YXZ Landscaping & Hardscaping GTA"
      description="Transparent pricing for interlock power washing, polymeric sanding, sealing, repair and installation across the Greater Toronto Area."
      path="/services"
    />
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden">
        <img src={servicesBg} alt="Power washing interlock" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="container relative z-10 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-primary-foreground md:text-5xl">Services & Pricing</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">Transparent pricing. No surprises. Quality results.</p>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="py-20">
        <div className="container grid gap-10 lg:grid-cols-3">
          {pricingTables.map((table) => (
            <div key={table.title} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="bg-primary px-6 py-5">
                <h2 className="text-xl font-bold text-primary-foreground">{table.title}</h2>
              </div>
              <div className="p-6">
                <p className="mb-6 text-sm text-muted-foreground">{table.description}</p>
                {table.callForDetails ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+14165659093" className="font-heading text-lg font-bold text-primary hover:underline">
                      Call for Details: (416) 565-9093
                    </a>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left font-bold">Area / Option</th>
                        <th className="pb-3 text-right font-bold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows?.map((row) => (
                        <tr key={row.range} className="border-b border-border last:border-0">
                          <td className="py-3 text-muted-foreground">{row.range}</td>
                          <td className="py-3 text-right font-heading font-bold text-primary">{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individual service pages */}
      <section className="border-t border-border bg-muted/40 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">Explore Each Service</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Detailed breakdowns, what's included, and photos of our completed work.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
              >
                <h3 className="font-heading text-lg font-bold group-hover:text-primary">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      <CTASection />
    </main>
    <Footer />
  </>
);

export default Services;
