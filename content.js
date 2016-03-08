// Скрипт для работы с контентом открытой страницы
// выполняется при любом обновлении текущей страницы (обновить или переход по новому адресу)
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// При любом сообщении от event-страницы (клик по кнопке расширения) - встроить в текущую вкладку jq-плагин
chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		if(!document.getElementById("yImgDropBox")) {
			// Внедрить jquery
			if(!window.jQuery) {
				var jqscript = document.createElement("script");
				jqscript.setAttribute("type", "text/javascript");
				jqscript.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js");
				document.getElementsByTagName("head")[0].appendChild(jqscript);
			}
			// Внедрить скрипт плагина dropBox
			var dbscript = document.createElement("script");
			dbscript.setAttribute("type", "text/javascript");
			dbscript.setAttribute("src", chrome.extension.getURL("dropbox.js"));
			document.getElementsByTagName("head")[0].appendChild(dbscript);
			// Внедрить стиль dropBox
			var dbstyle = document.createElement("link");
			dbstyle.setAttribute("type", "text/css");
			dbstyle.setAttribute("rel", "stylesheet");
			dbstyle.setAttribute("href", chrome.extension.getURL("dropbox.css"));
			document.getElementsByTagName("head")[0].appendChild(dbstyle);
			// Объект для работы плагина
			var dbobj = document.createElement("div");
			dbobj.setAttribute("id", "yImgDropBox");
/*
			// Дописывание токена в атрибут объекта
			// Тогда в плагине можно через document - ready и не отправлять событие yImgToken ниже
			chrome.storage.sync.get('yImgToken', function(responce) {
				if(responce.yImgToken) {
					dbobj.setAttribute("yImgToken", responce.yImgToken);
				}
			});
*/
			dbobj.innerHTML = 'click twice';
			document.getElementsByTagName("body")[0].appendChild(dbobj);
		}
		// Отправить событие для инициализации плагина
		chrome.storage.sync.get('yImgToken', function(responce) {
			if(responce.yImgToken) {
				var newEvent = new CustomEvent('yImgDropBoxStart', {'detail': {'yImgToken': responce.yImgToken}});
				window.dispatchEvent(newEvent);
				
			}
		});
	});
});