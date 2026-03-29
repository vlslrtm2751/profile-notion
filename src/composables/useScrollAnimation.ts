import { onMounted, onUnmounted } from 'vue'

export type AnimationType = 'fade-up' | 'slide-left' | 'slide-right'

export function useScrollAnimation() {
  let observer: IntersectionObserver | null = null

  function initAnimations() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-hidden').forEach((el) => {
      observer!.observe(el)
    })
  }

  onMounted(() => {
    // Small delay to ensure DOM is fully rendered
    setTimeout(initAnimations, 100)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  function observeElement(el: Element) {
    observer?.observe(el)
  }

  return { observeElement }
}
