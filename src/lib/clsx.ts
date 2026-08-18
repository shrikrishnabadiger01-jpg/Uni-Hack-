export type ClassValue = string | false | null | undefined

export function clsx(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ')
}
