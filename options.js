chrome.storage.sync.get(['dictionary'], result => {
  document.getElementById('cambridgeOption').value = result.dictionary || document.getElementById('cambridgeOption').options[0].value
})

document.getElementById('saveBtn').onclick = () => {
  chrome.storage.sync.set({dictionary: document.getElementById('cambridgeOption').value})
}
document.getElementById('resetBtn').onclick = () => {
  let value = document.getElementById('cambridgeOption').options[0].value
  chrome.storage.sync.set({dictionary: value})
  document.getElementById('cambridgeOption').value = value
}
