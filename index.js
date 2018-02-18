(() => {
  const WEBSITE_URL = 'https://dictionary.cambridge.org/dictionary/english/'
  const iframeWidth = 450

  let body = document.body,
    html = document.documentElement,
    cambridgeEle = document.createElement('div'),
    cambridgeIconEle = document.createElement('div'),
    isAdded = false, iframe

  cambridgeIconEle.classList.add('cambridge-dict-icon')
  cambridgeEle.classList.add('cambridge-dict')
  cambridgeEle.appendChild(cambridgeIconEle)

  body.onmouseup = (e) => {
    if (iframe && e.target !== iframe) {
      body.removeChild(iframe) && (iframe = null)
      return
    }
    setTimeout(() => {
      let bcr, selection = window.getSelection(),
        selectedText = selection.toString().trim(),
        relative = document.body.parentNode.getBoundingClientRect(),
        offset = -1

      if (!selectedText || e.target === cambridgeEle) {
        isAdded && body.removeChild(cambridgeEle) && (isAdded = false)
        return
      }
      if (selectedText.includes(' ')) {
        // don't handle multiple words
        isAdded && body.removeChild(cambridgeEle) && (isAdded = false)
        return
      }

      bcr = selection.getRangeAt(0).getBoundingClientRect()
      if (Math.abs(e.clientY - bcr.top) > bcr.bottom - e.clientY) {
        // icon will be shown on top
        offset = bcr.height + 28
      }
      isAdded && body.removeChild(cambridgeEle) && (isAdded = false)

      cambridgeEle.style.top = `${bcr.bottom - relative.top - offset}px` //this will place ele below the selection
      cambridgeEle.style.left = `${e.clientX + html.scrollLeft - 12}px` //this will place ele below the selection
      cambridgeEle.onclick = (evt) => {
        body.removeChild(cambridgeEle) && (isAdded = false)

        selectedText = selectedText.replace(/[\.\*\?;!()\+,\[:\]<>^_`\[\]{}~\\\/\"\'=]/g, ' ')
        evt.stopPropagation()
        evt.preventDefault()
        iframe = document.createElement('iframe')
        iframe.src = WEBSITE_URL + selectedText.toLocaleLowerCase()
        iframe.width = `${iframeWidth}px`
        iframe.height = '300px'
        iframe.style.zIndex = 999999999
        iframe.style.position = 'absolute'
        iframe.style.top = `${bcr.bottom - relative.top - offset}px`

        if (e.clientX + iframeWidth > body.clientWidth) {
          iframe.style.left = `${body.clientWidth + html.scrollLeft - iframeWidth}px`
        }
        else {
          iframe.style.left = `${e.clientX + html.scrollLeft - 10}px`
        }
        body.appendChild(iframe)
      }
      body.appendChild(cambridgeEle) && (isAdded = true)
    })
  }
})()