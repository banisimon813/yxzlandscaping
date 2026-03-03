import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
    <img
      src={heroBg}
      alt="Beautiful interlock driveway with landscaping"
      className="absolute inset-0 h-full w-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
    <div className="container relative z-10 py-20 text-center">
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl lg:text-7xl animate-fade-in-up">
        Professional Interlock Repair &amp; Restoration Across the GTA
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl" style={{ animationDelay: "0.15s", animation: "fade-in-up 0.6s ease-out 0.15s forwards", opacity: 0 }}>
        Quality craftsmanship, affordable pricing, and reliable service — your trusted partner for power washing, sanding, and sealing.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.3s", animation: "fade-in-up 0.6s ease-out 0.3s forwards", opacity: 0 }}>
        <Button asChild size="lg" className="gap-2 text-base font-bold px-8 py-6">
          <Link to="/contact">
            Get a Free Quote <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2 text-base font-bold px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
          <a href="tel:+16471234567">
            <Phone className="h-5 w-5" /> Call Now
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
