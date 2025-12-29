import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Check, X, Upload, UserPlus, Shield, Plus, Edit, Save } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [machineryImages, setMachineryImages] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [processingLineProducts, setProcessingLineProducts] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Product form
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productImage, setProductImage] = useState("");

  // Partner form
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState("");

  // Client form
  const [clientName, setClientName] = useState("");

  // Machinery form
  const [machineryImage, setMachineryImage] = useState("");

  // Gallery form
  const [galleryImage, setGalleryImage] = useState("");
  const [galleryTitle, setGalleryTitle] = useState("");

  // Admin form
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Processing Line form
  const [plProductName, setPlProductName] = useState("");
  const [plProductImage, setPlProductImage] = useState("");
  const [editingPlProduct, setEditingPlProduct] = useState<string | null>(null);
  const [editPlProductName, setEditPlProductName] = useState("");
  const [editPlProductImage, setEditPlProductImage] = useState("");
  
  // Parameter form
  const [newParamProductId, setNewParamProductId] = useState<string | null>(null);
  const [newParamName, setNewParamName] = useState("");
  const [newParamMin, setNewParamMin] = useState("0");
  const [newParamMax, setNewParamMax] = useState("0");

  // Equipment form
  const [eqName, setEqName] = useState("");
  const [eqImage, setEqImage] = useState("");
  const [eqMaterial, setEqMaterial] = useState("0");
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [editEqName, setEditEqName] = useState("");
  const [editEqImage, setEditEqImage] = useState("");
  const [editEqMaterial, setEditEqMaterial] = useState("");
  
  // Equipment parameter form
  const [newEqParamEquipmentId, setNewEqParamEquipmentId] = useState<string | null>(null);
  const [newEqParamName, setNewEqParamName] = useState("");
  const [newEqParamMin, setNewEqParamMin] = useState("0");
  const [newEqParamMax, setNewEqParamMax] = useState("0");

  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

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

    const url = await uploadFile(file, 'uploads');
    if (url) {
      setUrlFunction(url);
      toast.success("File uploaded successfully");
    }
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to access admin dashboard");
      navigate("/admin");
      return;
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      toast.error("Unauthorized: Admin access required");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
    fetchData();
  };

  const fetchData = async () => {
    const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: partnersData } = await supabase.from("partners").select("*").order("display_order", { ascending: true });
    const { data: clientsData } = await supabase.from("clients").select("*").order("display_order", { ascending: true });
    const { data: feedbackData } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    const { data: machineryData } = await supabase.from("machinery_images").select("*").order("display_order", { ascending: true });
    const { data: galleryData } = await supabase.from("gallery_images").select("*").order("display_order", { ascending: true });

    setProducts(productsData || []);
    setPartners(partnersData || []);
    setClients(clientsData || []);
    setFeedback(feedbackData || []);
    setMachineryImages(machineryData || []);
    setGalleryImages(galleryData || []);
    
    // Fetch processing line products with parameters
    await fetchProcessingLineProducts();
    
    // Fetch equipments with parameters
    await fetchEquipments();
  };

  const fetchProcessingLineProducts = async () => {
    const { data: plProducts } = await supabase
      .from("processing_line_products")
      .select("*")
      .order("display_order", { ascending: true });

    const productsWithParams = await Promise.all(
      (plProducts || []).map(async (product) => {
        const { data: params } = await supabase
          .from("processing_line_parameters")
          .select("*")
          .eq("product_id", product.id)
          .order("display_order", { ascending: true });
        return { ...product, parameters: params || [] };
      })
    );

    setProcessingLineProducts(productsWithParams);
  };

  const fetchEquipments = async () => {
    const { data: eqData } = await supabase
      .from("equipments")
      .select("*")
      .order("display_order", { ascending: true });

    const equipmentsWithParams = await Promise.all(
      (eqData || []).map(async (equipment) => {
        const { data: params } = await supabase
          .from("equipment_parameters")
          .select("*")
          .eq("equipment_id", equipment.id)
          .order("display_order", { ascending: true });
        return { ...equipment, parameters: params || [] };
      })
    );

    setEquipments(equipmentsWithParams);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const addProduct = async () => {
    if (!productName) {
      toast.error("Please fill in product name");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: productName,
        description: productDesc,
        price: 0,
        image_url: productImage || null,
      },
    ]);

    if (error) {
      toast.error("Failed to add product: " + error.message);
      console.error("Error adding product:", error);
    } else {
      toast.success("Product added successfully");
      setProductName("");
      setProductDesc("");
      setProductImage("");
      fetchData();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  const addPartner = async () => {
    if (!partnerName || !partnerLogo) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("partners").insert([
      {
        name: partnerName,
        logo_url: partnerLogo,
      },
    ]);

    if (error) {
      toast.error("Failed to add partner: " + error.message);
    } else {
      toast.success("Partner added successfully");
      setPartnerName("");
      setPartnerLogo("");
      fetchData();
    }
  };

  const deletePartner = async (id: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete partner");
    } else {
      toast.success("Partner deleted");
      fetchData();
    }
  };

  const addClient = async () => {
    if (!clientName) {
      toast.error("Please enter client name");
      return;
    }

    const { error } = await supabase.from("clients").insert([
      { name: clientName },
    ]);

    if (error) {
      toast.error("Failed to add client: " + error.message);
    } else {
      toast.success("Client added successfully");
      setClientName("");
      fetchData();
    }
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete client");
    } else {
      toast.success("Client deleted");
      fetchData();
    }
  };

  const updateFeedbackStatus = async (id: string, isApproved: boolean) => {
    const { error } = await supabase
      .from("feedback")
      .update({ is_approved: isApproved })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update feedback");
    } else {
      toast.success(isApproved ? "Feedback approved" : "Feedback rejected");
      fetchData();
    }
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete feedback");
    } else {
      toast.success("Feedback deleted");
      fetchData();
    }
  };

  const addMachineryImage = async () => {
    if (!machineryImage) {
      toast.error("Please provide an image URL");
      return;
    }

    const { error } = await supabase.from("machinery_images").insert([
      { image_url: machineryImage },
    ]);

    if (error) {
      toast.error("Failed to add machinery image");
    } else {
      toast.success("Machinery image added");
      setMachineryImage("");
      fetchData();
    }
  };

  const deleteMachineryImage = async (id: string) => {
    const { error } = await supabase.from("machinery_images").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete machinery image");
    } else {
      toast.success("Machinery image deleted");
      fetchData();
    }
  };

  const addGalleryImage = async () => {
    if (!galleryImage) {
      toast.error("Please provide an image URL");
      return;
    }

    const { error } = await supabase.from("gallery_images").insert([
      { 
        image_url: galleryImage,
        title: galleryTitle || null
      },
    ]);

    if (error) {
      toast.error("Failed to add gallery image");
    } else {
      toast.success("Gallery image added");
      setGalleryImage("");
      setGalleryTitle("");
      fetchData();
    }
  };

  const createNewAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast.error("Please fill in email and password");
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setCreatingAdmin(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("create-admin", {
        body: { email: newAdminEmail, password: newAdminPassword },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to create admin");
      } else if (response.data?.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Admin account created successfully");
        setNewAdminEmail("");
        setNewAdminPassword("");
      }
    } catch (error: any) {
      toast.error("Failed to create admin: " + error.message);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete gallery image");
    } else {
      toast.success("Gallery image deleted");
      fetchData();
    }
  };

  // Processing Line functions
  const addProcessingLineProduct = async () => {
    if (!plProductName) {
      toast.error("Please enter product name");
      return;
    }

    const { error } = await supabase.from("processing_line_products").insert([
      {
        name: plProductName,
        image_url: plProductImage || null,
      },
    ]);

    if (error) {
      toast.error("Failed to add product: " + error.message);
    } else {
      toast.success("Product added successfully");
      setPlProductName("");
      setPlProductImage("");
      fetchProcessingLineProducts();
    }
  };

  const updateProcessingLineProduct = async (id: string) => {
    const { error } = await supabase
      .from("processing_line_products")
      .update({
        name: editPlProductName,
        image_url: editPlProductImage || null,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update product");
    } else {
      toast.success("Product updated");
      setEditingPlProduct(null);
      fetchProcessingLineProducts();
    }
  };

  const deleteProcessingLineProduct = async (id: string) => {
    const { error } = await supabase.from("processing_line_products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchProcessingLineProducts();
    }
  };

  const addParameter = async (productId: string) => {
    if (!newParamName) {
      toast.error("Please enter parameter name");
      return;
    }

    const { error } = await supabase.from("processing_line_parameters").insert([
      {
        product_id: productId,
        parameter_name: newParamName,
        min_value: parseFloat(newParamMin) || 0,
        max_value: parseFloat(newParamMax) || 0,
      },
    ]);

    if (error) {
      toast.error("Failed to add parameter: " + error.message);
    } else {
      toast.success("Parameter added");
      setNewParamProductId(null);
      setNewParamName("");
      setNewParamMin("0");
      setNewParamMax("0");
      fetchProcessingLineProducts();
    }
  };

  const deleteParameter = async (id: string) => {
    const { error } = await supabase.from("processing_line_parameters").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete parameter");
    } else {
      toast.success("Parameter deleted");
      fetchProcessingLineProducts();
    }
  };

  // Equipment functions
  const addEquipment = async () => {
    if (!eqName) {
      toast.error("Please enter equipment name");
      return;
    }

    const { error } = await supabase.from("equipments").insert([
      {
        name: eqName,
        image_url: eqImage || null,
        material: eqMaterial || "0",
      },
    ]);

    if (error) {
      toast.error("Failed to add equipment: " + error.message);
    } else {
      toast.success("Equipment added successfully");
      setEqName("");
      setEqImage("");
      setEqMaterial("0");
      fetchEquipments();
    }
  };

  const updateEquipment = async (id: string) => {
    const { error } = await supabase
      .from("equipments")
      .update({
        name: editEqName,
        image_url: editEqImage || null,
        material: editEqMaterial,
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

  const addEquipmentParameter = async (equipmentId: string) => {
    if (!newEqParamName) {
      toast.error("Please enter parameter name");
      return;
    }

    const { error } = await supabase.from("equipment_parameters").insert([
      {
        equipment_id: equipmentId,
        parameter_name: newEqParamName,
        min_value: parseFloat(newEqParamMin) || 0,
        max_value: parseFloat(newEqParamMax) || 0,
      },
    ]);

    if (error) {
      toast.error("Failed to add parameter: " + error.message);
    } else {
      toast.success("Parameter added");
      setNewEqParamEquipmentId(null);
      setNewEqParamName("");
      setNewEqParamMin("0");
      setNewEqParamMax("0");
      fetchEquipments();
    }
  };

  const deleteEquipmentParameter = async (id: string) => {
    const { error } = await supabase.from("equipment_parameters").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete parameter");
    } else {
      toast.success("Parameter deleted");
      fetchEquipments();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="processing-line">Processing Line</TabsTrigger>
              <TabsTrigger value="equipments">Equipments</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="machinery">Machinery</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setProductImage)}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('product-image-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? "Uploading..." : "Browse Image"}
                      </Button>
                    </label>
                    <Input
                      placeholder="Or paste Image URL"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                  />
                  <Button onClick={addProduct}>
                    Add Product
                  </Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <Button
                      onClick={() => deleteProduct(product.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="partners" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add New Partner</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Partner Name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setPartnerLogo)}
                        className="hidden"
                        id="partner-logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('partner-logo-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? "Uploading..." : "Browse Logo"}
                      </Button>
                    </label>
                    <Input
                      placeholder="Or paste Logo URL"
                      value={partnerLogo}
                      onChange={(e) => setPartnerLogo(e.target.value)}
                    />
                  </div>
                  <Button onClick={addPartner}>Add Partner</Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <Card key={partner.id} className="p-6">
                    <h3 className="text-xl font-bold mb-4">{partner.name}</h3>
                    <Button
                      onClick={() => deletePartner(partner.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add New Client</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <Button onClick={addClient}>Add Client</Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card key={client.id} className="p-6">
                    <h3 className="text-xl font-bold mb-4">{client.name}</h3>
                    <Button
                      onClick={() => deleteClient(client.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="machinery" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add Machinery Image</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setMachineryImage)}
                        className="hidden"
                        id="machinery-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('machinery-image-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? "Uploading..." : "Browse Image"}
                      </Button>
                    </label>
                    <Input
                      placeholder="Or paste Image URL"
                      value={machineryImage}
                      onChange={(e) => setMachineryImage(e.target.value)}
                    />
                  </div>
                  <Button onClick={addMachineryImage}>Add Image</Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {machineryImages.map((image) => (
                  <Card key={image.id} className="p-4">
                    <img
                      src={image.image_url}
                      alt="Machinery"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <Button
                      onClick={() => deleteMachineryImage(image.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add Gallery Image</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Image Title (Optional)"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setGalleryImage)}
                        className="hidden"
                        id="gallery-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('gallery-image-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? "Uploading..." : "Browse Image"}
                      </Button>
                    </label>
                    <Input
                      placeholder="Or paste Image URL"
                      value={galleryImage}
                      onChange={(e) => setGalleryImage(e.target.value)}
                    />
                  </div>
                  <Button onClick={addGalleryImage}>Add Image</Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="p-4">
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery"}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    {image.title && (
                      <p className="text-sm font-medium mb-2">{image.title}</p>
                    )}
                    <Button
                      onClick={() => deleteGalleryImage(image.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              {feedback.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rating: {item.rating}/5 | 
                        {item.is_approved ? " Approved" : " Pending"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!item.is_approved && (
                        <Button
                          onClick={() => updateFeedbackStatus(item.id, true)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {item.is_approved && (
                        <Button
                          onClick={() => updateFeedbackStatus(item.id, false)}
                          size="sm"
                          variant="secondary"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteFeedback(item.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{item.message}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="processing-line" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add Processing Line Product</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Product Name"
                    value={plProductName}
                    onChange={(e) => setPlProductName(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setPlProductImage)}
                        className="hidden"
                        id="pl-product-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('pl-product-image-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? "Uploading..." : "Browse Image"}
                      </Button>
                    </label>
                    <Input
                      placeholder="Or paste Image URL"
                      value={plProductImage}
                      onChange={(e) => setPlProductImage(e.target.value)}
                    />
                  </div>
                  <Button onClick={addProcessingLineProduct}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </Card>

              <div className="space-y-6">
                {processingLineProducts.map((product) => (
                  <Card key={product.id} className="p-6">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                      {/* Product Image & Name */}
                      <div className="flex flex-col items-center">
                        <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                          {editingPlProduct === product.id ? (
                            <div className="p-2 space-y-2 h-full flex flex-col justify-center">
                              <Input
                                placeholder="Image URL"
                                value={editPlProductImage}
                                onChange={(e) => setEditPlProductImage(e.target.value)}
                                className="text-xs"
                              />
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, setEditPlProductImage)}
                                  className="hidden"
                                  id={`edit-pl-image-${product.id}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById(`edit-pl-image-${product.id}`)?.click()}
                                  disabled={uploadingFile}
                                  className="w-full"
                                >
                                  <Upload className="w-3 h-3 mr-1" />
                                  {uploadingFile ? "..." : "Browse"}
                                </Button>
                              </label>
                            </div>
                          ) : product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                        {editingPlProduct === product.id ? (
                          <Input
                            value={editPlProductName}
                            onChange={(e) => setEditPlProductName(e.target.value)}
                            className="text-center"
                          />
                        ) : (
                          <h3 className="text-lg font-bold text-center">{product.name}</h3>
                        )}
                        <div className="flex gap-2 mt-4">
                          {editingPlProduct === product.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateProcessingLineProduct(product.id)}
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPlProduct(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingPlProduct(product.id);
                                  setEditPlProductName(product.name);
                                  setEditPlProductImage(product.image_url || "");
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProcessingLineProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Parameters Table */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Supply Range Parameters</h4>
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold">Parameter</th>
                                <th className="px-4 py-2 text-center font-semibold">Min</th>
                                <th className="px-4 py-2 text-center font-semibold">Max</th>
                                <th className="px-4 py-2 text-center font-semibold w-16">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.parameters.length > 0 ? (
                                product.parameters.map((param: any) => (
                                  <tr key={param.id} className="border-t">
                                    <td className="px-4 py-2">{param.parameter_name}</td>
                                    <td className="px-4 py-2 text-center">{param.min_value}</td>
                                    <td className="px-4 py-2 text-center">{param.max_value}</td>
                                    <td className="px-4 py-2 text-center">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteParameter(param.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                                    No parameters added yet
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Parameter Form */}
                        {newParamProductId === product.id ? (
                          <div className="flex flex-wrap gap-2 items-end">
                            <Input
                              placeholder="Parameter Name"
                              value={newParamName}
                              onChange={(e) => setNewParamName(e.target.value)}
                              className="flex-1 min-w-[150px]"
                            />
                            <Input
                              placeholder="Min"
                              type="number"
                              value={newParamMin}
                              onChange={(e) => setNewParamMin(e.target.value)}
                              className="w-20"
                            />
                            <Input
                              placeholder="Max"
                              type="number"
                              value={newParamMax}
                              onChange={(e) => setNewParamMax(e.target.value)}
                              className="w-20"
                            />
                            <Button size="sm" onClick={() => addParameter(product.id)}>
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setNewParamProductId(null);
                                setNewParamName("");
                                setNewParamMin("0");
                                setNewParamMax("0");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setNewParamProductId(product.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Parameter
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {processingLineProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No processing line products yet. Add your first product above.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="equipments" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add Equipment</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Equipment Name"
                    value={eqName}
                    onChange={(e) => setEqName(e.target.value)}
                  />
                  <Input
                    placeholder="Material"
                    value={eqMaterial}
                    onChange={(e) => setEqMaterial(e.target.value)}
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

              <div className="space-y-6">
                {equipments.map((equipment) => (
                  <Card key={equipment.id} className="p-6">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                      {/* Equipment Image, Name & Material */}
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
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                        {editingEquipment === equipment.id ? (
                          <div className="space-y-2 w-full">
                            <Input
                              value={editEqName}
                              onChange={(e) => setEditEqName(e.target.value)}
                              placeholder="Equipment Name"
                              className="text-center"
                            />
                            <Input
                              value={editEqMaterial}
                              onChange={(e) => setEditEqMaterial(e.target.value)}
                              placeholder="Material"
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <h3 className="text-lg font-bold">{equipment.name}</h3>
                            <p className="text-sm text-muted-foreground">Material: {equipment.material}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          {editingEquipment === equipment.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateEquipment(equipment.id)}
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEquipment(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingEquipment(equipment.id);
                                  setEditEqName(equipment.name);
                                  setEditEqImage(equipment.image_url || "");
                                  setEditEqMaterial(equipment.material);
                                }}
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

                      {/* Parameters Table */}
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Range Parameters</h4>
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold">Parameter</th>
                                <th className="px-4 py-2 text-center font-semibold">Min</th>
                                <th className="px-4 py-2 text-center font-semibold">Max</th>
                                <th className="px-4 py-2 text-center font-semibold w-16">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {equipment.parameters.length > 0 ? (
                                equipment.parameters.map((param: any) => (
                                  <tr key={param.id} className="border-t">
                                    <td className="px-4 py-2">{param.parameter_name}</td>
                                    <td className="px-4 py-2 text-center">{param.min_value}</td>
                                    <td className="px-4 py-2 text-center">{param.max_value}</td>
                                    <td className="px-4 py-2 text-center">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteEquipmentParameter(param.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                                    No parameters added yet
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Parameter Form */}
                        {newEqParamEquipmentId === equipment.id ? (
                          <div className="flex flex-wrap gap-2 items-end">
                            <Input
                              placeholder="Parameter Name"
                              value={newEqParamName}
                              onChange={(e) => setNewEqParamName(e.target.value)}
                              className="flex-1 min-w-[150px]"
                            />
                            <Input
                              placeholder="Min"
                              type="number"
                              value={newEqParamMin}
                              onChange={(e) => setNewEqParamMin(e.target.value)}
                              className="w-20"
                            />
                            <Input
                              placeholder="Max"
                              type="number"
                              value={newEqParamMax}
                              onChange={(e) => setNewEqParamMax(e.target.value)}
                              className="w-20"
                            />
                            <Button size="sm" onClick={() => addEquipmentParameter(equipment.id)}>
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setNewEqParamEquipmentId(null);
                                setNewEqParamName("");
                                setNewEqParamMin("0");
                                setNewEqParamMax("0");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setNewEqParamEquipmentId(equipment.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Parameter
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {equipments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No equipments yet. Add your first equipment above.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="space-y-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Create New Admin</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Only existing admins can create new admin accounts. Share the login credentials securely with the new admin.
                </p>
                <div className="grid gap-4 max-w-md">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                  />
                  <Button 
                    onClick={createNewAdmin} 
                    disabled={creatingAdmin}
                    className="w-fit"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {creatingAdmin ? "Creating..." : "Create Admin Account"}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Security Note</h3>
                <p className="text-sm text-muted-foreground">
                  Admin accounts have full access to manage products, partners, gallery, feedback, and create other admins. 
                  Only create accounts for trusted team members.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
