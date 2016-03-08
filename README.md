# chrome_extension_yandex_img
Google chrome browser extension for uploading images from internet pages to yandex disc

License:
---
Under license: CC-BY-SA

Author:
---
Nikita Akimov
korchiy@yandex.ru

Usage
---
In google chrome browser (developer mode)
preferences - extensions - load unpacked extension

Make registration on yandex.ru

Create application on https://oauth.yandex.ru/client/new

Rights:	Яндекс.Диск REST API

- Доступ к информации о Диске

- Доступ к папке приложения на Диске

   Запись в любом месте на Диске

   Чтение всего Диска

Callback URL: https://_installed_extension_id.chromiumapp.org/yandex.ru

Received clientId and clientSecret set in background.js

Additional info
---
file jquery.min.2.2.0.js - local copy of JQuery library (http://jquery.com/download/)
