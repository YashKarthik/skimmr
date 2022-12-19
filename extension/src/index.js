document.addEventListener("DOMContentLoaded", (e) => {
  const copyButton = document.getElementById('copy-button');
  const reloadButton = document.getElementById('reload-button');

  const explanationElement = document.getElementById('explanation-text');

  reloadButton.addEventListener('click', e => {alert(e)})
  copyButton.addEventListener('click', e => {
    explanationElement.textContent = 'hello';
    if (explanationElement.textContent != "...") {
      navigator.clipboard.writeText(explanationElement.textContent);
    }
  });

  browser.storage.sync.get(['val1', 'val2'], function (data) {
    explanationElement.textContent = data.val2;
    console.log(data)
  });

});
