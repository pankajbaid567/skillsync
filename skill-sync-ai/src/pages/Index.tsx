import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import AIFeature from "@/components/AIFeature";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { WaveDivider, CurveDivider } from "@/components/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative">
          <Hero />
          <WaveDivider position="bottom" />
        </section>
        
        <section className="relative bg-muted/30">
          <HowItWorks />
          <CurveDivider position="bottom" />
        </section>
        
        <section className="relative">
          <AIFeature />
          <WaveDivider position="bottom" />
        </section>
        
        <section className="relative bg-muted/30">
          <Testimonials />
          <CurveDivider position="bottom" />
        </section>
        
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
