// jsdom has no IntersectionObserver; the scroll-reveal composables need one to exist.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
  root = null
  rootMargin = ''
  thresholds = []
}
globalThis.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver

// Mirror the GitHub Pages deploy base so asset-path bugs are reproducible in tests.
import.meta.env.BASE_URL = '/profile-notion/'
