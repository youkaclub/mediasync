# mediasync
sync html media elements (video/audio).

## usage
```js
const audio1 = new Audio('src1')
const audio2 = new Audio('src2')
const video1 = document.querySelector('#video1')
const video2 = document.querySelector('#video2')
const ms = new MediaSync()
ms.add(audio1)
ms.add(audio2)
ms.add(video1)
ms.add(video2)
ms.play()
ms.pause()
ms.remove(video1)
```

## todo
- mobile support
- build for node/browser
- docs

## license
MIT