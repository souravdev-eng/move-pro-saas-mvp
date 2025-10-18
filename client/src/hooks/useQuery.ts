import { useEffect, useState } from 'react'

export function useQuery<T>(fn: () => Promise<T>, deps: unknown[] = []) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        async function run() {
            setLoading(true)
            setError(null)
            try {
                const res = await fn()
                if (!cancelled) setData(res)
            } catch (e: any) {
                if (!cancelled) setError(e?.response?.data?.message ?? e?.message ?? 'Request failed')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        run()
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { data, loading, error, reload: () => fn().then(setData) }
}

export default useQuery


