import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Running stats aggregation...");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Get all properties
    const { data: properties, error: propError } = await supabaseAdmin
      .from("properties")
      .select("id, owner_id");

    if (propError) {
      throw new Error("Failed to fetch properties");
    }

    for (const property of properties || []) {
      // Count views for yesterday
      const { count: viewsCount } = await supabaseAdmin
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("property_id", property.id)
        .eq("event_type", "page_view")
        .gte("created_at", yesterday)
        .lt("created_at", today);

      // Count inquiries for yesterday
      const { count: inquiriesCount } = await supabaseAdmin
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("property_id", property.id)
        .eq("event_type", "inquiry")
        .gte("created_at", yesterday)
        .lt("created_at", today);

      // Count bookings for yesterday
      const { count: bookingsCount } = await supabaseAdmin
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("property_id", property.id)
        .gte("created_at", yesterday)
        .lt("created_at", today);

      // Upsert stats
      await supabaseAdmin.from("owner_stats").upsert(
        {
          owner_id: property.owner_id,
          property_id: property.id,
          date: yesterday,
          views: viewsCount || 0,
          inquiries: inquiriesCount || 0,
          bookings: bookingsCount || 0,
        },
        { onConflict: "owner_id,property_id,date" }
      );
    }

    console.log("Stats aggregation completed");

    return new Response(
      JSON.stringify({ success: true, processed: properties?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error aggregating stats:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
