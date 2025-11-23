import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

const FeedbackDisplay = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching feedback:", error);
    } else {
      setFeedback(data || []);
    }
  };

  if (feedback.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12 animate-fade-up">
          What Our <span className="text-primary">Clients Say</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedback.map((item, index) => (
            <Card
              key={item.id}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 bg-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < item.rating
                        ? "text-accent fill-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{item.message}"</p>
              <p className="text-foreground font-semibold">— {item.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackDisplay;
