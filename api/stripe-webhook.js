// Stripe calls this whenever a subscription changes (created, renewed,
// trial→active, canceled, payment failed). We mirror the current state into
// the `subscriptions` table so the hub can decide who has access.
import { stripe, adminDb } from './_shared.js';

export async function POST(request) {
  const sig = request.headers.get('stripe-signature');
  const raw = await request.text(); // raw body required for signature check
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      raw, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return new Response('Bad signature: ' + e.message, { status: 400 });
  }

  try {
    if (event.type.startsWith('customer.subscription.')) {
      let sub = event.data.object;
      const uid = sub.metadata && sub.metadata.supabase_uid;
      const subject = (sub.metadata && sub.metadata.subject) || null;

      if (uid) {
        const db = adminDb();
        if (event.type === 'customer.subscription.deleted') {
          await db.from('subscriptions').update({ status: 'canceled' }).eq('id', sub.id);
        } else {
          // Webhook events can arrive out of order (e.g. a stale "incomplete"
          // landing after the "active" update). Re-fetch the authoritative
          // current state from Stripe so we never record a stale status.
          try { sub = await stripe.subscriptions.retrieve(sub.id); } catch (e) { /* fall back to event copy */ }
          // current_period_end is top-level on older API versions and on the
          // first item on newer ones — accept either.
          const cpe = sub.current_period_end
            || (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end);
          const { error } = await db.from('subscriptions').upsert({
            id: sub.id,
            owner: uid,
            subject,
            status: sub.status,
            current_period_end: cpe ? new Date(cpe * 1000).toISOString() : null,
          });
          if (error) return new Response('DB error: ' + error.message, { status: 500 });
        }
      }
    }
  } catch (e) {
    return new Response('Handler error: ' + e.message, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
