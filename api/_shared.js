// Shared helpers for the Science Hub payment functions.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const SUPABASE_URL = process.env.SUPABASE_URL;

// Where the public site lives. The site is on GitHub Pages, the functions on
// Vercel, so the browser calls cross-origin — we must allow that origin.
export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://tobin-science.github.io';

// Origins allowed to call these functions from a browser: the live site plus
// the local preview server (port 5180) so we can test end-to-end before launch.
const ALLOWED_ORIGINS = [SITE_ORIGIN, 'http://localhost:5180', 'http://127.0.0.1:5180'];

// Reflect the caller's origin when it's one we trust, else fall back to live.
export function pickOrigin(request) {
  const o = request.headers.get('origin');
  return ALLOWED_ORIGINS.includes(o) ? o : SITE_ORIGIN;
}

// subject + interval  ->  Stripe price id (set as Vercel env vars; never secret).
export const PRICE = {
  physical: { month: process.env.STRIPE_PRICE_PHYSICAL_MONTH, year: process.env.STRIPE_PRICE_PHYSICAL_YEAR },
  earth:    { month: process.env.STRIPE_PRICE_EARTH_MONTH,    year: process.env.STRIPE_PRICE_EARTH_YEAR },
  life:     { month: process.env.STRIPE_PRICE_LIFE_MONTH,     year: process.env.STRIPE_PRICE_LIFE_YEAR },
  bundle:   { month: process.env.STRIPE_PRICE_BUNDLE_MONTH,   year: process.env.STRIPE_PRICE_BUNDLE_YEAR },
};

// Service-role client: trusted server-side writes (bypasses row-level security).
export function adminDb() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// Verify the caller's Supabase login token and return their user (or null).
export async function userFromRequest(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const anon = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await anon.auth.getUser(token);
  if (error || !data || !data.user) return null;
  return data.user;
}

export function corsHeaders(origin, extra) {
  return {
    'Access-Control-Allow-Origin': origin || SITE_ORIGIN,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(extra || {}),
  };
}

export function jsonResponse(status, obj, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: corsHeaders(origin, { 'content-type': 'application/json' }),
  });
}

// Only ever bounce the browser back to our own site, never an attacker's URL.
export function safeReturnTo(raw) {
  try {
    const url = new URL(raw);
    if (url.origin === SITE_ORIGIN) return url.origin + url.pathname;
  } catch (_) { /* ignore */ }
  return SITE_ORIGIN + '/science-hub/physical_science.html';
}
