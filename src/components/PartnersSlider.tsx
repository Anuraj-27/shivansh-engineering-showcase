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
    <section className="fixed right-0 top-32 h-[calc(100vh-8rem)] w-48 z-40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-full">
        <h2 className="text-xl font-bold text-center text-foreground mb-4 px-2 bg-background/95 backdrop-blur-md py-4">
          Trusted By <span className="text-primary">Industry Leaders</span>
        </h2>
        
        <div className="relative h-full">
          <div className="flex flex-col gap-8 animate-slide-down">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-40 h-28 mx-auto flex items-center justify-center bg-card rounded-lg border border-border/50 p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg"
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
          <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
          <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSlider;
