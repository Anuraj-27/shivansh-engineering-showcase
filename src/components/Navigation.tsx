import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import logo1 from "@/assets/logo1.png";
import logo2 from "@/assets/logo2.png";
import { PROCESSING_LINE_CATEGORIES } from "@/lib/processingLineCategories";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar border-b border-navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0">
            <div className="h-16 flex items-center justify-center bg-navbar rounded px-1">
              <img 
                src={logo1} 
                alt="SE Logo" 
                className="h-14 object-contain"
              />
            </div>
            <div className="h-16 flex items-center justify-center bg-navbar rounded px-1">
              <img 
                src={logo2} 
                alt="Shivansh Engineering" 
                className="h-14 object-contain"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/about">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                About Us
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors gap-1">
                  Products
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-navbar border-navbar min-w-[200px]">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer text-primary-foreground hover:bg-primary-foreground/10 focus:bg-primary-foreground/10 focus:text-primary-foreground data-[state=open]:bg-primary-foreground/10">
                    <span>Processing Line</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-navbar border-navbar min-w-[220px]">
                      {PROCESSING_LINE_CATEGORIES.map((category) => (
                        <DropdownMenuItem
                          key={category.slug}
                          asChild
                          className="cursor-pointer text-primary-foreground hover:bg-primary-foreground/10 focus:bg-primary-foreground/10 focus:text-primary-foreground"
                        >
                          <Link to={`/processing-line/${category.slug}`} className="w-full">
                            {category.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild className="cursor-pointer text-primary-foreground hover:bg-primary-foreground/10 focus:bg-primary-foreground/10 focus:text-primary-foreground">
                  <Link to="/equipments" className="w-full">Equipments</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/services">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Services
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
