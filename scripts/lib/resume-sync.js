/**
 * Helpers for deciding whether a freshly fetched resume differs from the one
 * already on disk.
 *
 * `meta.updatedAt` is regenerated on every fetch, so comparing whole documents
 * always reports a difference. That made the workflow's "skip commit when
 * unchanged" guard dead code and produced one no-op commit per day.
 */

/** Stable stringify so key order never counts as a difference. */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])])
    )
  }
  return value
}

/** True when two resumes differ in anything other than `meta`. */
export function hasContentChanged(existing, next) {
  if (!existing) return true
  const { meta: _existingMeta, ...existingContent } = existing
  const { meta: _nextMeta, ...nextContent } = next
  return JSON.stringify(canonical(existingContent)) !== JSON.stringify(canonical(nextContent))
}

/**
 * Returns `next` with `meta.updatedAt` set to `today` only when the content
 * actually changed; otherwise the previous timestamp is carried over so the
 * file on disk stays byte-identical.
 */
export function withResolvedTimestamp(existing, next, today) {
  const previous = existing?.meta?.updatedAt
  const updatedAt = hasContentChanged(existing, next) ? today : (previous ?? today)
  return { ...next, meta: { ...next.meta, updatedAt } }
}
