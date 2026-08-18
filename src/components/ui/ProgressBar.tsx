import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 60 ? 'bg-sky-500' : 'bg-amber-500'

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
