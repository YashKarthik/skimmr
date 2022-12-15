browser.contextMenus.create({
  id: "summarize.cc-menu",
  title: "Summarize",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  let [ text, ] = await browser.tabs.executeScript({code: "getSelection().toString()"});
});
