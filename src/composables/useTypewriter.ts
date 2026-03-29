import { ref, onMounted, onUnmounted } from 'vue'

export function useTypewriter(text: string, speed = 80, startDelay = 500) {
  const displayText = ref('')
  const showCursor = ref(true)

  let cursorInterval: ReturnType<typeof setInterval> | null = null
  let typingInterval: ReturnType<typeof setInterval> | null = null
  let startTimeout: ReturnType<typeof setTimeout> | null = null

  onMounted(() => {
    cursorInterval = setInterval(() => {
      showCursor.value = !showCursor.value
    }, 530)

    let index = 0
    startTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (index < text.length) {
          displayText.value += text[index]
          index++
        } else {
          if (typingInterval) clearInterval(typingInterval)
        }
      }, speed)
    }, startDelay)
  })

  onUnmounted(() => {
    if (cursorInterval) clearInterval(cursorInterval)
    if (typingInterval) clearInterval(typingInterval)
    if (startTimeout)  clearTimeout(startTimeout)
  })

  return { displayText, showCursor }
}
