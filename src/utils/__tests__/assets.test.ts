import { describe, test, expect } from 'vitest'
import { withBase } from '../assets'

describe('withBase', () => {
  test('prefixes a root-relative path with the deploy base', () => {
    expect(withBase('/images/logan.png', '/profile-notion/')).toBe('/profile-notion/images/logan.png')
  })

  test('leaves the path alone when the site is served from the root', () => {
    expect(withBase('/images/logan.png', '/')).toBe('/images/logan.png')
  })

  test('never produces a double slash when the base lacks a trailing slash', () => {
    expect(withBase('/images/logan.png', '/profile-notion')).toBe('/profile-notion/images/logan.png')
  })

  test('accepts a path without a leading slash', () => {
    expect(withBase('images/logan.png', '/profile-notion/')).toBe('/profile-notion/images/logan.png')
  })

  test('passes absolute URLs through untouched', () => {
    expect(withBase('https://cdn.example.com/a.png', '/profile-notion/')).toBe('https://cdn.example.com/a.png')
  })

  test('returns an empty string for an empty path', () => {
    expect(withBase('', '/profile-notion/')).toBe('')
  })
})
