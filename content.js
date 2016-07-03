// Скрипт для работы с контентом открытой страницы
// выполняется при любом обновлении текущей страницы (обновить или переход по новому адресу)
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		if(!document.getElementById("yImgDropBox")) {
			// Внедрить jquery
// закомментирована проверка т.к. на google-картинках, jquery вроде встроен, но получаю ошибку Uncaught ReferenceError: $ is not defined если не встраиваю сам
//			if(!window.jQuery) {
				var jqscript = document.createElement("script");
				jqscript.setAttribute("type", "text/javascript");
				jqscript.setAttribute("id", "jqueryminjs");
				jqscript.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js");
				document.getElementsByTagName("html")[0].appendChild(jqscript);
//			}
			// Внедрить скрипт
			document.getElementById("jqueryminjs").onload = function() {
				var dbscript = document.createElement("script");
				dbscript.setAttribute("type", "text/javascript");
				dbscript.setAttribute("id", "dropboxplugin");
				dbscript.setAttribute("src", chrome.extension.getURL("dropbox.js"));
				document.getElementsByTagName("html")[0].appendChild(dbscript);
				// Внедрить стиль dropBox
				document.getElementById("dropboxplugin").onload = function() {
					var dbstyle = document.createElement("link");
					dbstyle.setAttribute("type", "text/css");
					dbstyle.setAttribute("rel", "stylesheet");
					dbstyle.setAttribute("href", chrome.extension.getURL("dropbox.css"));
					document.getElementsByTagName("head")[0].appendChild(dbstyle);
					// Объект для работы плагина
					var dbobj = document.createElement("div");
					dbobj.setAttribute("id", "yImgDropBox");
					dbobj.innerHTML = 'click twice';
					document.getElementsByTagName("body")[0].appendChild(dbobj);
					// Отправить событие для инициализиции плагина
					chrome.storage.sync.get('yImgToken', function(responce) {
						if(responce.yImgToken) {
							var newEvent = new CustomEvent('yImgDropBoxStart', {'detail': {'yImgToken': responce.yImgToken}});
							window.dispatchEvent(newEvent);
						}
					});
				}
			}
		}
	});
});
