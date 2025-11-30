import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
}

const PartnersSlider = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
    } else {
      setPartners(data || []);
    }
  };

  if (partners.length === 0) return null;

  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full py-12 overflow-hidden bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          Trusted By <span className="text-primary">Industry Leaders</span>
        </h2>
        
        <div className="relative">
          <div className="flex gap-12 animate-slide-left">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center bg-card rounded-lg border border-border/50 p-6 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain transition-all"
                />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSlider;
