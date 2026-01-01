import Navigation from "@/components/Navigation";
import PartnersSlider from "@/components/PartnersSlider";
import CompanyProfile from "@/components/CompanyProfile";
import MachinerySlider from "@/components/MachinerySlider";
import ContactInfoBlock from "@/components/ContactInfoBlock";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <MachinerySlider />
      
      <div className="container mx-auto px-6 mt-8">
        <ContactInfoBlock />
      </div>
      
      <CompanyProfile />
      
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
