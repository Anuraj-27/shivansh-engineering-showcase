import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  display_order: number | null;
}

const MachinerySlider = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

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

  if (loading || images.length === 0) {
    return null;
  }

  return (
    <section className="pt-28 pb-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 animate-fade-up">
          Our <span className="text-accent">Machinery</span>
        </h2>
        
        <div className="relative h-72 max-w-2xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.title || `Machinery ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachinerySlider;
