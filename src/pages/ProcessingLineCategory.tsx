import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import FixedSpecificationTable from "@/components/FixedSpecificationTable";
import { PROCESSING_LINE_CATEGORIES, getCategoryName } from "@/lib/processingLineCategories";
import { FixedSpecificationData } from "@/lib/fixedParameters";

interface ProcessingLineProduct {
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

    setProducts(productsData || []);
    setLoading(false);
  };

  const getSpecificationData = (product: ProcessingLineProduct): FixedSpecificationData => ({
    sheet_width_min: product.sheet_width_min,
    sheet_width_max: product.sheet_width_max,
    sheet_thickness_min: product.sheet_thickness_min,
    sheet_thickness_max: product.sheet_thickness_max,
    line_speed_min: product.line_speed_min,
    line_speed_max: product.line_speed_max,
    coil_weight_min: product.coil_weight_min,
    coil_weight_max: product.coil_weight_max,
    material: product.material,
  });

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
                <FixedSpecificationTable
                  key={product.id}
                  name={product.name}
                  imageUrl={product.image_url}
                  data={getSpecificationData(product)}
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
