"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import Plants from "@/components/Plants";
import Footer from "@/components/Footer";
import ScrollToTop from "@/utils/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <Hero />
        <WhyChooseUs />
        <Services />
        <Plants />
      </div>
      <Footer />
    </div>
  );
}
