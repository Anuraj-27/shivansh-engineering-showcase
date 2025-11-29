import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary-foreground animate-gear-spin" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-4xl font-bold text-red-600 font-britannic">
                Shivansh
              </span>
              <span className="text-2xl font-normal text-blue-600 font-britannic">
                Engineering
              </span>
            </div>
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
