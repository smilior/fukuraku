import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan
      if (userId && plan) {
        await supabase
          .from('users')
          .update({ plan: plan as 'basic' | 'pro' | 'season', updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      const plan = sub.metadata?.plan
      if (userId && plan && sub.status === 'active') {
        await supabase
          .from('users')
          .update({ plan: plan as 'basic' | 'pro', updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (userId) {
        await supabase
          .from('users')
          .update({ plan: 'free', updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = (invoice as unknown as { subscription?: string }).subscription
      const sub = subscriptionId
        ? await stripe.subscriptions.retrieve(subscriptionId)
        : null
      const userId = sub?.metadata?.userId
      if (userId) {
        await supabase
          .from('users')
          .update({ plan: 'free', updated_at: new Date().toISOString() })
          .eq('id', userId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
