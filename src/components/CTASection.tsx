import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="bg-primary py-20 text-primary-foreground">
    <div className="container text-center">
      <h2 className="text-3xl font-extrabold md:text-4xl">Ready to Restore Your Interlock?</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
        Get a free, no-obligation quote today. We'll assess your project and provide transparent pricing.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" variant="secondary" className="gap-2 font-bold px-8 py-6 text-base">
          <Link to="/contact">
            Get a Free Quote <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2 font-bold px-8 py-6 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
          <a href="tel:+16471234567">
            <Phone className="h-5 w-5" /> (647) 123-4567
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;
