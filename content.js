let toasts = new Map();

function createToast(tabId, url) {
  const id = ("osai-ffx-tab-toast-" + (Math.random() * 1e16)).replace(".","");

  document.body.insertAdjacentHTML("beforeend", (
    `<div class="osai-ffx-tab-toast" id=${id}>
      <div class="toast-content">
        <div class="toast-title">New Tab Opened</div>
        <div class="toast-url">${url}</div>
      </div>
      <button class="toast-button">Switch to Tab</button>
    </div>`
  ));

  const toast = document.querySelector("#" + id);

  toast.querySelector('.toast-button').addEventListener('click', () => {
    browser.runtime.sendMessage({
      type: 'SWITCH_TAB',
      tabId: tabId
    });
  });

  // Auto-remove toast after 5 seconds
  setTimeout(() => {

    if(toast) {
      toast.remove();
      toasts.delete(tabId);
    }
  }, 5000);

  return toast;
}

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_TOAST') {
    const toast = createToast(message.tabId, message.url);
    toasts.set(message.tabId, toast);
    return;
  }

  if (message.type === 'UPDATE_TOAST') {
    const toast = toasts.get(message.tabId);

    if (toast) {
      toast.querySelector('.toast-url').textContent = message.url;
    }
  }
});