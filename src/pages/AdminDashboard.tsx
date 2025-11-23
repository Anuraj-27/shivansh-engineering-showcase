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

  // Product form
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");

  // Partner form
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState("");

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const { data: productsData } = await supabase.from("products").select("*");
    const { data: partnersData } = await supabase.from("partners").select("*");
    const { data: feedbackData } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });

    setProducts(productsData || []);
    setPartners(partnersData || []);
    setFeedback(feedbackData || []);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
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
        image_url: productImage,
      },
    ]);

    if (error) {
      toast.error("Failed to add product");
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
      toast.error("Failed to add partner");
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
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
