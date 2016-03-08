/*
$(document).on('ready', function(event) {
	// Можно так, тогда только один клик по иконке расширения
	// но надо писать токен в аттрибуты объекта yImgDropBox
	var receivedToken = $('#yImgDropBox').attr('yImgToken');
	$('#yImgDropBox').yImgDropBox({'yImgToken': receivedToken});
});
*/
$(window).on('yImgDropBoxStart', function(event) {
	var receivedToken = event.detail.yImgToken ? event.detail.yImgToken : event.originalEvent.detail.yImgToken;
	$('#yImgDropBox').yImgDropBox({'yImgToken': receivedToken});
});
$(window).unload (
	function(){
		$('#yImgDropBox').yImgDropBox('destroy');
	}
);
(function($){
	
	var methods = {
		init: function(options) {
			return this.each(function(){
				if($(this).data('yImgDropBoxInit') == true) return this;
				// Сохранить полученный токен
				params.yImgToken = options.yImgToken;
				if(!params.yImgToken) {
					$(this).css('background-color', 'red');
					$(this).html('no token!');
				}
				else $(this).html('ready');
				// Обработка событий на странице
				$('img').on('dragstart', onDragStart);
				$(this).on('drop', onDrop);
				$(this).on('dragenter', onDragEnter);
				$(this).on('dragover', onDragOver);
				$(this).on('click', onClick);
				$(window).on('scroll', onWindowScroll);
			});
		},
		destroy: function() {
			return this.each(function(){
				$(window).unbind('scroll', onWindowScroll);
				$(this).unbind('click', onClick);
				$(this).unbind('drop', upload);
				$(this).unbind('dragenter', onDragEnter);
				$(this).unbind('dragover', onDragOver);
				$('img').unbind('dragstart', onDragStart);
			});
		}
	};
	
	var params = {
		yImgToken: '',
		draggingImg:	undefined
	};
	
	function onDrop() {
		// Обработка "отпускания" перетаскивания
		// Отменить системную обработку
		event.preventDefault();
		event.stopPropagation();
		// Обработать
		$.ajax({
			type: "POST",
			url: encodeURI(urlForUpload()),
			headers: {'Authorization': 'OAuth ' + params.yImgToken},
			contentType: 'application/json; charset=utf-8',
			context: $(this),
			success: function(responce) {
				// Начало загрузки
				$(this).css('background-color', 'yellow');
				$(this).html('uploading');
				
			},
			complete: function(responce) {
				// окончание загрузки
				switch(responce.status) {
					case 202:	// Все ОК - начало загрузки - надо контролировать процесс
						$(this).css('background-color', 'yellow');
						$(this).html('uploading');
						var obj = $(this);
						// Проверяем раз в 1 секунду статус прогресса
						var timer = setInterval(function() {
							$.ajax({
								type: "GET",
								url: responce.responseJSON.href,
								headers: {'Authorization': 'OAuth ' + params.yImgToken},
								context: obj,
								complete: function(responce) {
									// окончание загрузки
									switch(responce.status) {
										case 200:	// ОК - загрузка завершена
											clearInterval(timer);
											$(this).css('background-color', 'green');
											$(this).html('ready');
											break;
										default:	// Что-то еще
											$(this).css('background-color', '#FF1493');
											$(this).html(responce.responseJSON.status);
									}
								}
							});
						}, 1000);
						break;
					case 401:	// Не прошла авторизация
						$(this).css('background-color', 'red');
						$(this).html(responce.statusText);
						break;
					default:	// Что-то еще
						$(this).css('background-color', '#FF1493');
						$(this).html(responce.status);
				}
			}
		});
	}
	
	function onDragEnter() {
		// Отменить системную обработку
		event.preventDefault();
		event.stopPropagation();
	}
	
	function onDragOver() {
		// Отменить системную обработку
		event.preventDefault();
		event.stopPropagation();
	}
	
	function onDragStart() {
		// Начало перетаскивания изображения (img)
		params.draggingImg = $(this);
	}
	
	function urlForUpload() {
		// Формирование url для загрузки изображения
		var fileName = params.draggingImg.context.src.substring(params.draggingImg.context.src.lastIndexOf('/')+1);
		var fileExt = "";
		// С гугл-ленты идут изображения webp без расширения - добавить
		if(window.location.toString().indexOf("plus.google.com") && fileName.indexOf('.') == -1) {
			fileExt = ".webp";
		}
		return 'https://cloud-api.yandex.net/v1/disk/resources/upload?url=' + params.draggingImg.context.src + '&path=/img/' + fileName + fileExt;
	}
	
	function onClick() {
		// Клик - переход к диску
		window.open('https://disk.yandex.ru/client/disk/img', '_blank');
	}
	
	function onWindowScroll() {
		$('img').unbind('dragstart', onDragStart);
		$('img').on('dragstart', onDragStart);
	}
	
	$.fn.yImgDropBox = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Undefined method: ' +  method);
		}
	};
}
)(jQuery);