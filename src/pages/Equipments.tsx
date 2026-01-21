import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import FixedSpecificationTable from "@/components/FixedSpecificationTable";
import { FixedSpecificationData } from "@/lib/fixedParameters";

interface Equipment {
  id: string;
  name: string;
  image_url: string | null;
  display_order: number;
  sheet_width_min: number;
  sheet_width_max: number;
  sheet_thickness_min: number;
  sheet_thickness_max: number;
  line_speed_min: number;
  line_speed_max: number;
  coil_weight_min: number;
  coil_weight_max: number;
  material: string;
}

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    const { data: eqData, error } = await supabase
      .from("equipments")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching equipments:", error);
    }
    setEquipments(eqData || []);
    setLoading(false);
  };

  const getSpecificationData = (equipment: Equipment): FixedSpecificationData => ({
    sheet_width_min: equipment.sheet_width_min,
    sheet_width_max: equipment.sheet_width_max,
    sheet_thickness_min: equipment.sheet_thickness_min,
    sheet_thickness_max: equipment.sheet_thickness_max,
    line_speed_min: equipment.line_speed_min,
    line_speed_max: equipment.line_speed_max,
    coil_weight_min: equipment.coil_weight_min,
    coil_weight_max: equipment.coil_weight_max,
    material: equipment.material,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
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
                <FixedSpecificationTable
                  key={equipment.id}
                  name={equipment.name}
                  imageUrl={equipment.image_url}
                  data={getSpecificationData(equipment)}
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
