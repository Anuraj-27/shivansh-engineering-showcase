import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import PartnersSlider from "@/components/PartnersSlider";
import OwnerSection from "@/components/OwnerSection";
import MachinerySlider from "@/components/MachinerySlider";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import FeedbackForm from "@/components/FeedbackForm";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <TrustSection />
      <PartnersSlider />
      <OwnerSection />
      <MachinerySlider />
      <FeedbackDisplay />
      <FeedbackForm />
      
      <footer className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">
            © 2025 Shivansh Engineering. All rights reserved.
          </p>
          <p className="text-primary-foreground/80 mt-2">
            Excellence in Mechanical Engineering
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
