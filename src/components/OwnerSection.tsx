import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface OwnerInfo {
  photo_url: string;
  thought: string;
}

const OwnerSection = () => {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerInfo();
  }, []);

  const fetchOwnerInfo = async () => {
    const { data, error } = await supabase
      .from("owner_info")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching owner info:", error);
    } else {
      setOwnerInfo(data);
    }
    setLoading(false);
  };

  if (loading || !ownerInfo) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 border-border/50 hover:shadow-xl transition-all animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 flex-shrink-0">
              <img
                src={ownerInfo.photo_url}
                alt="Owner"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <span className="text-6xl text-primary/20 absolute -top-4 -left-2">"</span>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pl-8 italic">
                  {ownerInfo.thought}
                </p>
                <span className="text-6xl text-primary/20 absolute -bottom-8 right-0">"</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default OwnerSection;
