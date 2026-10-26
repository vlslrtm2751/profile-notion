// @vitest-environment jsdom
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, ref, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useTypewriter } from '../useTypewriter'

function harness(source: ReturnType<typeof ref<string>>) {
  const Comp = defineComponent({
    setup() {
      const { displayText } = useTypewriter(source, 10, 0)
      return () => h('span', displayText.value)
    }
  })
  return mount(Comp)
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useTypewriter', () => {
  test('types the source text out one character at a time', async () => {
    const wrapper = harness(ref('Vue'))
    await vi.advanceTimersByTimeAsync(100)
    expect(wrapper.text()).toBe('Vue')
  })

  test('restarts when the source text changes', async () => {
    const source = ref('안녕하세요')
    const wrapper = harness(source)
    await vi.advanceTimersByTimeAsync(200)
    expect(wrapper.text()).toBe('안녕하세요')

    source.value = 'Frontend Developer'
    await vi.advanceTimersByTimeAsync(400)
    expect(wrapper.text()).toBe('Frontend Developer')
  })

  test('does not leave characters from the previous text behind', async () => {
    const source = ref('aaaaaaaaaaaaaaaaaaaa')
    const wrapper = harness(source)
    await vi.advanceTimersByTimeAsync(400)

    source.value = 'bb'
    await vi.advanceTimersByTimeAsync(400)
    expect(wrapper.text()).toBe('bb')
  })
})
