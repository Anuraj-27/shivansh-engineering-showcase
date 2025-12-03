import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    console.log("Processing inquiry from:", name);

    const emailResponse = await resend.emails.send({
      from: "Shivansh Engineering <onboarding@resend.dev>",
      to: ["shivanshengineering@yahoo.in"],
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">🔔 New Inquiry Received</h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📱 Mobile:</strong> ${mobile}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>💼 Designation:</strong> ${designation || "Not provided"}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #555; margin-top: 0;">📝 Description:</h3>
            <p style="color: #333; line-height: 1.6;">${description}</p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            This inquiry was submitted through the Shivansh Engineering website.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry sent successfully!"
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
