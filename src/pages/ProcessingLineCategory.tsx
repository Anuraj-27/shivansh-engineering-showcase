import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import SpecificationCard from "@/components/SpecificationCard";
import { PROCESSING_LINE_CATEGORIES, getCategoryName } from "@/lib/processingLineCategories";

interface Parameter {
  id: string;
  parameter_name: string;
  min_value: number;
  max_value: number;
  unit: string;
  display_order: number;
}

interface ProcessingLineProduct {
  id: string;
  name: string;
  image_url: string | null;
  display_order: number;
  parameters: Parameter[];
}

const ProcessingLineCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ProcessingLineProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = getCategoryName(category || "");
  const isValidCategory = PROCESSING_LINE_CATEGORIES.some((c) => c.slug === category);

  useEffect(() => {
    if (isValidCategory && category) {
      fetchProducts(category);
    } else {
      setLoading(false);
    }
  }, [category, isValidCategory]);

  const fetchProducts = async (categorySlug: string) => {
    const { data: productsData, error: productsError } = await supabase
      .from("processing_line_products")
      .select("*")
      .eq("category", categorySlug)
      .order("display_order", { ascending: true });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      setLoading(false);
      return;
    }

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

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">The requested processing line category does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-primary">{categoryName}</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our {categoryName.toLowerCase()} equipment with detailed specifications.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading specifications...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No specifications available for {categoryName} yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {products.map((product) => (
                <SpecificationCard
                  key={product.id}
                  name={product.name}
                  imageUrl={product.image_url}
                  parameters={product.parameters}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingLineCategory;
