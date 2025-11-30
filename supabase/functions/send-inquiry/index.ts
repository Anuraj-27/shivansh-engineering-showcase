import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  name: string;
  mobile: string;
  email: string;
  designation: string;
  description: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData: InquiryRequest = await req.json();
    const { name, mobile, email, designation, description } = inquiryData;

    // Generate WhatsApp message
    const whatsappMessage = `New Inquiry from ${name}
Mobile: ${mobile}
Email: ${email}
Designation: ${designation || "Not provided"}
Description: ${description}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=918888845711&text=${encodeURIComponent(whatsappMessage)}`;

    console.log("Inquiry processed successfully");
    console.log("WhatsApp URL:", whatsappUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry sent successfully",
        whatsappUrl 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error processing inquiry:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
