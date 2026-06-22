import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Benefits } from '../components/landing/Benefits';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Testimonials } from '../components/landing/Testimonials';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 transition-colors duration-200">
      {/* Header Sticky Navbar */}
      <Navbar onScrollToSection={handleScrollToSection} />

      {/* Main Page Layout Segments */}
      <main className="flex-grow">
        {/* Hero Segment */}
        <Hero />

        {/* Features Segment */}
        <Features />

        {/* Outcomes & Benefits Segment */}
        <Benefits />

        {/* Step Progression Segment */}
        <HowItWorks />

        {/* Customer Trust Segment */}
        <Testimonials />

        {/* FAQ Accordions */}
        <FAQ />
      </main>

      {/* Footer Branding Segment */}
      <Footer />
    </div>
  );
}

export default LandingPage;
