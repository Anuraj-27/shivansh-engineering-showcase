import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, Edit, Save, Upload } from "lucide-react";
import { PROCESSING_LINE_CATEGORIES, getCategoryName } from "@/lib/processingLineCategories";

interface Parameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
  unit: string;
  display_order: number;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  category: string;
  display_order: number;
  parameters: Parameter[];
}

const ProcessingLineAdmin = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(PROCESSING_LINE_CATEGORIES[0].slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Product form
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductImage, setEditProductImage] = useState("");

  // Parameter form
  const [newParamProductId, setNewParamProductId] = useState<string | null>(null);
  const [newParamName, setNewParamName] = useState("");
  const [newParamMin, setNewParamMin] = useState("0");
  const [newParamMax, setNewParamMax] = useState("0");
  const [newParamUnit, setNewParamUnit] = useState("mm");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

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
    const url = await uploadFile(file, 'processing-line');
    if (url) {
      setUrlFunction(url);
      toast.success("File uploaded successfully");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data: productsData, error } = await supabase
      .from("processing_line_products")
      .select("*")
      .eq("category", selectedCategory)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }

    const productsWithParams = await Promise.all(
      (productsData || []).map(async (product) => {
        const { data: params } = await supabase
          .from("processing_line_parameters")
          .select("*")
          .eq("product_id", product.id)
          .order("display_order", { ascending: true });
        return { ...product, parameters: params || [] };
      })
    );

    setProducts(productsWithParams);
    setLoading(false);
  };

  const addProduct = async () => {
    if (!productName) {
      toast.error("Please enter product name");
      return;
    }

    const { error } = await supabase.from("processing_line_products").insert([
      {
        name: productName,
        image_url: productImage || null,
        category: selectedCategory,
      },
    ]);

    if (error) {
      toast.error("Failed to add product: " + error.message);
    } else {
      toast.success("Product added successfully");
      setProductName("");
      setProductImage("");
      fetchProducts();
    }
  };

  const updateProduct = async (id: string) => {
    const { error } = await supabase
      .from("processing_line_products")
      .update({
        name: editProductName,
        image_url: editProductImage || null,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update product");
    } else {
      toast.success("Product updated");
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("processing_line_products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchProducts();
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
        unit: newParamUnit || "mm",
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
      setNewParamUnit("mm");
      fetchProducts();
    }
  };

  const deleteParameter = async (id: string) => {
    const { error } = await supabase.from("processing_line_parameters").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete parameter");
    } else {
      toast.success("Parameter deleted");
      fetchProducts();
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Selector */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Select Processing Line Category</h2>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {PROCESSING_LINE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Add Product Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Add Product to {getCategoryName(selectedCategory)}
        </h2>
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
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <Button onClick={addProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </Card>

      {/* Products List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No products in {getCategoryName(selectedCategory)} yet. Add your first product above.
        </p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="grid md:grid-cols-[200px_1fr] gap-6">
                {/* Product Image & Name */}
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    {editingProduct === product.id ? (
                      <div className="p-2 space-y-2 h-full flex flex-col justify-center">
                        <Input
                          placeholder="Image URL"
                          value={editProductImage}
                          onChange={(e) => setEditProductImage(e.target.value)}
                          className="text-xs"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setEditProductImage)}
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
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  {editingProduct === product.id ? (
                    <Input
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-center">{product.name}</h3>
                  )}
                  <div className="flex gap-2 mt-4">
                    {editingProduct === product.id ? (
                      <>
                        <Button size="sm" onClick={() => updateProduct(product.id)}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product.id);
                            setEditProductName(product.name);
                            setEditProductImage(product.image_url || "");
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.id)}
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
                          <th className="px-4 py-2 text-center font-semibold">Unit</th>
                          <th className="px-4 py-2 text-center font-semibold w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.parameters.length > 0 ? (
                          product.parameters.map((param) => (
                            <tr key={param.id} className="border-t">
                              <td className="px-4 py-2">{param.parameter_name}</td>
                              <td className="px-4 py-2 text-center">{param.min_value}</td>
                              <td className="px-4 py-2 text-center">{param.max_value}</td>
                              <td className="px-4 py-2 text-center">{param.unit}</td>
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
                            <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
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
                      <Input
                        placeholder="Unit"
                        value={newParamUnit}
                        onChange={(e) => setNewParamUnit(e.target.value)}
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
                          setNewParamUnit("mm");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setNewParamProductId(product.id)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Parameter
                    </Button>
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

export default ProcessingLineAdmin;
