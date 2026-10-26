import { ref, onMounted, onUnmounted, watch, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Types `source` out character by character.
 *
 * The source is reactive: when it changes — the language toggle being the only
 * caller that does this — the effect restarts from an empty string instead of
 * keeping the text it captured at setup time.
 */
export function useTypewriter(source: MaybeRefOrGetter<string>, speed = 80, startDelay = 500) {
  const displayText = ref('')
  const showCursor = ref(true)

  let cursorInterval: ReturnType<typeof setInterval> | null = null
  let typingInterval: ReturnType<typeof setInterval> | null = null
  let startTimeout: ReturnType<typeof setTimeout> | null = null

  function stopTyping() {
    if (typingInterval) { clearInterval(typingInterval); typingInterval = null }
    if (startTimeout) { clearTimeout(startTimeout); startTimeout = null }
  }

  function startTyping(delay: number) {
    stopTyping()
    const text = toValue(source)
    displayText.value = ''
    let index = 0
    startTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (index < text.length) {
          displayText.value += text[index]
          index++
        } else {
          stopTyping()
        }
      }, speed)
    }, delay)
  }

  onMounted(() => {
    cursorInterval = setInterval(() => { showCursor.value = !showCursor.value }, 530)
    startTyping(startDelay)
  })

  watch(() => toValue(source), () => startTyping(0))

  onUnmounted(() => {
    if (cursorInterval) { clearInterval(cursorInterval); cursorInterval = null }
    stopTyping()
  })

  return { displayText, showCursor }
}
