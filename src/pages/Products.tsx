import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import ClientsList from "@/components/ClientsList";
import PartnersSlider from "@/components/PartnersSlider";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 animate-fade-up">
            Our <span className="text-primary">Products</span>
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto animate-fade-in">
            Discover our comprehensive range of precision-engineered machinery solutions
          </p>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No products available at the moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-border/50 animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {product.image_url && (
                    <div className="h-64 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ClientsList />
      
      <PartnersSlider />

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">© 2025 Shivansh Engineering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
