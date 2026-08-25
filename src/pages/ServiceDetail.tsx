import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ServicePhotoGallery from "@/components/ServicePhotoGallery";
import { Button } from "@/components/ui/button";
import { getService, services } from "@/data/services";
import NotFound from "@/pages/NotFound";
import servicesBg from "@/assets/services-bg.jpg";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getService(slug);

  if (!service) return <NotFound />;

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <SEO title={service.metaTitle} description={service.metaDescription} path={`/services/${service.slug}`} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[38vh] items-center justify-center overflow-hidden">
          <img src={servicesBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
          <div className="container relative z-10 py-20 text-center">
            <p className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-primary">
              Greater Toronto Area
            </p>
            <h1 className="text-4xl font-extrabold text-primary-foreground md:text-5xl">{service.name}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">{service.short}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2 font-bold">
                <Link to="/contact">
                  Get a Free Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 bg-background font-bold">
                <a href="tel:+14165659093">
                  <Phone className="h-4 w-4" /> (416) 565-9093
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Detail */}
        <section className="py-20">
          <div className="container grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold">What's involved</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{service.intro}</p>
              <ul className="mt-8 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-lg border border-border bg-card p-8">
              <h2 className="font-heading text-xl font-bold">Pricing</h2>
              {service.pricing ? (
                <table className="mt-6 w-full text-sm">
                  <tbody>
                    {service.pricing.map((row) => (
                      <tr key={row.label} className="border-b border-border last:border-0">
                        <td className="py-3 text-muted-foreground">{row.label}</td>
                        <td className="py-3 text-right font-heading font-bold text-primary">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Priced per project based on size, condition and materials. Call for a free assessment.
                </p>
              )}
              <a
                href="tel:+14165659093"
                className="mt-6 flex items-center justify-center gap-2 font-heading text-lg font-bold text-primary hover:underline"
              >
                <Phone className="h-5 w-5" /> (416) 565-9093
              </a>
              <Button asChild className="mt-6 w-full font-bold">
                <Link to="/contact">Request a Quote</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Quotes answered within 24 hours · 9200 Weston Rd, Woodbridge, ON
              </p>
            </aside>
          </div>
        </section>

        <ServicePhotoGallery slug={service.slug} serviceName={service.name} />

        {/* Other services */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-extrabold">Other Services</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                >
                  <h3 className="font-heading text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary">
                    Learn more <ArrowRight className="h-4 w-4" />
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
};

export default ServiceDetail;
