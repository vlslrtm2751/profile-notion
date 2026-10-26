/**
 * Resolves a public asset path against the deploy base.
 *
 * The site ships to GitHub Pages under `/profile-notion/`, so a root-relative
 * path straight out of resume.json (`/images/logan.png`) would 404. Every
 * component must route public assets through here.
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  if (!path) return ''
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path) || path.startsWith('data:')) return path
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
