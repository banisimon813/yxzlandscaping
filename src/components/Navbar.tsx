import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="font-heading text-xl font-extrabold tracking-tight md:text-2xl">
          <span className="text-primary">YXZ</span> Landscaping
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-heading text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <a href="tel:+14165659093" className="gap-2">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border bg-background px-6 pb-6 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-3 font-heading text-base font-semibold uppercase tracking-wider ${
                location.pathname === l.to ? "text-primary" : "text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild className="mt-3 w-full gap-2">
            <a href="tel:+14165659093">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
