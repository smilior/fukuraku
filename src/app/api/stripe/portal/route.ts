import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000'

  // メールアドレスで既存 customer を検索
  const customers = await stripe.customers.list({ email: user.email!, limit: 1 })
  let customerId = customers.data[0]?.id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { userId: user.id },
    })
    customerId = customer.id
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/settings`,
  })

  return NextResponse.json({ url: portalSession.url })
}
