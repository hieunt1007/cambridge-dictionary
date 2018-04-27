(async() => {
  'use strict'

  let dictionaryPromise = async() => {
    return new Promise(resolve => {
      chrome.storage.sync.get(['dictionary'], result => {
        resolve(result.dictionary)
      })
    })
  }

  let dictionary = await dictionaryPromise()

  const WEBSITE_URL = `https://dictionary.cambridge.org/search/${dictionary}/direct/`
  const iframeWidth = 450
  const iframeHeight = 300

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
        selectedText = selection.toString().replace(/[\.\*\?;!()\+,\[:\]<>^_`\[\]{}~\\\/\"\'=]/g,
          ' ').trim(),
        relative = document.body.parentNode.getBoundingClientRect(),
        offset = -1

      isAdded && body.removeChild(cambridgeEle) && (isAdded = false)
      if (!selectedText || e.target === cambridgeEle || selectedText.includes(' ')) {
        return
      }

      bcr = selection.getRangeAt(0).getBoundingClientRect()
      if (Math.abs(e.clientY - bcr.top) > bcr.bottom - e.clientY) {
        // icon will be shown on top
        offset = bcr.height + 28
      }

      cambridgeEle.style.top = `${bcr.bottom - relative.top - offset}px` //this will place ele below the selection
      cambridgeEle.style.left = `${e.clientX + html.scrollLeft - 12}px` //this will place ele below the selection
      cambridgeEle.onclick = (evt) => {
        body.removeChild(cambridgeEle) && (isAdded = false)

        evt.stopPropagation()
        evt.preventDefault()

        let offsetTop = bcr.bottom - relative.top - offset
        if (offsetTop - html.scrollTop < iframeHeight) {
          offsetTop += 27
        } else if (offsetTop + iframeHeight > html.scrollTop) {
          offsetTop -= iframeHeight
        }
        iframe = document.createElement('iframe')
        iframe.src = `${WEBSITE_URL}?q=${selectedText.toLocaleLowerCase()}`
        iframe.width = `${iframeWidth}px`
        iframe.height = `${iframeHeight}px`
        iframe.style.zIndex = 999999999
        iframe.style.position = 'absolute'
        iframe.style.top = `${offsetTop}px`

        if (e.clientX + iframeWidth > body.clientWidth) {
          iframe.style.left = `${body.clientWidth + html.scrollLeft - iframeWidth}px`
        } else {
          iframe.style.left = `${e.clientX + html.scrollLeft - 10}px`
        }
        body.appendChild(iframe)
        console.log(iframe.src)
      }
      body.appendChild(cambridgeEle) && (isAdded = true)
    })
  }
})()