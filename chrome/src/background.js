chrome.contextMenus.create({
  id: "skimmr.xyz-menu",
  title: "Skimmr",
  contexts: ["selection"]
});

function getSelectedText() {
  return getSelection().toString();
}

chrome.contextMenus.onClicked.addListener(async (_info, _tab) => {
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
    return true;

  } catch (e) {
    console.log('ERROR in background.js:', e)
  }

  return true;
});
