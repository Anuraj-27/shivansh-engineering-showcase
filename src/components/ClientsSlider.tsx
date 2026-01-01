import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail } from "lucide-react";

interface Client {
  id: string;
  name: string;
  display_order: number | null;
}

const ClientsSlider = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setClients(data);
      }
    };

    fetchClients();
  }, []);

  if (clients.length === 0) return null;

  // Duplicate clients for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <div 
      className="fixed right-0 top-0 h-screen w-[20%] min-w-[220px] max-w-[300px] z-40 overflow-hidden hidden lg:flex flex-col"
      style={{ backgroundColor: '#ED7D31' }}
    >
      {/* Static Header */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <h2 className="text-xl font-bold text-white text-center tracking-wide uppercase">
          Our Clients
        </h2>
      </div>

      {/* Static Contact Information */}
      <div className="flex-shrink-0 px-4 pb-4 border-b border-white/20">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/95 leading-relaxed">
              Unit II, Gat No 882/1/3A,<br />
              Behind Nisarg Hotel, Pune Nagar Road,<br />
              Sanaswadi, Tal. Shirur,<br />
              Dist. Pune (MH) 412 208
            </p>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white flex-shrink-0" />
            <a 
              href="tel:8888845711" 
              className="text-xs text-white/95 hover:text-white transition-colors"
            >
              8888845711
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white flex-shrink-0" />
            <a 
              href="mailto:shivanshengineering@yahoo.in" 
              className="text-xs text-white/95 hover:text-white transition-colors break-all"
            >
              shivanshengineering@yahoo.in
            </a>
          </div>
        </div>
      </div>

      {/* Animated Client Cards Container */}
      <div className="flex-1 overflow-hidden relative mt-3">
        <div 
          className="flex flex-col gap-3 px-3"
          style={{
            animation: isPaused ? 'none' : 'slideDown 25s linear infinite',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-3 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white cursor-pointer border border-white/50"
            >
              <span className="text-sm font-medium text-gray-800 leading-tight block">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-33.33%);
          }
          100% {
            transform: translateY(0%);
          }
        }
      `}</style>
    </div>
  );
};

export default ClientsSlider;
