import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-up">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto animate-fade-in">
            Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-border/50 hover:shadow-xl transition-all animate-fade-in">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Our Location</h3>
                  <p className="text-muted-foreground">
                    Unit II, Gat No 882/1/3A,<br />
                    Behind Nisarg Hotel, Pune Nagar Road,<br />
                    Sanaswadi, Tal. Shirur,<br />
                    Dist. Pune (MH) 412 208
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground">
                    +91 88888 45711
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    shivanshengineering@yahoo.in
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border/50 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Wednesday: Open<br />
                    Thursday: Closed<br />
                    Friday - Sunday: Open
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-12 p-8 border-border/50 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "400ms" }}>
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              We're Here to Help
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              Whether you need technical support, product information, or want to discuss 
              a custom solution, our team of experts is ready to assist you. Contact us 
              through any of the above channels, and we'll get back to you promptly.
            </p>
          </Card>
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

export default Contact;
