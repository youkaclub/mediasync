class MediaSync {
  constructor (options) {
    options = options || {}
    options.duration = options.duration || 100

    this.medias = []
    this.syncs = []

    this.to = new TIMINGSRC.TimingObject({
      range: [0.0, options.duration],
      position: 0.0
    })

    this.playFn = this.play.bind(this)
    this.pauseFn = this.pause.bind(this)
    this.seekingFn = this.seeking.bind(this)
    this.volumechangeFn = this.volumechange.bind(this)
    this.timeupdateFn = this.timeupdate.bind(this)
  }

  add (media) {
    media.addEventListener('play', this.playFn)
    media.addEventListener('pause', this.pauseFn)
    media.addEventListener('seeking', this.seekingFn)
    media.addEventListener('volumechange', this.volumechangeFn)
    media.addEventListener('timeupdate', this.timeupdateFn)
    const sync = MCorp.mediaSync(media, this.to)
    this.syncs.push(sync)
    this.medias.push(media)
  }

  remove (media) {
    media.removeEventListener('play', this.playFn)
    media.removeEventListener('pause', this.pauseFn)
    media.removeEventListener('seeking', this.seekingFn)
    media.removeEventListener('volumechange', this.volumechangeFn)
    const index = this.medias.findIndex(m => m === media)
    if (index > -1) {
      const sync = this.syncs[index]
      sync.stop()
      this.medias.splice(index, 1)
      this.syncs.splice(index, 1)
    }
  }

  seeking (e) {
    this.removeEventListener('seeking', this.seekingFn)

    this.to.update({ position: e.target.currentTime })

    setTimeout(() => {
      this.addEventListener('seeking', this.seekingFn)
    }, 200)
  }

  timeupdate (e) {
    if (!e.target.seeking) return
    this.seeking(e)
  }

  volumechange (e) {
    this.removeEventListener('volumechange', this.volumechangeFn)
    this.medias.map(m => {
      if (m === e.target) return
      m.muted = e.target.muted
      m.volume = e.target.volume
    })
    setTimeout(() => {
      this.addEventListener('volumechange', this.volumechangeFn)
    }, 200)
  }

  set muted (val) {
    this.medias.map(media => { media.muted = val })
  }

  addEventListener (type, listener) {
    this.medias.map(m => { m.addEventListener(type, listener) })
  }

  removeEventListener (type, listener) {
    this.medias.map(m => { m.removeEventListener(type, listener) })
  }

  play (e) {
    this.removeEventListener('play', this.playFn)
    this.removeEventListener('pause', this.pauseyFn)

    this.to.update({ velocity: 1 })

    setTimeout(() => {
      this.addEventListener('play', this.playFn)
      this.addEventListener('pause', this.pauseFn)
    }, 200)
  }

  pause (e) {
    if (e && e.target.seeking) return
    this.removeEventListener('play', this.playFn)
    this.removeEventListener('pause', this.pauseFn)

    this.to.update({ velocity: 0 })

    setTimeout(() => {
      this.addEventListener('play', this.playFn)
      this.addEventListener('pause', this.pauseFn)
    }, 200)
  }
}
