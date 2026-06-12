// Starts a teacher's one-time 7-day free week (card-free). Server-side so the
// length and one-per-account rule can't be tampered with from the browser.
// The trial grants all-subjects tool access (NOT printables) — that logic lives
// in the hub's entitlement check; here we just stamp the dates.
import { adminDb, userFromRequest, jsonResponse, corsHeaders, pickOrigin } from './_shared.js';

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: corsHeaders(pickOrigin(request)) });
}

export async function POST(request) {
  const origin = pickOrigin(request);
  try {
    const user = await userFromRequest(request);
    if (!user) return jsonResponse(401, { error: 'Please sign in first.' }, origin);

    const db = adminDb();
    const { data: prof } = await db
      .from('profiles').select('trial_started,is_district').eq('id', user.id).single();

    if (prof && prof.is_district) return jsonResponse(200, { ok: true, district: true }, origin);
    if (prof && prof.trial_started) return jsonResponse(409, { error: 'Your free week has already been used.' }, origin);

    const now = new Date();
    const ends = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
    const { error } = await db.from('profiles')
      .update({ trial_started: now.toISOString(), trial_ends: ends.toISOString() })
      .eq('id', user.id);
    if (error) return jsonResponse(500, { error: error.message }, origin);

    return jsonResponse(200, { ok: true, trialEnds: ends.toISOString() }, origin);
  } catch (e) {
    return jsonResponse(500, { error: e.message }, origin);
  }
}
