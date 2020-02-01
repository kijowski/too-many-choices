function fallbackCopyTextToClipboard (text: string): void {
  var textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed' // avoid scrolling to bottom
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}
export function copyTextToClipboard (text: string): void {
  if (navigator.clipboard == null) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!')
  }, function (err) {
    console.error('Async: Could not copy text: ', err)
  })
}
