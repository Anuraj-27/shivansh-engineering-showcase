import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      className="fixed right-0 top-0 h-screen w-[30%] min-w-[200px] max-w-[350px] z-40 overflow-hidden hidden lg:block"
      style={{ backgroundColor: '#ED7D31' }}
    >
      <div 
        className="flex flex-col gap-4 py-4 px-2"
        style={{
          animation: isPaused ? 'none' : 'slideDown 20s linear infinite',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedClients.map((client, index) => (
          <div
            key={`${client.id}-${index}`}
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-4 mx-1 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white cursor-default"
          >
            <span className="text-sm font-medium text-gray-800 leading-tight block">
              {client.name}
            </span>
          </div>
        ))}
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
