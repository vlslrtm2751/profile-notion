import { ref, onMounted } from 'vue'

export function useTypewriter(text: string, speed = 80, startDelay = 500) {
  const displayText = ref('')
  const showCursor = ref(true)

  onMounted(() => {
    let index = 0
    const cursorInterval = setInterval(() => {
      showCursor.value = !showCursor.value
    }, 530)

    setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          displayText.value += text[index]
          index++
        } else {
          clearInterval(interval)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearInterval(cursorInterval)
    }
  })

  return { displayText, showCursor }
}
