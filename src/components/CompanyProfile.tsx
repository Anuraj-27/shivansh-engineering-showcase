import { Card } from "@/components/ui/card";

const CompanyProfile = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <Card className="max-w-6xl mx-auto p-8 md:p-12 border-border/50 hover:shadow-xl transition-all animate-fade-in">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary">
            Company Profile
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              We are working in the field of Steel processing line and Rolling Industry since 2006. 
              We have experience of Designing and Installing various types of Lines as per Customer 
              Requirement required for finishing, processing and quality assurance of strip made of 
              Carbon Steel, Stainless Steel or Aluminium & Copper Industries.
            </p>
            
            <p className="text-lg">
              We are Providing Complete solution for sheet process industry with consultancy services, 
              Equipment Design, Equipment Manufacturing, Erection & Commissioning Services as per client requirement:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Consultancy Services for Up-gradation of various equipment's for Metal Rolling Industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Design of various machinery required for Metal Rolling Industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Engineering of various machinery required for Metal Rolling Industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Manufacture and Supply of various machineries for Metal Rolling Industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Erection and Commissioning of various machineries for Metal Rolling Industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Refurbish various equipment already procured by customer</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Reverse engineering for old equipment's as per customer required</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Engineering for second hand lines like preparing GA drawings, Foundation drawings, plant layout, utility layouts, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Re-Engineering and replacement of machine or critical parts in existing lines</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <span>Foundation drawing preparation</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CompanyProfile;
