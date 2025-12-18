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
    const { conversationId, body, attachments } = await req.json();

    console.log("Sending message to conversation:", conversationId);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Verify user is a participant in the conversation
    const { data: conversation, error: convError } = await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      throw new Error("Conversation not found");
    }

    if (conversation.created_by !== user.id && !conversation.participant_ids.includes(user.id)) {
      throw new Error("Not a participant in this conversation");
    }

    // Sanitize message body (basic XSS prevention)
    const sanitizedBody = body
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();

    if (!sanitizedBody) {
      throw new Error("Message body cannot be empty");
    }

    // Insert message
    const { data: message, error: msgError } = await supabaseClient
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: sanitizedBody,
        attachments: attachments || [],
      })
      .select()
      .single();

    if (msgError) {
      throw new Error("Failed to send message");
    }

    // Update conversation updated_at
    await supabaseClient
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    // Create notifications for other participants
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const otherParticipants = [
      conversation.created_by,
      ...conversation.participant_ids,
    ].filter((id) => id !== user.id);

    for (const participantId of otherParticipants) {
      await supabaseAdmin.from("notifications").insert({
        user_id: participantId,
        type: "new_message",
        title: "New Message",
        body: sanitizedBody.substring(0, 100) + (sanitizedBody.length > 100 ? "..." : ""),
        link: `/messages?conversation=${conversationId}`,
      });
    }

    console.log("Message sent successfully:", message.id);

    return new Response(
      JSON.stringify({ success: true, message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending message:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
