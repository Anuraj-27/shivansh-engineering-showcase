import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import ContactInfoBlock from "@/components/ContactInfoBlock";

const services = [
  "Consultancy Service",
  "Design of various machinery",
  "Engineering",
  "Manufacture and Supply",
  "Erection and Commissioning",
  "Refurbish",
  "Reverse engineering",
  "Engineering for second hand lines",
  "Re-Engineering and replacement",
  "Foundation drawing",
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <ContactInfoBlock />
          
          {/* Page Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Services for processing lines and equipments required for metal rolling industry
          </h1>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <p className="text-lg font-medium text-center text-foreground">
                  {service}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
