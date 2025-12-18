import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId, tenantId, landlordId, monthlyRent, securityDeposit, startDate, endDate, terms } = await req.json();

    console.log("Generating rent agreement for property:", propertyId);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Fetch property details
    const { data: property, error: propError } = await supabaseClient
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (propError || !property) {
      throw new Error("Property not found");
    }

    // Fetch tenant profile
    const { data: tenant } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", tenantId)
      .single();

    // Fetch landlord profile
    const { data: landlord } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", landlordId)
      .single();

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    let yPosition = height - 50;

    // Title
    page.drawText("RENT AGREEMENT", {
      x: width / 2 - 80,
      y: yPosition,
      size: 20,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // Agreement date
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 30;

    // Parties
    page.drawText("BETWEEN:", {
      x: 50,
      y: yPosition,
      size: 14,
      font: timesRomanBoldFont,
    });

    yPosition -= 20;

    page.drawText(`Landlord: ${landlord?.full_name || "Property Owner"}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText(`Tenant: ${tenant?.full_name || "Tenant"}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 30;

    // Property details
    page.drawText("PROPERTY DETAILS:", {
      x: 50,
      y: yPosition,
      size: 14,
      font: timesRomanBoldFont,
    });

    yPosition -= 20;

    page.drawText(`Address: ${property.address}, ${property.city}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText(`Property Type: ${property.property_type}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText(`Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 30;

    // Rent details
    page.drawText("RENT DETAILS:", {
      x: 50,
      y: yPosition,
      size: 14,
      font: timesRomanBoldFont,
    });

    yPosition -= 20;

    page.drawText(`Monthly Rent: ₹${monthlyRent.toLocaleString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText(`Security Deposit: ₹${securityDeposit.toLocaleString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText(`Lease Period: ${startDate} to ${endDate}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 30;

    // Terms
    if (terms) {
      page.drawText("TERMS AND CONDITIONS:", {
        x: 50,
        y: yPosition,
        size: 14,
        font: timesRomanBoldFont,
      });

      yPosition -= 20;

      const termsLines = terms.split("\n");
      for (const line of termsLines) {
        if (yPosition < 100) break;
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
        });
        yPosition -= 15;
      }
    }

    // Signature areas
    yPosition = 150;

    page.drawText("Landlord Signature: ___________________", {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    page.drawText("Tenant Signature: ___________________", {
      x: 350,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= 20;

    page.drawText("Date: _______________", {
      x: 50,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    page.drawText("Date: _______________", {
      x: 350,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const fileName = `${tenantId}/${propertyId}-${Date.now()}.pdf`;

    // Upload to storage
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: uploadError } = await supabaseAdmin.storage
      .from("rent-agreements")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload PDF");
    }

    // Get signed URL
    const { data: urlData } = await supabaseAdmin.storage
      .from("rent-agreements")
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    // Create rent agreement record
    const { data: agreement, error: dbError } = await supabaseAdmin
      .from("rent_agreements")
      .insert({
        property_id: propertyId,
        tenant_id: tenantId,
        monthly_rent: monthlyRent,
        security_deposit: securityDeposit,
        start_date: startDate,
        end_date: endDate,
        terms: terms,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
    }

    console.log("Rent agreement generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        url: urlData?.signedUrl,
        storagePath: fileName,
        agreementId: agreement?.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating rent agreement:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
