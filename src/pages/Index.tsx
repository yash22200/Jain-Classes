import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LegacySection from "@/components/LegacySection";
import CoursesSection from "@/components/CoursesSection";
import BatchesSection from "@/components/BatchesSection";
import HallOfFame from "@/components/HallOfFame";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <LegacySection />
    <CoursesSection />
    <BatchesSection />
    <HallOfFame />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
