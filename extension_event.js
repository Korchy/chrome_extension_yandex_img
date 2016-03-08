// event-скрипт для обработки нажатия на кнопку расширения
// выполняется при запуске расширения
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
chrome.browserAction.onClicked.addListener(function(tab) {
	// Отправление пустого сообщения (сам факт нажатия на кнопку расширения) в текущую вкладку (скрипту background.js)
	chrome.windows.getCurrent(function(w) {
		chrome.tabs.getSelected(w.id, function(t) {
			var port = chrome.tabs.connect(t.id);
			port.postMessage(t.id);
		})
	});
});