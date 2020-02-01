export function blurButton (ev: Event): void {
  if (ev.target != null) {
    (ev.target as HTMLButtonElement).blur()
  }
}

export function selectHeadingTest (ev: Event): void {
  const node = ev.target as HTMLHeadingElement
  const range = document.createRange()
  range.selectNodeContents(node)
  const selection = window.getSelection()
  if (selection != null && selection.rangeCount > 0) {
    selection.removeAllRanges()
  }
  selection?.addRange(range)
}
