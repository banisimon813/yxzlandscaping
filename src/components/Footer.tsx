import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-section-dark text-section-dark-foreground">
    <div className="container grid gap-10 py-16 md:grid-cols-3">
      <div>
        <h3 className="mb-4 text-xl font-extrabold">
          <span className="text-primary">YXZ</span> Landscaping &amp; Hardscaping
        </h3>
        <p className="text-sm leading-relaxed text-section-dark-foreground/70">
          Professional interlock repair, power washing, sanding & sealing services across the Greater Toronto Area.
        </p>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Quick Links</h4>
        <nav className="flex flex-col gap-2 text-sm text-section-dark-foreground/70">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services & Pricing</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Get a Quote</Link>
        </nav>
      </div>
      <div>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Contact</h4>
        <div className="flex flex-col gap-3 text-sm text-section-dark-foreground/70">
          <a href="tel:+14165659093" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="h-4 w-4" /> (416) 565-9093
          </a>
          <a href="mailto:YXZLandscaping@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail className="h-4 w-4" /> YXZLandscaping@gmail.com
          </a>
          <span className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> 9200 Weston Rd, Woodbridge, ON L4H 2P8
          </span>
        </div>
      </div>
    </div>
    <div className="border-t border-section-dark-foreground/10 py-6 text-center text-xs text-section-dark-foreground/50">
      © {new Date().getFullYear()} YXZ Landscaping &amp; Hardscaping. All rights reserved.
    </div>
  </footer>
);

export default Footer;
