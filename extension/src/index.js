document.addEventListener("DOMContentLoaded", (e) => {
  const copyButton = document.getElementById('copy-button');
  const reloadButton = document.getElementById('reload-button');

  const explanationText = document.getElementById('explanation-text').textContent;

  copyButton.addEventListener('click', e => {
    if (explanationText != "...") {
      navigator.clipboard.writeText(explanationText);
    }
  });

  reloadButton.addEventListener('click', e => {alert(e)})
});
