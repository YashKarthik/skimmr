document.addEventListener("DOMContentLoaded", (_e) => {
  const copyButton = document.getElementById('copy-button');
  const reloadButton = document.getElementById('reload-button');
  const explanationBox = document.getElementById('explanation-text');

  // check if anyhing new came
  chrome.storage.onChanged.addListener((changes, _namespace) => {
    explanationBox.innerText = changes.selectedText.newValue;
  });

  // put the summarized stuff into the text-box
  chrome.storage.session.get(["selectedText"]).then((result) => {
    if (result.selectedText) explanationBox.innerText = result.selectedText;
    else explanationBox.innerText = 'nothing here yet...'
  });

  // Use copy button to copy content from the text-box
  copyButton.addEventListener('click', _e => {
    if (explanationBox.textContent != "...") {
      navigator.clipboard.writeText(explanationBox.textContent);
    }
  });

  reloadButton.addEventListener('click', async _e => {
    const [ tab ] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    const res = await chrome.scripting.executeScript(
      {
        target: {tabId: tab.id},
        func: getSelectedText
      }
    );
  const text = res[0].result;
    try {
      const resStream = await fetch("https://skimmr.netlify.app/.netlify/functions/gpt-summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: text
      })
      const response = await resStream.json();
      chrome.storage.session.set({ 'selectedText': response.message.slice(2,) });
    } catch (e) {
      console.log('ERROR in background.js:', e)
    }
  });

});

function getSelectedText() {
  return getSelection().toString();
}
