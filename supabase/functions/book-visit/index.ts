import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId, userId, visitDate, notes, userEmail, userName, propertyTitle, ownerEmail, ownerName } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert booking into database
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: propertyId,
        user_id: userId,
        visit_date: visitDate,
        notes: notes || '',
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking insert error:', bookingError);
      throw new Error('Failed to create booking');
    }

    console.log('Booking created:', booking);

    // Send email notification if Resend is configured
    if (resendApiKey && ownerEmail) {
      try {
        const resend = new Resend(resendApiKey);
        
        const visitDateFormatted = new Date(visitDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Email to property owner
        await resend.emails.send({
          from: 'RoadBed <onboarding@resend.dev>',
          to: [ownerEmail],
          subject: `New Visit Request for ${propertyTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Visit Request</h1>
              <p>Hello ${ownerName || 'Property Owner'},</p>
              <p>You have received a new visit request for your property:</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #007bff;">${propertyTitle}</h3>
                <p><strong>Visitor Name:</strong> ${userName || 'Not specified'}</p>
                <p><strong>Visitor Email:</strong> ${userEmail}</p>
                <p><strong>Requested Date:</strong> ${visitDateFormatted}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p>Please log in to your RoadBed dashboard to confirm or reschedule this visit.</p>
              
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated message from RoadBed. Please do not reply directly to this email.
              </p>
            </div>
          `,
        });

        // Confirmation email to visitor
        await resend.emails.send({
          from: 'RoadBed <onboarding@resend.dev>',
          to: [userEmail],
          subject: `Visit Scheduled - ${propertyTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Visit Scheduled!</h1>
              <p>Hello ${userName || 'there'},</p>
              <p>Your visit request has been submitted successfully!</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #28a745;">${propertyTitle}</h3>
                <p><strong>Scheduled Date:</strong> ${visitDateFormatted}</p>
                ${notes ? `<p><strong>Your Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p>The property owner will confirm your visit shortly. We'll notify you once confirmed.</p>
              
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                Thank you for using RoadBed!
              </p>
            </div>
          `,
        });

        console.log('Emails sent successfully');
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return new Response(JSON.stringify({ success: true, booking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Book visit error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
