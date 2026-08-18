import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Zap,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { dashboardMetrics, mockBatchJobs, mockProducts } from '../data/mockProducts'
import { Link } from 'react-router-dom'

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  icon: typeof Package
  accent: string
}) {
  return (
    <Card hover>
      <CardBody className="flex items-start gap-4">
        <div className={`rounded-lg p-2.5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
      </CardBody>
    </Card>
  )
}

export function DashboardPage() {
  const m = dashboardMetrics
  const recentProducts = mockProducts.filter((p) => p.status !== 'processing').slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-400/60 bg-amber-950/50 px-2 py-4 shadow-[0_0_20px_rgba(245,180,0,0.08)]">
  <h1 className="text-2xl font-semibold text-white">
    Dashboard
  </h1>

  <p className="mt-1 text-sm text-amber-200/70">
    AI-powered product intelligence pipeline overview
  </p>
</div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Products"
          value={m.totalProducts.toLocaleString()}
          sub="+124 this week"
          icon={Package}
          accent="bg-sky-500/15 text-sky-400"
        />
        <MetricCard
          label="Auto-Approved"
          value={m.approvedProducts.toLocaleString()}
          sub={`${((m.approvedProducts / m.totalProducts) * 100).toFixed(1)}% of catalog`}
          icon={CheckCircle2}
          accent="bg-emerald-500/15 text-emerald-400"
        />
        <MetricCard
          label="Pending Review"
          value={m.pendingReview}
          sub="Human-in-the-loop queue"
          icon={AlertTriangle}
          accent="bg-amber-500/15 text-amber-400"
        />
        <MetricCard
          label="Avg Quality Score"
          value={m.avgQualityScore}
          sub="Across enriched catalog"
          icon={Gauge}
          accent="bg-violet-500/15 text-violet-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Pipeline Performance</h2>
              <Badge variant="success">Live</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Zap className="h-4 w-4 text-sky-400" />
                  Throughput
                </div>
                <p className="mt-1 text-xl font-semibold text-white">{m.throughputPerHour} SKUs/hr</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Validation Pass Rate
                </div>
                <p className="mt-1 text-xl font-semibold text-white">{m.validationPassRate}%</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  Cost per SKU
                </div>
                <p className="mt-1 text-xl font-semibold text-white">${m.costPerSku.toFixed(3)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-400">Active Batch Jobs</p>
              {mockBatchJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">{job.name}</p>
                      <p className="text-xs text-slate-500">
                        {job.processedItems}/{job.totalItems} processed · avg conf{' '}
                        {(job.avgConfidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <Badge variant={job.status === 'running' ? 'accent' : 'success'}>
                      {job.status}
                    </Badge>
                  </div>
                  <ProgressBar value={job.processedItems} max={job.totalItems} />
                  <div className="mt-2 flex gap-4 text-xs text-slate-500">
                    <span className="text-emerald-400">{job.approvedItems} approved</span>
                    <span className="text-amber-400">{job.reviewItems} review</span>
                    <span className="text-red-400">{job.failedItems} failed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">Recently Processed</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                to={`/catalog/${p.id}`}
                className="block rounded-lg border border-slate-800 p-3 transition-colors hover:border-slate-700 hover:bg-slate-800/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sku}</p>
                  </div>
                  <Badge
                    variant={
                      p.status === 'approved' ? 'success' : p.status === 'review' ? 'warning' : 'default'
                    }
                  >
                    {p.qualityScore}
                  </Badge>
                </div>
              </Link>
            ))}
            <Link
              to="/catalog"
              className="block pt-2 text-center text-sm text-sky-400 hover:text-sky-300"
            >
              View full catalog →
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
