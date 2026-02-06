import { useCallback, useEffect, useMemo, useState } from 'react'

export function usePageContent(page, defaultContent) {
  const [content, setContent] = useState(defaultContent)
  const [initialContent, setInitialContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/content/${page}`)
        if (!response.ok) throw new Error('Failed to load content')
        const data = await response.json()
        if (cancelled) return
        const hasContent = data && Object.keys(data).length > 0
        const merged = hasContent ? { ...defaultContent, ...data } : defaultContent
        setContent(merged)
        setInitialContent(merged)
      } catch (err) {
        if (!cancelled) {
          setContent(defaultContent)
          setInitialContent(defaultContent)
          setError(err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [defaultContent, page])

  const isDirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(initialContent),
    [content, initialContent],
  )

  const save = useCallback(
    async (token) => {
      const response = await fetch(`/api/content/${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(content),
      })
      if (!response.ok) throw new Error('Failed to save content')
      setInitialContent(content)
    },
    [content, page],
  )

  const reset = useCallback(() => {
    setContent(initialContent)
  }, [initialContent])

  return { content, setContent, isDirty, save, reset, loading, error }
}
