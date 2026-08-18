import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesOverview from "@/components/ServicesOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import ServiceAreaSection from "@/components/ServiceAreaSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const Index = () => (
  <>
    <SEO
      title="YXZ Landscaping & Hardscaping — Interlock Restoration & Power Washing GTA"
      description="Professional interlock repair, power washing, polymeric sanding and sealing across the Greater Toronto Area. Get a free quote today."
      path="/"
    />
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesOverview />
      <WhyChooseUs />
      <TestimonialsSection />
      <ServiceAreaSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
