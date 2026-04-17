import { type Ref,ref } from 'vue'

const isOpen = ref<boolean>(false)

export interface CommandPaletteState {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
}

export function useCommandPalette(): CommandPaletteState {
  function open(): void {
    isOpen.value = true
  }
  function close(): void {
    isOpen.value = false
  }
  return { isOpen, open, close }
}
