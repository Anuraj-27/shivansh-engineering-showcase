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
import { Trash2, Check, X } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [machineryImages, setMachineryImages] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Product form
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");

  // Partner form
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState("");

  // Owner form
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [ownerThought, setOwnerThought] = useState("");

  // Machinery form
  const [machineryImage, setMachineryImage] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

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
    const { data: feedbackData } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    const { data: ownerData } = await supabase.from("owner_info").select("*").limit(1).maybeSingle();
    const { data: machineryData } = await supabase.from("machinery_images").select("*").order("display_order", { ascending: true });

    setProducts(productsData || []);
    setPartners(partnersData || []);
    setFeedback(feedbackData || []);
    setOwnerInfo(ownerData);
    setMachineryImages(machineryData || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const addProduct = async () => {
    if (!productName || !productPrice) {
      toast.error("Please fill in required fields");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: productName,
        description: productDesc,
        price: parseFloat(productPrice),
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
      setProductPrice("");
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

  const saveOwnerInfo = async () => {
    if (!ownerPhoto || !ownerThought) {
      toast.error("Please fill in all fields");
      return;
    }

    if (ownerInfo) {
      const { error } = await supabase
        .from("owner_info")
        .update({ photo_url: ownerPhoto, thought: ownerThought })
        .eq("id", ownerInfo.id);

      if (error) {
        toast.error("Failed to update owner info");
      } else {
        toast.success("Owner info updated");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("owner_info")
        .insert([{ photo_url: ownerPhoto, thought: ownerThought }]);

      if (error) {
        toast.error("Failed to add owner info");
      } else {
        toast.success("Owner info added");
        setOwnerPhoto("");
        setOwnerThought("");
        fetchData();
      }
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
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
              <TabsTrigger value="machinery">Machinery</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Image URL"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="md:col-span-2"
                  />
                  <Textarea
                    placeholder="Description"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    className="md:col-span-2"
                  />
                  <Button onClick={addProduct} className="md:col-span-2">
                    Add Product
                  </Button>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-2">{product.description}</p>
                    <p className="text-2xl font-bold text-primary mb-4">₹{product.price}</p>
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
                  <Input
                    placeholder="Logo URL"
                    value={partnerLogo}
                    onChange={(e) => setPartnerLogo(e.target.value)}
                  />
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

            <TabsContent value="owner" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {ownerInfo ? "Update Owner Info" : "Add Owner Info"}
                </h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Owner Photo URL"
                    value={ownerPhoto || ownerInfo?.photo_url || ""}
                    onChange={(e) => setOwnerPhoto(e.target.value)}
                  />
                  <Textarea
                    placeholder="Owner's Thought"
                    value={ownerThought || ownerInfo?.thought || ""}
                    onChange={(e) => setOwnerThought(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={saveOwnerInfo}>
                    {ownerInfo ? "Update Owner Info" : "Add Owner Info"}
                  </Button>
                </div>
              </Card>

              {ownerInfo && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Current Owner Info</h3>
                  <div className="flex gap-4">
                    <img
                      src={ownerInfo.photo_url}
                      alt="Owner"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-muted-foreground italic">"{ownerInfo.thought}"</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="machinery" className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Add Machinery Image</h2>
                <div className="grid gap-4">
                  <Input
                    placeholder="Machinery Image URL"
                    value={machineryImage}
                    onChange={(e) => setMachineryImage(e.target.value)}
                  />
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
