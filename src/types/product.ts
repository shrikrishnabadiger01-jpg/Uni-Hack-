export type ProductStatus = 'approved' | 'review' | 'processing' | 'failed'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface FieldProvenance {
  value: string
  source: string
  sourceType: 'pdf' | 'web' | 'image' | 'inferred' | 'manual'
  quote: string
  page?: number
  confidence: number
}

export interface ValidationIssue {
  field: string
  message: string
  severity: ValidationSeverity
}

export interface ProductSpecifications {
  material: FieldProvenance
  dimensions: FieldProvenance
  weight: FieldProvenance
  pressureRating: FieldProvenance
  temperatureRange: FieldProvenance
  connectionType: FieldProvenance
  flowCoefficient?: FieldProvenance
}

export interface Product {
  id: string
  sku: string
  mpn: string
  brand: string
  name: string
  category: string
  subcategory: string
  shortDescription: string
  longDescription: FieldProvenance
  specifications: ProductSpecifications
  standards: FieldProvenance
  certifications: FieldProvenance
  countryOfOrigin: FieldProvenance
  qualityScore: number
  status: ProductStatus
  validationIssues: ValidationIssue[]
  sources: string[]
  processedAt: string
  batchId?: string
}

export interface BatchJob {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed' | 'queued'
  totalItems: number
  processedItems: number
  approvedItems: number
  reviewItems: number
  failedItems: number
  startedAt: string
  completedAt?: string
  avgConfidence: number
  costPerSku: number
}

export interface DashboardMetrics {
  totalProducts: number
  approvedProducts: number
  pendingReview: number
  avgQualityScore: number
  throughputPerHour: number
  validationPassRate: number
  costPerSku: number
}
