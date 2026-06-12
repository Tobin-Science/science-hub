// Creates a Stripe Checkout session for a teacher subscribing to a subject
// (or the all-three bundle), monthly or yearly. Called from the hub's
// Educator page after the teacher is signed in.
import { stripe, PRICE, adminDb, userFromRequest, jsonResponse, corsHeaders, pickOrigin, safeReturnTo } from './_shared.js';

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(pickOrigin(request)) });
}

export async function POST(request) {
  const origin = pickOrigin(request);
  try {
    const user = await userFromRequest(request);
    if (!user) return jsonResponse(401, { error: 'Please sign in first.' }, origin);

    const body = await request.json().catch(() => ({}));
    const subject = String(body.subject || '');
    const interval = String(body.interval || 'month');
    const price = PRICE[subject] && PRICE[subject][interval];
    if (!price) return jsonResponse(400, { error: 'Unknown plan.' }, origin);

    const db = adminDb();

    // Re-use this teacher's Stripe customer if we've made one before.
    const { data: profile } = await db
      .from('profiles').select('stripe_customer_id').eq('id', user.id).single();
    let customerId = profile && profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id },
      });
      customerId = customer.id;
      await db.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const returnTo = safeReturnTo(body.returnTo);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      // Carried onto the subscription so the webhook knows who + what.
      subscription_data: { metadata: { supabase_uid: user.id, subject } },
      allow_promotion_codes: true,
      success_url: returnTo + '?checkout=success',
      cancel_url: returnTo + '?checkout=cancel',
    });

    return jsonResponse(200, { url: session.url }, origin);
  } catch (e) {
    return jsonResponse(500, { error: e.message }, origin);
  }
}
