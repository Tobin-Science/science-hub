// Hands out a short-lived signed URL for a printable PDF — but only after
// verifying the teacher is allowed (district or a paid subscription for that
// subject/bundle). The free week does NOT include printables. The PDFs live in
// a PRIVATE Supabase Storage bucket, so they're never publicly reachable.
import { adminDb, userFromRequest, jsonResponse, corsHeaders, pickOrigin } from './_shared.js';

const SUBJECTS = ['physical', 'earth', 'life', 'math'];

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
    const file = String(body.file || '');
    if (!SUBJECTS.includes(subject)) return jsonResponse(400, { error: 'Unknown subject.' }, origin);
    // No path traversal: a plain pdf filename only.
    if (file.includes('/') || file.includes('..') || !/^[\w.\- ]+\.pdf$/i.test(file)) {
      return jsonResponse(400, { error: 'Bad file name.' }, origin);
    }

    const db = adminDb();

    // Entitlement check (server-side, never trust the browser): district OR an
    // active paid subscription for this subject or the bundle. NOT the free week.
    const { data: prof } = await db.from('profiles').select('is_district').eq('id', user.id).single();
    let allowed = !!(prof && prof.is_district);
    if (!allowed) {
      const { data: subs } = await db.from('subscriptions')
        .select('subject,status,current_period_end').eq('owner', user.id);
      const now = Date.now();
      allowed = (subs || []).some(s =>
        ['active', 'trialing'].includes(s.status) &&
        (s.subject === subject || s.subject === 'bundle') &&
        (!s.current_period_end || new Date(s.current_period_end).getTime() > now)
      );
    }
    if (!allowed) return jsonResponse(403, { error: 'Printables require a subscription.' }, origin);

    const { data, error } = await db.storage
      .from('printables').createSignedUrl(`${subject}/${file}`, 120); // 2-minute link
    if (error || !data) return jsonResponse(404, { error: 'That file is not available yet.' }, origin);

    return jsonResponse(200, { url: data.signedUrl }, origin);
  } catch (e) {
    return jsonResponse(500, { error: e.message }, origin);
  }
}
