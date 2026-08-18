import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, FileText, Image, Link2, Play, CheckCircle2 } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { mockBatchJobs } from '../data/mockProducts'

type UploadZoneProps = {
  icon: typeof FileText
  label: string
  hint: string
  accept: string
}

function UploadZone({ icon: Icon, label, hint, accept }: UploadZoneProps) {
  return (
    <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/40 px-6 py-8 transition-colors hover:border-sky-500/40 hover:bg-sky-500/5">
      <Icon className="mb-3 h-8 w-8 text-slate-600" />
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span className="mt-1 text-xs text-slate-500">{hint}</span>
      <input type="file" accept={accept} className="hidden" multiple />
    </label>
  )
}

export function BatchUploadPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const simulateBatch = useCallback(() => {
    setIsRunning(true)
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += 8
      setProgress(Math.min(p, 100))
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => setIsRunning(false), 800)
      }
    }, 400)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Batch Import</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload product lists and assets — AI pipeline extracts, validates, and enriches at scale
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <UploadZone
          icon={FileSpreadsheet}
          label="SKU List (CSV)"
          hint="sku, name, brand columns"
          accept=".csv"
        />
        <UploadZone
          icon={FileText}
          label="Datasheets (PDF)"
          hint="Technical spec documents"
          accept=".pdf"
        />
        <UploadZone
          icon={Link2}
          label="Product URLs"
          hint="Manufacturer web pages"
          accept=".txt,.csv"
        />
        <UploadZone
          icon={Image}
          label="Product Images"
          hint="Nameplates, labels, diagrams"
          accept="image/*"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-white">Pipeline Configuration</h2>
              <p className="mt-1 text-xs text-slate-500">
                RAG retrieval · Agentic extraction · Validation · HITL routing
              </p>
            </div>
            <button
              type="button"
              onClick={simulateBatch}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
            >
              {isRunning ? (
                <>Processing…</>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Batch Pipeline
                </>
              )}
            </button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: '1. Ingest', desc: 'Parse PDFs, scrape URLs, OCR images' },
              { step: '2. Extract', desc: 'RAG + LLM agent → structured schema' },
              { step: '3. Validate', desc: 'Rules, units, conflicts → quality score' },
            ].map((s) => (
              <div key={s.step} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm font-medium text-sky-400">{s.step}</p>
                <p className="mt-1 text-xs text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>

          {(isRunning || progress > 0) && (
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Processing batch…</span>
                <span className="tabular-nums text-sky-400">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
              {progress >= 100 && !isRunning && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Batch complete — 45 SKUs processed, 38 approved, 5 in review
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-slate-500" />
            <h2 className="font-semibold text-white">Recent Batch Jobs</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          {mockBatchJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 p-4"
            >
              <div>
                <p className="font-medium text-slate-200">{job.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(job.startedAt).toLocaleString()} · ${job.costPerSku.toFixed(3)}/SKU
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <ProgressBar value={job.processedItems} max={job.totalItems} showLabel />
                </div>
                <Badge variant={job.status === 'running' ? 'accent' : 'success'}>{job.status}</Badge>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
