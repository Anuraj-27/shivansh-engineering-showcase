import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Target, Lightbulb, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-up">
            About <span className="text-primary">Shivansh Engineering</span>
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="p-8 border-border/50 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded with a vision to revolutionize the mechanical machinery industry, 
                Shivansh Engineering has grown to become a trusted name in precision engineering. 
                With over 20 years of experience, we've consistently delivered exceptional quality 
                machinery solutions to clients across diverse industries.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center border-border/50 hover:shadow-xl transition-all animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide innovative, reliable, and high-quality mechanical solutions 
                  that empower industries to achieve operational excellence.
                </p>
              </Card>

              <Card className="p-8 text-center border-border/50 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: "150ms" }}>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the global leader in mechanical engineering solutions, 
                  setting new standards for innovation and sustainability.
                </p>
              </Card>

              <Card className="p-8 text-center border-border/50 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: "300ms" }}>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Our Values</h3>
                <p className="text-muted-foreground">
                  Integrity, innovation, excellence, and customer satisfaction 
                  are at the core of everything we do.
                </p>
              </Card>
            </div>

            <Card className="p-8 border-border/50 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>ISO certified manufacturing processes ensuring uncompromising quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>State-of-the-art R&D facilities driving continuous innovation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Expert team of engineers with decades of combined experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Comprehensive after-sales support and maintenance services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✓</span>
                  <span>Commitment to environmental sustainability and safety standards</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">© 2025 Shivansh Engineering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
