import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProcessingLine from "./pages/ProcessingLine";
import ProcessingLineCategory from "./pages/ProcessingLineCategory";
import Equipments from "./pages/Equipments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ClientsSlider from "./components/ClientsSlider";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  
  // Hide slider on Admin and Gallery pages
  const hideSliderRoutes = ['/admin', '/admin/dashboard', '/gallery'];
  const shouldShowSlider = !hideSliderRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith('/admin')
  );

  return (
    <div className="flex w-full">
      <div className={`flex-1 ${shouldShowSlider ? 'lg:mr-[15%] lg:min-w-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/processing-line" element={<ProcessingLine />} />
          <Route path="/processing-line/:category" element={<ProcessingLineCategory />} />
          <Route path="/equipments" element={<Equipments />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {shouldShowSlider && <ClientsSlider />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
