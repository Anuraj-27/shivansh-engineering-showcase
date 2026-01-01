import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  display_order: number | null;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching gallery images:", error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 animate-fade-in">
            Explore our work and projects
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-xl text-muted-foreground">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-xl text-muted-foreground">No images in gallery yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {image.title && (
                    <p className="text-sm font-semibold text-foreground mb-2 truncate">
                      {image.title}
                    </p>
                  )}
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">
            © 2025 Shivansh Engineering. All rights reserved.
          </p>
          <p className="text-primary-foreground/80 mt-2">
            Excellence in Mechanical Engineering
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
