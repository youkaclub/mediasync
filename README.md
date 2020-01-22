# mediasync
sync html media elements (video/audio).

## usage
```js
const MediaSync = require('mediasync')
const ms = new MediaSync()
const audio = document.querySelector('#audio')
const video = document.querySelector('#video')
ms.add(audio)
ms.add(video)
ms.play()
ms.seek(42.2)
ms.pause()
ms.remove(video)
```

## license
MIT