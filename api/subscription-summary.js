// Returns the signed-in teacher's subscriptions straight from Stripe — plan
// name, price, billing interval, and the renewal or cancellation date — so the
// account page (account.html) can show a teacher exactly what they're paying
// for before they open the billing portal. Read-only; nothing is changed.
import { stripe, adminDb, userFromRequest, jsonResponse, corsHeaders, pickOrigin } from './_shared.js';

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(pickOrigin(request)) });
}

const ts = (s) => (s ? new Date(s * 1000).toISOString() : null);

export async function POST(request) {
  const origin = pickOrigin(request);
  try {
    const user = await userFromRequest(request);
    if (!user) return jsonResponse(401, { error: 'Please sign in first.' }, origin);

    const db = adminDb();
    const { data: profile } = await db
      .from('profiles').select('stripe_customer_id,is_district,trial_ends').eq('id', user.id).single();
    const customerId = profile && profile.stripe_customer_id;

    const out = {
      email: user.email,
      isDistrict: !!(profile && profile.is_district),
      trialEnds: (profile && profile.trial_ends) || null,
      hasCustomer: !!customerId,
      subscriptions: [],
    };
    if (!customerId) return jsonResponse(200, out, origin);

    const list = await stripe.subscriptions.list({
      customer: customerId, status: 'all', limit: 20,
      expand: ['data.items.data.price.product'],
    });

    out.subscriptions = list.data
      .filter(s => s.status !== 'incomplete_expired')
      .map(s => {
        const item = s.items && s.items.data && s.items.data[0];
        const price = item && item.price;
        const product = price && price.product && typeof price.product === 'object' ? price.product : null;
        // current_period_end is top-level on older API versions and on the
        // first item on newer ones — accept either.
        const cpe = s.current_period_end || (item && item.current_period_end);
        return {
          id: s.id,
          subject: (s.metadata && s.metadata.subject) || null,
          name: (product && product.name) || (price && price.nickname) || null,
          status: s.status,
          amount: price ? price.unit_amount : null,
          currency: price ? price.currency : 'usd',
          interval: price && price.recurring ? price.recurring.interval : null,
          periodEnd: ts(cpe),
          cancelAtPeriodEnd: !!s.cancel_at_period_end,
          canceledAt: ts(s.canceled_at),
          endedAt: ts(s.ended_at),
          created: ts(s.created),
        };
      })
      .sort((a, b) => (b.created || '').localeCompare(a.created || ''));

    return jsonResponse(200, out, origin);
  } catch (e) {
    return jsonResponse(500, { error: e.message }, origin);
  }
}
