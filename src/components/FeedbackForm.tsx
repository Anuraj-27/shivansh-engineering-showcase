import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || rating === 0 || !message.trim()) {
      toast.error("Please fill in all fields and select a rating");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("feedback").insert([
      {
        name: name.trim(),
        rating,
        message: message.trim(),
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } else {
      toast.success("Thank you! Your feedback has been submitted for review.");
      setName("");
      setRating(0);
      setMessage("");
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12 animate-fade-up">
          Share Your <span className="text-primary">Experience</span>
        </h2>

        <Card className="p-8 border-border/50 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "text-accent fill-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Feedback
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full min-h-32"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-105 transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default FeedbackForm;
