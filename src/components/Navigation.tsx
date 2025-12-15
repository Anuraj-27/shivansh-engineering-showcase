import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import seLogo from "@/assets/se-logo.png";
import logo from "@/assets/shivansh-engineering-logo.png";

const Navigation = () => {
  return (
<nav className="fixed top-0 left-0 right-0 z-50 bg-navbar border-b border-navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <div className="h-14 w-14 flex items-center justify-center bg-navbar rounded">
              <img 
                src={seLogo} 
                alt="SE Logo" 
                className="h-12 object-contain"
              />
            </div>
            <div className="h-14 flex items-center justify-center bg-navbar rounded px-2">
              <img 
                src={logo} 
                alt="Shivansh Engineering" 
                className="h-12 object-contain"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/about">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                About Us
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Contact Us
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Gallery
              </Button>
            </Link>
            <Link to="/admin">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:shadow-lg hover:scale-105 transition-all">
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
