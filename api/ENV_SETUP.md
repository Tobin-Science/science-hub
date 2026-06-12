# Vercel environment variables for the Science Hub API

Set these in **Vercel → Project → Settings → Environment Variables**.
NONE of these values belong in the code or in git — only in Vercel (and the
`.env` file is git-ignored). Public values are marked; the rest are SECRET.

## Supabase
- `SUPABASE_URL` — `https://fmbdoxfkjldvpkyryqlx.supabase.co` (public)
- `SUPABASE_ANON_KEY` — the publishable key `sb_publishable_...` (public)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase **service_role / secret** key (SECRET — Supabase → Project Settings → API Keys → reveal)

## Stripe (use TEST values while in the sandbox; swap to live at go-live)
- `STRIPE_SECRET_KEY` — `sk_test_...` (SECRET — Stripe → Developers → API keys)
- `STRIPE_WEBHOOK_SECRET` — `whsec_...` (SECRET — created when you add the webhook endpoint, see below)

## Stripe price ids (not secret, but kept as env vars so test→live needs no code change)
- `STRIPE_PRICE_PHYSICAL_MONTH` = price_1ThYIXAPcWvNGQnVQ0n9BPZj
- `STRIPE_PRICE_PHYSICAL_YEAR`  = price_1ThYOJAPcWvNGQnVFNtU3wFM
- `STRIPE_PRICE_EARTH_MONTH`    = price_1ThYQUAPcWvNGQnVwEcZySCk
- `STRIPE_PRICE_EARTH_YEAR`     = price_1ThYQoAPcWvNGQnV8Mht3fkF
- `STRIPE_PRICE_LIFE_MONTH`     = price_1ThYSJAPcWvNGQnVtouTVrxQ
- `STRIPE_PRICE_LIFE_YEAR`      = price_1ThYSbAPcWvNGQnVVKB9xmCH
- `STRIPE_PRICE_BUNDLE_MONTH`   = price_1ThYXJAPcWvNGQnV9N4C9ctC
- `STRIPE_PRICE_BUNDLE_YEAR`    = price_1ThYXnAPcWvNGQnVzRo24iHG

## Site
- `SITE_ORIGIN` — `https://tobin-science.github.io` (public; the only origin allowed to call the API)

## Stripe webhook endpoint to create (Stripe → Developers → Webhooks)
- URL: `https://<your-vercel-project>.vercel.app/api/stripe-webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
