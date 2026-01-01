import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfoBlock = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Address</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unit II, Gat No 882/1/3A,<br />
              Behind Nisarg Hotel, Pune Nagar Road,<br />
              Sanaswadi, Tal. Shirur,<br />
              Dist. Pune (MH) 412 208
            </p>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Mobile No</p>
            <a 
              href="tel:8888845711" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              8888845711
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Email</p>
            <a 
              href="mailto:shivanshengineering@yahoo.in" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
            >
              shivanshengineering@yahoo.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoBlock;