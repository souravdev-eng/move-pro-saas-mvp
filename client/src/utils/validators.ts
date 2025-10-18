import type { FieldDef } from '../types/rules'

export function validateRequired(value: unknown): boolean {
  return !(value === undefined || value === null || value === '')
}

export function validateRegex(value: unknown, pattern: string): boolean {
  if (value === undefined || value === null || value === '') return true
  try {
    const re = new RegExp(pattern)
    return re.test(String(value))
  } catch {
    return true
  }
}

export function validateEmail(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(value))
}

export function validatePhone(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  const re = /^\+?\d{10,15}$/
  return re.test(String(value))
}

export function runFieldValidators(field: FieldDef, value: unknown): string[] {
  const errors: string[] = []

  if (field.required && !validateRequired(value)) {
    errors.push('Required')
    // If required fails, still run others to surface more info? We'll stop early.
    return errors
  }

  if (field.validators && field.validators.length > 0) {
    for (const v of field.validators) {
      if (v.kind === 'regex' && v.pattern) {
        if (!validateRegex(value, v.pattern)) errors.push(v.message || 'Invalid format')
      }
      if (v.kind === 'email') {
        if (!validateEmail(value)) errors.push(v.message || 'Invalid email')
      }
      if (v.kind === 'phone') {
        if (!validatePhone(value)) errors.push(v.message || 'Invalid phone')
      }
    }
  }

  return errors
}


