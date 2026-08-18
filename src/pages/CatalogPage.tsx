import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, ArrowUpDown, ExternalLink } from 'lucide-react'
import { Card, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { QualityScoreRing } from '../components/ui/QualityScoreRing'
import { mockProducts } from '../data/mockProducts'
import { statusLabel } from '../lib/utils'
import type { ProductStatus } from '../types/product'

const statusVariant: Record<ProductStatus, 'success' | 'warning' | 'accent' | 'danger'> = {
  approved: 'success',
  review: 'warning',
  processing: 'accent',
  failed: 'danger',
}

export function CatalogPage() {
  const [filter, setFilter] = useState<ProductStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? mockProducts : mockProducts.filter((p) => p.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Product Catalog</h1>
          <p className="mt-1 text-sm text-slate-500">
            Structured product intelligence with validation scores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'approved', 'review', 'processing', 'failed'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40'
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            {s === 'all' ? 'All' : statusLabel(s)}
            {s !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({mockProducts.filter((p) => p.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Brand</th>
                <th className="px-5 py-3 font-medium">Quality</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Sources</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-800/80 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-200">{p.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">{p.sku}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {p.category}
                    <span className="text-slate-600"> / </span>
                    {p.subcategory}
                  </td>
                  <td className="px-5 py-4 text-slate-400">{p.brand}</td>
                  <td className="px-5 py-4">
                    <QualityScoreRing score={p.qualityScore} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[p.status]}>{statusLabel(p.status)}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-400">{p.sources.length} sources</span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/catalog/${p.id}`}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
                    >
                      View
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
