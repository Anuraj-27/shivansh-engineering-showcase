import Navigation from "@/components/Navigation";

const Equipments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Our <span className="text-primary">Equipments</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover our range of industrial equipment solutions.
          </p>

          <div className="text-center py-12">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipments;
