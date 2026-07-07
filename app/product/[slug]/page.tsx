'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductionTab } from '@/components/product/production-tab'
import { EnhancementTab } from '@/components/product/enhancement-tab'
import { IssuesTab } from '@/components/product/issues-tab'
import { getProductDetailData } from '@/lib/product-detail-data'

// Convert kebab-case slug back to product name
function slugToProductName(slug: string): string {
  // Map common slugs to product names
  const slugMap: Record<string, string> = {
    'personal-loan-pl': 'Personal Loan (PL)',
    'home-loan-hl': 'Home Loan (HL)',
    'loan-against-property-lap': 'Loan Against Property (LAP)',
    'used-car-loan': 'Used Car Loan',
    'new-car-loan': 'New Car Loan',
    'two-wheeler-loan': 'Two Wheeler Loan',
    'business-loan': 'Business Loan',
    'education-loan': 'Education Loan',
    'loan-against-security': 'Loan Against Security',
    'cv-ceq': 'CV / CEQ',
  }

  return slugMap[slug] || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const productName = slugToProductName(slug)
  const productData = getProductDetailData(productName)

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-base)]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-base)]">
        <div className="px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/?activeTab=coverage"
              className="flex items-center gap-1 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)] transition-colors"
            >
              <ChevronLeft size={16} />
              Dashboard
            </Link>
            <span className="text-sm text-[color:var(--color-text-muted)]">/</span>
            <span className="text-sm text-[color:var(--color-text-secondary)]">{productData.name}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">{productData.name}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="px-8 py-8">
        <Tabs defaultValue="production" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-6">
            <ProductionTab data={productData.production} productName={productData.name} />
          </TabsContent>

          <TabsContent value="enhancement" className="space-y-6">
            <EnhancementTab data={productData.enhancement} />
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <IssuesTab data={productData.issues} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
