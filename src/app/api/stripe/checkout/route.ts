import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICE_IDS, type PlanKey } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 5 checkout attempts per minute per user
  const { success } = await rateLimit(`checkout:${user.id}`, { maxRequests: 5, windowMs: 60_000 })
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { plan } = await request.json() as { plan: PlanKey }
  const priceId = PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000'
  const isRecurring = plan !== 'season'

  const session = await stripe.checkout.sessions.create({
    mode: isRecurring ? 'subscription' : 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${origin}/settings?upgraded=1`,
    cancel_url: `${origin}/pricing`,
    metadata: { userId: user.id, plan },
    ...(isRecurring && {
      subscription_data: { metadata: { userId: user.id, plan } },
    }),
  })

  return NextResponse.json({ url: session.url })
}
