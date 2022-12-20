document.addEventListener("DOMContentLoaded", (e) => {
  const copyButton = document.getElementById('copy-button');

  const explanationBox = document.getElementById('explanation-text');
  // put the summarized stuff into the text-box
  chrome.storage.session.get(["selectedText"]).then((result) => {
    explanationBox.innerText = result.selectedText;
  });

  // Use copy button to copy content from the text-box
  copyButton.addEventListener('click', _e => {
    if (explanationBox.textContent != "...") {
      navigator.clipboard.writeText(explanationBox.textContent);
    }
  });

});
