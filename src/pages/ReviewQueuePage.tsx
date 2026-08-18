import { Link } from 'react-router-dom'
import { ClipboardCheck, ChevronRight, AlertTriangle } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { QualityScoreRing } from '../components/ui/QualityScoreRing'
import { getReviewProducts } from '../data/mockProducts'
import { formatConfidence } from '../lib/utils'

export function ReviewQueuePage() {
  const products = getReviewProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-semibold text-white">Human-in-the-Loop Review</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Products flagged for low confidence, validation failures, or source conflicts
          </p>
        </div>
        <Badge variant="warning">{products.length} pending</Badge>
      </div>

      <div className="grid gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200/80">
        <div className="flex items-center gap-2 font-medium text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          Review criteria
        </div>
        <ul className="ml-6 list-disc space-y-1 text-amber-200/70">
          <li>Field confidence below 80%</li>
          <li>Missing required attributes (weight, certifications, origin)</li>
          <li>Conflicting values across PDF, web, and image sources</li>
          <li>Inferred values that need human confirmation</li>
        </ul>
      </div>

      <div className="space-y-4">
        {products.map((p) => {
          const errorCount = p.validationIssues.filter((i) => i.severity === 'error').length
          const warnCount = p.validationIssues.filter((i) => i.severity === 'warning').length

          return (
            <Card key={p.id} hover>
              <CardBody>
                <div className="flex flex-wrap items-center gap-4">
                  <QualityScoreRing score={p.qualityScore} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-sm text-slate-500">
                      {p.sku} · {p.brand} · {p.sources.length} source(s)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {errorCount > 0 && (
                        <Badge variant="danger">{errorCount} errors</Badge>
                      )}
                      {warnCount > 0 && (
                        <Badge variant="warning">{warnCount} warnings</Badge>
                      )}
                      {p.sources.map((s) => (
                        <Badge key={s}>{s.length > 24 ? s.slice(0, 24) + '…' : s}</Badge>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/catalog/${p.id}`}
                    className="flex items-center gap-1 rounded-lg bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-300 ring-1 ring-sky-500/40 hover:bg-sky-500/30"
                  >
                    Review
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {p.validationIssues.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
                    {p.validationIssues.slice(0, 3).map((issue, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          <span className="font-medium text-slate-300">{issue.field}:</span>{' '}
                          {issue.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                  {Object.entries(p.specifications)
                    .filter(([, v]) => v && v.confidence > 0 && v.confidence < 0.8)
                    .slice(0, 4)
                    .map(([key, v]) => (
                      <span key={key} className="rounded bg-slate-800 px-2 py-1">
                        {key}: {formatConfidence(v!.confidence)}
                      </span>
                    ))}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <Card>
          <CardHeader>
            <p className="text-slate-400">No products pending review. Great job!</p>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
