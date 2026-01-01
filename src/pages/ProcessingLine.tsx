import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { PROCESSING_LINE_CATEGORIES } from "@/lib/processingLineCategories";

const ProcessingLine = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Processing <span className="text-primary">Lines</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our comprehensive range of processing line equipment for the metal rolling industry.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESSING_LINE_CATEGORIES.map((category) => (
              <Link key={category.slug} to={`/processing-line/${category.slug}`}>
                <Card className="p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    View specifications and details
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingLine;
