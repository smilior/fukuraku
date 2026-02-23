import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavbarSection from '@/components/landing/navbar-section'
import HeroSection from '@/components/landing/hero-section'
import PainPointsSection from '@/components/landing/pain-points-section'
import HowItWorksSection from '@/components/landing/how-it-works-section'
import FeaturesSection from '@/components/landing/features-section'
import PricingSection from '@/components/landing/pricing-section'
import CtaSection from '@/components/landing/cta-section'
import FooterSection from '@/components/landing/footer-section'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'fukuraku',
  description: '副業サラリーマン専用の確定申告管理アプリ。収入・経費を記録し、20万円ラインを自動管理。',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://fukuraku.smilior.com',
  offers: [
    { '@type': 'Offer', name: '無料プラン', price: '0', priceCurrency: 'JPY' },
    { '@type': 'Offer', name: 'ベーシック', price: '980', priceCurrency: 'JPY' },
  ],
}

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavbarSection />
      <HeroSection />
      <PainPointsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
