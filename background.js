// Фоновый скрипт для получения авторизации на яндекс
// выполняется при запуске расширения
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var clientId = "<clietn Id>";
var clientSecret = "<client Secret>";
// Получить токен по клиент-id
checkToken();

function checkToken() {
	// Проверить токен в хранилище
	chrome.storage.sync.get(['yImgToken', 'yImgTokenExpires'], function(responce) {
		if(!responce.yImgToken || responce.yImgTokenExpires < (new Date().getTime()) ) getNewToken();
	});
}

function getNewToken() {
	// Получить новый токен
	// Получить код, который потом будет обменян на токен
	var options = {
		'interactive': true,
		url:'https://oauth.yandex.ru/authorize?response_type=code&client_id=' + clientId
	}
	chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
		if (chrome.runtime.lastError) {
			callback(new Error(chrome.runtime.lastError));
			return;
		}
		// в redirectUri получен возвращенный url с кодом
		if(redirectUri.indexOf("code=") == -1) {
			alert("Расширение Y-Img\r\n"+"Ошибка получения токена Яндекс\r\n"+redirectUri.substring(redirectUri.indexOf("error=")));
		}
		else {
			// По коду получить токен
			var grantCode = redirectUri.substring(redirectUri.indexOf("code=")+5);
			$.ajax({
				type: "POST",
				url: 'https://oauth.yandex.ru/token',
				data: {'code': grantCode, 'grant_type': 'authorization_code', 'client_id': clientId, 'client_secret': clientSecret},
				dataType: 'application/x-www-form-urlencoded',
				success: function(responce) {
					// Почему-то не работает, хотя возвращает код 200
				},
				complete: function(responce) {
					// Обработка вернувшихся данных с токеном
					var responceData = JSON.parse(responce.responseText);
					var yImgToken = responceData.access_token;
					var yImgTokenExpires = new Date(new Date().getTime() + responceData.expires_in * 1000);	// дата истечения (в мс)
					// Сохранить токен в хранилище
					chrome.storage.sync.set({'yImgToken': yImgToken});
					chrome.storage.sync.set({'yImgTokenExpires': yImgTokenExpires});
				}
			});					
		}
	});
}