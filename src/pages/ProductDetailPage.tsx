import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Globe,
  Image,
  Bot,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'
import { getProductById } from '../data/mockProducts'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { QualityScoreRing } from '../components/ui/QualityScoreRing'
import {
  cn,
  confidenceBg,
  formatConfidence,
  sourceTypeIcon,
  statusLabel,
} from '../lib/utils'
import type { FieldProvenance } from '../types/product'

const sourceIcons = {
  pdf: FileText,
  web: Globe,
  image: Image,
  inferred: Bot,
  manual: FileText,
}

function SpecRow({
  label,
  field,
  selected,
  onSelect,
}: {
  label: string
  field: FieldProvenance
  selected: boolean
  onSelect: () => void
}) {
  const hasValue = Boolean(field.value)

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!hasValue}
      className={cn(
        'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors',
        selected
          ? 'border-sky-500/50 bg-sky-500/10'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40',
        !hasValue && 'cursor-not-allowed opacity-40',
      )}
    >
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 font-medium text-slate-200">{field.value || '—'}</p>
      </div>
      {hasValue && (
        <span
          className={cn(
            'rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums',
            confidenceBg(field.confidence),
          )}
        >
          {formatConfidence(field.confidence)}
        </span>
      )}
    </button>
  )
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = getProductById(id ?? '')
  const [selectedField, setSelectedField] = useState<{
    label: string
    field: FieldProvenance
  } | null>(null)

  if (!product) {
    return (
      <div className="text-center">
        <p className="text-slate-400">Product not found.</p>
        <Link to="/catalog" className="mt-4 inline-block text-sky-400 hover:text-sky-300">
          ← Back to catalog
        </Link>
      </div>
    )
  }

  const specEntries: { label: string; field: FieldProvenance }[] = [
    { label: 'Material', field: product.specifications.material },
    { label: 'Dimensions', field: product.specifications.dimensions },
    { label: 'Weight', field: product.specifications.weight },
    { label: 'Pressure Rating', field: product.specifications.pressureRating },
    { label: 'Temperature Range', field: product.specifications.temperatureRange },
    { label: 'Connection Type', field: product.specifications.connectionType },
  ]

  if (product.specifications.flowCoefficient) {
    specEntries.push({
      label: 'Flow Coefficient',
      field: product.specifications.flowCoefficient,
    })
  }

  const metaFields: { label: string; field: FieldProvenance }[] = [
    { label: 'Standards', field: product.standards },
    { label: 'Certifications', field: product.certifications },
    { label: 'Country of Origin', field: product.countryOfOrigin },
    { label: 'Long Description', field: product.longDescription },
  ]

  const active = selectedField ?? (specEntries.find((s) => s.field.value) ?? null)

  const SourceIcon = active ? sourceIcons[active.field.sourceType] : FileText

  return (
    <div className="space-y-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{product.category}</Badge>
            <Badge>{product.subcategory}</Badge>
            <Badge
              variant={
                product.status === 'approved'
                  ? 'success'
                  : product.status === 'review'
                    ? 'warning'
                    : 'default'
              }
            >
              {statusLabel(product.status)}
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-white">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {product.brand} · MPN {product.mpn} · SKU{' '}
            <span className="font-mono text-slate-400">{product.sku}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <QualityScoreRing score={product.qualityScore} size="lg" />
          {product.status === 'review' && (
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/30"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {product.validationIssues.length > 0 && (
        <Card>
          <CardBody className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Validation Issues</p>
            {product.validationIssues.map((issue, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 rounded-lg border px-4 py-3',
                  issue.severity === 'error'
                    ? 'border-red-500/30 bg-red-500/10'
                    : issue.severity === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'border-sky-500/30 bg-sky-500/10',
                )}
              >
                <AlertCircle
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    issue.severity === 'error'
                      ? 'text-red-400'
                      : issue.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-sky-400',
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-slate-200">{issue.field}</p>
                  <p className="text-sm text-slate-400">{issue.message}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Specifications
          </h2>
          <div className="space-y-2">
            {specEntries.map((entry) => (
              <SpecRow
                key={entry.label}
                label={entry.label}
                field={entry.field}
                selected={active?.label === entry.label}
                onSelect={() => setSelectedField(entry)}
              />
            ))}
          </div>

          <h2 className="pt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Compliance & Description
          </h2>
          <div className="space-y-2">
            {metaFields.map((entry) => (
              <SpecRow
                key={entry.label}
                label={entry.label}
                field={entry.field}
                selected={active?.label === entry.label}
                onSelect={() => setSelectedField(entry)}
              />
            ))}
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SourceIcon className="h-4 w-4 text-sky-400" />
              <h2 className="font-semibold text-white">Source Traceability</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Click any field to view its source evidence
            </p>
          </CardHeader>
          <CardBody>
            {active && active.field.value ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Field</p>
                  <p className="font-medium text-slate-200">{active.label}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Extracted Value</p>
                  <p className="font-medium text-white">{active.field.value}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'rounded-md border px-2 py-1 text-xs font-medium',
                      confidenceBg(active.field.confidence),
                    )}
                  >
                    Confidence {formatConfidence(active.field.confidence)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {sourceTypeIcon(active.field.sourceType)} {active.field.sourceType.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Source Document</p>
                  <p className="font-mono text-sm text-sky-400">{active.field.source}</p>
                  {active.field.page != null && (
                    <p className="mt-1 text-xs text-slate-500">Page {active.field.page}</p>
                  )}
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Source Quote
                  </p>
                  <blockquote className="border-l-2 border-sky-500/50 pl-3 text-sm italic leading-relaxed text-slate-300">
                    &ldquo;{active.field.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Select a field on the left to inspect its provenance and source citation.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-white">Structured Export Preview (JSON)</h2>
        </CardHeader>
        <CardBody>
          <pre className="max-h-64 overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-400">
            {JSON.stringify(
              {
                sku: product.sku,
                mpn: product.mpn,
                brand: product.brand,
                name: product.name,
                category: product.category,
                quality_score: product.qualityScore,
                specifications: Object.fromEntries(
                  Object.entries(product.specifications).map(([k, v]) => [
                    k,
                    v?.value ? { value: v.value, confidence: v.confidence, source: v.source } : null,
                  ]),
                ),
              },
              null,
              2,
            )}
          </pre>
        </CardBody>
      </Card>
    </div>
  )
}
