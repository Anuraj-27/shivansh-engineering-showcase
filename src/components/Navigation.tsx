import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import seLogo from "@/assets/se-logo.png";
import logo from "@/assets/shivansh-engineering-logo.png";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 bg-background/95 backdrop-blur-md px-4 py-2 rounded-lg">
            <img 
              src={seLogo} 
              alt="SE Logo" 
              className="h-14 w-auto object-contain"
            />
            <img 
              src={logo} 
              alt="Shivansh Engineering" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/about">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                About Us
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Contact Us
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </Button>
            </Link>
            <Link to="/admin">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-105 transition-all">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
