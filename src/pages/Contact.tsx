import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const serviceOptions = [
  "Light Power Washing",
  "Power Wash & Sand",
  "Sealing (1 Coat)",
  "Sealing (2 Coats)",
  "Full Restoration",
  "Other",
];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", sqft: "", service: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      toast({ title: "Quote Request Sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", phone: "", email: "", address: "", sqft: "", service: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary py-16 text-center text-primary-foreground">
          <div className="container">
            <h1 className="text-4xl font-extrabold md:text-5xl">Get a Free Quote</h1>
            <p className="mt-3 text-lg text-primary-foreground/80">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="mb-1.5 block text-sm font-semibold">Name *</label>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" maxLength={100} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Phone *</label>
                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="(647) 000-0000" maxLength={20} required />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="mb-1.5 block text-sm font-semibold">Email *</label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" maxLength={255} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Address</label>
                  <Input name="address" value={form.address} onChange={handleChange} placeholder="Street address" maxLength={200} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Approx. Square Footage</label>
                  <Input name="sqft" value={form.sqft} onChange={handleChange} placeholder="e.g. 1200" maxLength={10} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Service Needed</label>
                  <Select value={form.service} onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold">Message</label>
                  <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." rows={4} maxLength={1000} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" className="w-full gap-2 font-bold text-base" disabled={loading}>
                    <Send className="h-5 w-5" /> {loading ? "Sending..." : "Request Free Quote"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-secondary p-8">
                <h2 className="mb-6 text-xl font-bold">Contact Info</h2>
                <div className="flex flex-col gap-5">
                  <a href="tel:+16471234567" className="flex items-start gap-3 text-sm hover:text-primary transition-colors">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-bold">Phone</p>
                      <p className="text-muted-foreground">(647) 123-4567</p>
                    </div>
                  </a>
                  <a href="mailto:info@yxzlandscaping.com" className="flex items-start gap-3 text-sm hover:text-primary transition-colors">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-bold">Email</p>
                      <p className="text-muted-foreground">info@yxzlandscaping.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-bold">Service Area</p>
                      <p className="text-muted-foreground">Greater Toronto Area & Surrounding Communities</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-lg bg-primary p-6 text-primary-foreground">
                  <p className="font-heading text-lg font-bold">Prefer to Call?</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">We're happy to discuss your project over the phone.</p>
                  <Button asChild variant="secondary" className="mt-4 w-full gap-2 font-bold">
                    <a href="tel:+16471234567">
                      <Phone className="h-4 w-4" /> (647) 123-4567
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
