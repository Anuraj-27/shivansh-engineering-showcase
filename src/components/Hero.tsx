import heroImage from "@/assets/hero-machinery.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-background/95"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up">
          Precision Engineering
          <br />
          <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
            Excellence Delivered
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-fade-in">
          Leading the industry in mechanical machinery solutions with unmatched quality, 
          reliability, and innovation. Your trusted partner for industrial excellence.
        </p>
      </div>
    </section>
  );
};

export default Hero;
