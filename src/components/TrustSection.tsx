import { Shield, Award, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const TrustSection = () => {
  const trustFactors = [
    {
      icon: Shield,
      title: "Certified Quality",
      description: "ISO certified manufacturing processes ensuring the highest standards"
    },
    {
      icon: Award,
      title: "Industry Leader",
      description: "25+ years of excellence in mechanical engineering solutions"
    },
    {
      icon: Users,
      title: "500+ Clients",
      description: "Trusted by leading companies across multiple industries"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical assistance and customer service"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Trust <span className="text-primary">Shivansh Engineering</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on decades of expertise, innovation, and unwavering commitment to excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFactors.map((factor, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 bg-card animate-fade-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-6 group-hover:animate-glow-pulse">
                  <factor.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{factor.title}</h3>
                <p className="text-muted-foreground">{factor.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
