import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Edit, Save, Plus } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  display_order: number;
}

const EquipmentAdmin = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [eqName, setEqName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    setLoading(true);
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

  const addEquipment = async () => {
    if (!eqName.trim()) {
      toast.error("Please enter equipment name");
      return;
    }
    const { error } = await supabase.from("equipments").insert([{ name: eqName.trim() }]);
    if (error) {
      toast.error("Failed to add equipment: " + error.message);
    } else {
      toast.success("Equipment added");
      setEqName("");
      fetchEquipments();
    }
  };

  const updateEquipment = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const { error } = await supabase
      .from("equipments")
      .update({ name: editName.trim() })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success("Equipment updated");
      setEditingId(null);
      fetchEquipments();
    }
  };

  const deleteEquipment = async (id: string) => {
    const { error } = await supabase.from("equipments").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Equipment deleted");
      fetchEquipments();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Equipment</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Equipment Name"
            value={eqName}
            onChange={(e) => setEqName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEquipment()}
          />
          <Button onClick={addEquipment}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : equipments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No equipments yet.</p>
      ) : (
        <div className="grid gap-3">
          {equipments.map((equipment) => (
            <Card key={equipment.id} className="p-4 flex items-center gap-3">
              {editingId === equipment.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => updateEquipment(equipment.id)}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <p className="flex-1 font-medium">{equipment.name}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(equipment.id);
                      setEditName(equipment.name);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEquipment(equipment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentAdmin;
