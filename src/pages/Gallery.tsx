import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  display_order: number | null;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const openModal = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => openModal(image)}
                  className="group relative bg-card border border-border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Fixed height container for consistent card sizes */}
                  <div className="w-full h-48 flex items-center justify-center p-2 bg-muted/30">
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {image.title && (
                    <div className="p-3 border-t border-border">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {image.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => closeModal()}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-background/95 backdrop-blur-sm border-border overflow-hidden">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-border transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          
          {selectedImage && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-full max-h-[70vh] flex items-center justify-center">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title || "Gallery image"}
                  className="max-w-full max-h-[70vh] object-contain animate-scale-in"
                />
              </div>
              {selectedImage.title && (
                <p className="mt-4 text-lg font-semibold text-foreground text-center">
                  {selectedImage.title}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
