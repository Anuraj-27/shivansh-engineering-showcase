import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import SpecificationCard from "@/components/SpecificationCard";
import ContactInfoBlock from "@/components/ContactInfoBlock";

interface EquipmentParameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
  unit: string;
  display_order: number;
}

interface Equipment {
  id: string;
  name: string;
  image_url: string | null;
  material: string;
  display_order: number;
  parameters: EquipmentParameter[];
}

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    const { data: equipmentsData } = await supabase
      .from("equipments")
      .select("*")
      .order("display_order", { ascending: true });

    const equipmentsWithParams = await Promise.all(
      (equipmentsData || []).map(async (equipment) => {
        const { data: params } = await supabase
          .from("equipment_parameters")
          .select("*")
          .eq("equipment_id", equipment.id)
          .order("display_order", { ascending: true });
        return { ...equipment, parameters: params || [] };
      })
    );

    setEquipments(equipmentsWithParams);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <ContactInfoBlock />
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Our <span className="text-primary">Equipments</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover our range of industrial equipment solutions with detailed specifications.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading equipments...</p>
            </div>
          ) : equipments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No equipments available yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {equipments.map((equipment) => (
                <SpecificationCard
                  key={equipment.id}
                  name={equipment.name}
                  imageUrl={equipment.image_url}
                  material={equipment.material}
                  parameters={equipment.parameters}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipments;
