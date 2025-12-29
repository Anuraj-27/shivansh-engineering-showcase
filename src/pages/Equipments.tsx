import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EquipmentParameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
}

interface Equipment {
  id: string;
  name: string;
  image_url: string | null;
  material: string;
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
                <div
                  key={equipment.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold text-foreground border-r border-border w-[200px]">
                            Image
                          </TableHead>
                          <TableHead className="font-bold text-foreground border-r border-border w-[150px]">
                            Material
                          </TableHead>
                          <TableHead colSpan={3} className="font-bold text-foreground text-center">
                            Range
                          </TableHead>
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableHead className="border-r border-border"></TableHead>
                          <TableHead className="border-r border-border"></TableHead>
                          <TableHead className="font-semibold text-foreground text-center border-r border-border">
                            Parameter
                          </TableHead>
                          <TableHead className="font-semibold text-foreground text-center border-r border-border">
                            Min
                          </TableHead>
                          <TableHead className="font-semibold text-foreground text-center">
                            Max
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {equipment.parameters.length > 0 ? (
                          equipment.parameters.map((param, paramIndex) => (
                            <TableRow key={param.id} className="border-b border-border">
                              {paramIndex === 0 && (
                                <>
                                  <TableCell
                                    rowSpan={equipment.parameters.length}
                                    className="border-r border-border align-top p-4"
                                  >
                                    <div className="flex flex-col items-center">
                                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-3">
                                        {equipment.image_url ? (
                                          <img
                                            src={equipment.image_url}
                                            alt={equipment.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                            No Image
                                          </div>
                                        )}
                                      </div>
                                      <span className="font-semibold text-center text-sm">
                                        {equipment.name}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell
                                    rowSpan={equipment.parameters.length}
                                    className="border-r border-border text-center font-medium align-middle"
                                  >
                                    {equipment.material}
                                  </TableCell>
                                </>
                              )}
                              <TableCell className="text-center border-r border-border">
                                {param.parameter_name}
                              </TableCell>
                              <TableCell className="text-center border-r border-border">
                                {param.min_value}
                              </TableCell>
                              <TableCell className="text-center">{param.max_value}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="border-r border-border p-4">
                              <div className="flex flex-col items-center">
                                <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-3">
                                  {equipment.image_url ? (
                                    <img
                                      src={equipment.image_url}
                                      alt={equipment.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <span className="font-semibold text-center text-sm">
                                  {equipment.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="border-r border-border text-center font-medium">
                              {equipment.material}
                            </TableCell>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No parameters defined
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipments;
