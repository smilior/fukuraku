import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 3 attempts per hour per user
  const { success } = rateLimit(`delete:${user.id}`, { maxRequests: 3, windowMs: 3600_000 })
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Use service client to delete auth user (cascades to public.users via FK)
  const serviceClient = createServiceClient()
  const { error } = await serviceClient.auth.admin.deleteUser(user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
