import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Edit, Save, Upload, Plus } from "lucide-react";
import { FixedSpecificationData, DEFAULT_SPECIFICATION_DATA } from "@/lib/fixedParameters";
import FixedParameterEditor from "@/components/admin/FixedParameterEditor";

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

const EquipmentAdmin = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Equipment form
  const [eqName, setEqName] = useState("");
  const [eqImage, setEqImage] = useState("");

  // Editing state
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [editEqName, setEditEqName] = useState("");
  const [editEqImage, setEditEqImage] = useState("");
  const [editEqData, setEditEqData] = useState<FixedSpecificationData>(DEFAULT_SPECIFICATION_DATA);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error: any) {
      toast.error("Failed to upload file: " + error.message);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setUrlFunction: (url: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'equipments');
    if (url) {
      setUrlFunction(url);
      toast.success("File uploaded successfully");
    }
  };

  const fetchEquipments = async () => {
    setLoading(true);
    const { data: eqData, error } = await supabase
      .from("equipments")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching equipments:", error);
      setLoading(false);
      return;
    }

    setEquipments(eqData || []);
    setLoading(false);
  };

  const addEquipment = async () => {
    if (!eqName) {
      toast.error("Please enter equipment name");
      return;
    }

    const { error } = await supabase.from("equipments").insert([
      {
        name: eqName,
        image_url: eqImage || null,
      },
    ]);

    if (error) {
      toast.error("Failed to add equipment: " + error.message);
    } else {
      toast.success("Equipment added successfully");
      setEqName("");
      setEqImage("");
      fetchEquipments();
    }
  };

  const updateEquipment = async (id: string) => {
    const { error } = await supabase
      .from("equipments")
      .update({
        name: editEqName,
        image_url: editEqImage || null,
        ...editEqData,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update equipment");
    } else {
      toast.success("Equipment updated");
      setEditingEquipment(null);
      fetchEquipments();
    }
  };

  const deleteEquipment = async (id: string) => {
    const { error } = await supabase.from("equipments").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete equipment");
    } else {
      toast.success("Equipment deleted");
      fetchEquipments();
    }
  };

  const handleEditDataChange = (field: keyof FixedSpecificationData, value: number | string) => {
    setEditEqData(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = (equipment: Equipment) => {
    setEditingEquipment(equipment.id);
    setEditEqName(equipment.name);
    setEditEqImage(equipment.image_url || "");
    setEditEqData({
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
  };

  return (
    <div className="space-y-8">
      {/* Add Equipment Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add Equipment</h2>
        <div className="grid gap-4">
          <Input
            placeholder="Equipment Name"
            value={eqName}
            onChange={(e) => setEqName(e.target.value)}
          />
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setEqImage)}
                className="hidden"
                id="eq-image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('eq-image-upload')?.click()}
                disabled={uploadingFile}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingFile ? "Uploading..." : "Browse Image"}
              </Button>
            </label>
            <Input
              placeholder="Or paste Image URL"
              value={eqImage}
              onChange={(e) => setEqImage(e.target.value)}
            />
          </div>
          <Button onClick={addEquipment}>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </Card>

      {/* Equipments List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading equipments...</p>
      ) : equipments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No equipments yet. Add your first equipment above.
        </p>
      ) : (
        <div className="space-y-6">
          {equipments.map((equipment) => (
            <Card key={equipment.id} className="p-6">
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                {/* Equipment Image & Name */}
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    {editingEquipment === equipment.id ? (
                      <div className="p-2 space-y-2 h-full flex flex-col justify-center">
                        <Input
                          placeholder="Image URL"
                          value={editEqImage}
                          onChange={(e) => setEditEqImage(e.target.value)}
                          className="text-xs"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setEditEqImage)}
                            className="hidden"
                            id={`edit-eq-image-${equipment.id}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`edit-eq-image-${equipment.id}`)?.click()}
                            disabled={uploadingFile}
                            className="w-full"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            {uploadingFile ? "..." : "Browse"}
                          </Button>
                        </label>
                      </div>
                    ) : equipment.image_url ? (
                      <img
                        src={equipment.image_url}
                        alt={equipment.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  {editingEquipment === equipment.id ? (
                    <Input
                      value={editEqName}
                      onChange={(e) => setEditEqName(e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-center">{equipment.name}</h3>
                  )}
                  <div className="flex gap-2 mt-4">
                    {editingEquipment === equipment.id ? (
                      <>
                        <Button size="sm" onClick={() => updateEquipment(equipment.id)}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingEquipment(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(equipment)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
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
                  </div>
                </div>

                {/* Fixed Specification Table */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Specification (Edit Min/Max Values Only)</h4>
                  {editingEquipment === equipment.id ? (
                    <FixedParameterEditor
                      data={editEqData}
                      onChange={handleEditDataChange}
                    />
                  ) : (
                    <FixedParameterEditor
                      data={{
                        sheet_width_min: equipment.sheet_width_min,
                        sheet_width_max: equipment.sheet_width_max,
                        sheet_thickness_min: equipment.sheet_thickness_min,
                        sheet_thickness_max: equipment.sheet_thickness_max,
                        line_speed_min: equipment.line_speed_min,
                        line_speed_max: equipment.line_speed_max,
                        coil_weight_min: equipment.coil_weight_min,
                        coil_weight_max: equipment.coil_weight_max,
                        material: equipment.material,
                      }}
                      onChange={() => {}}
                      disabled
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentAdmin;
