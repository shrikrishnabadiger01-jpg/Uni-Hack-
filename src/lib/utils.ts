import { clsx, type ClassValue } from './clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs)
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 0.85) return 'text-success'
  if (confidence >= 0.65) return 'text-warning'
  return 'text-danger'
}

export function confidenceBg(confidence: number): string {
  if (confidence >= 0.85) return 'bg-emerald-500/15 border-emerald-500/30'
  if (confidence >= 0.65) return 'bg-amber-500/15 border-amber-500/30'
  return 'bg-red-500/15 border-red-500/30'
}

export function qualityColor(score: number): string {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-red-400'
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: 'Approved',
    review: 'Needs Review',
    processing: 'Processing',
    failed: 'Failed',
  }
  return labels[status] ?? status
}

export function sourceTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    pdf: '📄',
    web: '🌐',
    image: '🖼️',
    inferred: '🤖',
    manual: '✏️',
  }
  return icons[type] ?? '📋'
}
