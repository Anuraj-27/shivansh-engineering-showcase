import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

interface Equipment {
  id: string;
  name: string;
  display_order: number;
}

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    const { data, error } = await supabase
      .from("equipments")
      .select("id, name, display_order")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching equipments:", error);
    }
    setEquipments(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Our <span className="text-primary">Equipments</span>
          </h1>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading equipments...</p>
          ) : equipments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No equipments available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipments.map((equipment) => (
                <Card
                  key={equipment.id}
                  className="p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-default"
                >
                  <p className="text-lg font-medium text-center text-foreground">
                    {equipment.name}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Equipments;
