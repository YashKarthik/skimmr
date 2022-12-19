browser.contextMenus.create({
  id: "summarize.cc-menu",
  title: "Summarize",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(async (_info, _tab) => {
  let [ text, ] = await browser.tabs.executeScript({code: "getSelection().toString()"});

  try {
    //const resStream = await fetch("http://localhost:8888/.netlify/functions/gpt-summarize", {
    //  method: "POST",
    //  headers: {
    //    "Content-Type": "application/json"
    //  },
    //  body: text
    //})

    //const response = await resStream.json();
    //console.log(response.message)

    browser.storage.sync.set({ 'val1': 'hello' });
    browser.storage.sync.set({ 'val2': 'world' });

    return true;
  } catch (e) {
    console.log('ERROR in background.js:', e)
  }

  return true;
});
