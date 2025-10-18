import jsonLogic from 'json-logic-js'
import type { Definitions } from '../types/rules'

export function evaluateExpression(expressionBody: any, data: Record<string, any>): boolean {
    try {
        const result = jsonLogic.apply(expressionBody, data)
        return Boolean(result)
    } catch {
        return false
    }
}

export default evaluateExpression

export function evaluateByRef(definitions: Definitions, ref?: string | null, data: Record<string, any> = {}): boolean {
    if (!ref) return true
    const expr = definitions.expressions?.find(e => e.id === ref)
    if (!expr) return true
    if (expr.engine !== 'jsonlogic') return true
    return evaluateExpression(expr.body, data)
}


