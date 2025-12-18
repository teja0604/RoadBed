import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response("Webhook Error: Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log("Received Stripe event:", event.type);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        // Update payment status
        const { error: paymentError } = await supabaseAdmin
          .from("payments")
          .update({
            status: "succeeded",
            stripe_payment_intent: session.payment_intent as string,
          })
          .eq("stripe_session_id", session.id);

        if (paymentError) {
          console.error("Error updating payment:", paymentError);
        }

        // Update booking status to paid
        if (session.metadata?.booking_id) {
          const { error: bookingError } = await supabaseAdmin
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", session.metadata.booking_id);

          if (bookingError) {
            console.error("Error updating booking:", bookingError);
          }

          // Create notification for user
          if (session.metadata?.user_id) {
            await supabaseAdmin.from("notifications").insert({
              user_id: session.metadata.user_id,
              type: "payment_success",
              title: "Payment Successful",
              body: "Your booking payment has been confirmed.",
              link: "/payments",
            });
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment intent succeeded:", paymentIntent.id);

        // Update payment by payment intent ID
        const { error } = await supabaseAdmin
          .from("payments")
          .update({ status: "succeeded" })
          .eq("stripe_payment_intent", paymentIntent.id);

        if (error) {
          console.error("Error updating payment:", error);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment intent failed:", paymentIntent.id);

        const { error } = await supabaseAdmin
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_payment_intent", paymentIntent.id);

        if (error) {
          console.error("Error updating payment:", error);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
