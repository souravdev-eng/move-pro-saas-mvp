import { describe, it, expect } from 'vitest'
import { validateRequired, validateRegex, validateEmail, validatePhone, runFieldValidators } from '../../utils/validators'

describe('validators', () => {
    it('validateRequired', () => {
        expect(validateRequired('x')).toBe(true)
        expect(validateRequired('')).toBe(false)
        expect(validateRequired(null)).toBe(false)
    })

    it('validateRegex', () => {
        expect(validateRegex('abc', '^a')).toBe(true)
        expect(validateRegex('xbc', '^a')).toBe(false)
    })

    it('validateEmail', () => {
        expect(validateEmail('a@b.com')).toBe(true)
        expect(validateEmail('a@b')).toBe(false)
    })

    it('validatePhone', () => {
        expect(validatePhone('+15551234567')).toBe(true)
        expect(validatePhone('123')).toBe(false)
    })

    it('runFieldValidators', () => {
        const field: any = { id: 'email', label: 'Email', type: 'string', required: true, widget: { key: 'email' }, validators: [{ kind: 'email' }] }
        expect(runFieldValidators(field, '').length).toBe(1)
        expect(runFieldValidators(field, 'not-email').length).toBe(1)
        expect(runFieldValidators(field, 'a@b.com').length).toBe(0)
    })
})


