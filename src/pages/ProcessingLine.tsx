import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Parameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
  display_order: number;
}

interface ProcessingLineProduct {
  id: string;
  name: string;
  image_url: string | null;
  display_order: number;
  parameters: Parameter[];
}

const ProcessingLine = () => {
  const [products, setProducts] = useState<ProcessingLineProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: productsData, error: productsError } = await supabase
      .from("processing_line_products")
      .select("*")
      .order("display_order", { ascending: true });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      setLoading(false);
      return;
    }

    // Fetch parameters for each product
    const productsWithParams: ProcessingLineProduct[] = await Promise.all(
      (productsData || []).map(async (product) => {
        const { data: paramsData } = await supabase
          .from("processing_line_parameters")
          .select("*")
          .eq("product_id", product.id)
          .order("display_order", { ascending: true });

        return {
          ...product,
          parameters: paramsData || [],
        };
      })
    );

    setProducts(productsWithParams);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Processing <span className="text-primary">Line</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our comprehensive range of processing line equipment with detailed specifications.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No processing line products available yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                    {/* Left: Image and Name */}
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-center">{product.name}</h3>
                    </div>

                    {/* Right: Supply Range Table */}
                    <div className="flex flex-col">
                      <h4 className="text-lg font-semibold mb-4 text-primary">Supply Range</h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-bold">Parameter</TableHead>
                              <TableHead className="font-bold text-center">Min</TableHead>
                              <TableHead className="font-bold text-center">Max</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.parameters.length > 0 ? (
                              product.parameters.map((param) => (
                                <TableRow key={param.id}>
                                  <TableCell className="font-medium">{param.parameter_name}</TableCell>
                                  <TableCell className="text-center">{param.min_value}</TableCell>
                                  <TableCell className="text-center">{param.max_value}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                  No parameters defined
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingLine;
