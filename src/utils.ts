export function blurButton (ev: Event): void {
  if (ev.target != null) {
    (ev.target as HTMLButtonElement).blur()
  }
}
