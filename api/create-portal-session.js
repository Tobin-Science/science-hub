// Opens the Stripe Customer Portal so a teacher can update their card,
// switch plans, or cancel. Called from the Educator page "Manage subscription".
import { stripe, adminDb, userFromRequest, jsonResponse, corsHeaders, pickOrigin, safeReturnTo } from './_shared.js';

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(pickOrigin(request)) });
}

export async function POST(request) {
  const origin = pickOrigin(request);
  try {
    const user = await userFromRequest(request);
    if (!user) return jsonResponse(401, { error: 'Please sign in first.' }, origin);

    const db = adminDb();
    const { data: profile } = await db
      .from('profiles').select('stripe_customer_id').eq('id', user.id).single();
    const customerId = profile && profile.stripe_customer_id;
    if (!customerId) return jsonResponse(400, { error: 'No billing account yet.' }, origin);

    const body = await request.json().catch(() => ({}));
    const returnTo = safeReturnTo(body.returnTo);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnTo,
    });

    return jsonResponse(200, { url: session.url }, origin);
  } catch (e) {
    return jsonResponse(500, { error: e.message }, origin);
  }
}
