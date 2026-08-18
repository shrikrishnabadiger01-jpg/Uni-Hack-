import { cn, qualityColor } from '../../lib/utils'

interface QualityScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function QualityScoreRing({ score, size = 'md' }: QualityScoreRingProps) {
  const radius = size === 'lg' ? 36 : size === 'md' ? 28 : 20
  const stroke = size === 'lg' ? 6 : size === 'md' ? 5 : 4
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  const dim = radius * 2 + stroke

  const strokeColor =
    score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : score > 0 ? '#ef4444' : '#475569'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span
        className={cn(
          'absolute font-semibold tabular-nums',
          size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs',
          qualityColor(score),
        )}
      >
        {score || '—'}
      </span>
    </div>
  )
}
