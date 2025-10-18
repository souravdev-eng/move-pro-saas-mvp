import { useCallback, useState } from 'react'

export function useMutation<TArgs extends unknown[], TRes>(fn: (...args: TArgs) => Promise<TRes>) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mutate = useCallback(async (...args: TArgs) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fn(...args)
            return res
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? 'Request failed')
            throw e
        } finally {
            setLoading(false)
        }
    }, [fn])

    return { mutate, loading, error }
}

export default useMutation


