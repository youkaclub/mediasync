class MediaSync {
  constructor (options) {
    options = options || {}
    this.medias = []
    // depends on browser? (safari: 0.1, chrome: 0.05)
    this.maxDiff = options.maxDiff || 0.1

    this.playFn = this.play.bind(this)
    this.pauseFn = this.pause.bind(this)
    this.seekedFn = this.seeked.bind(this)
    this.volumechangeFn = this.volumechange.bind(this)
    this.enableAudioFn = this.enableAudio.bind(this)

    this.syncInterval = setInterval(() => this.sync(), 1000)

    if (options.medias) {
      options.medias.map(media => this.add(media))
    }

    if (window.navigator.userAgent.match(/(iPad|iPhone)/i)) {
      document.addEventListener('touchstart', this.enableAudioFn)
    }
  }

  enableAudio () {
    document.removeEventListener('touchstart', this.enableAudioFn)
    this.muted = true
    this.play()
    this.pause()
    this.muted = false
  }

  add (media) {
    media.load()
    media.addEventListener('play', this.playFn)
    media.addEventListener('pause', this.pauseFn)
    media.addEventListener('seeked', this.seekedFn)
    media.addEventListener('volumechange', this.volumechangeFn)
    this.medias.push(media)

    if (!this.medias[0].paused) {
      media.currentTime = this.medias[0].currentTime
      media.play()
    }
  }

  remove (media) {
    media.removeEventListener('play', this.playFn)
    media.removeEventListener('pause', this.pauseFn)
    media.removeEventListener('seeked', this.seekedFn)
    media.removeEventListener('volumechange', this.volumechangeFn)
    this.medias = this.medias.filter(m => m !== media)
  }

  seeked (e) {
    this.medias.map(m => m.removeEventListener('seeked', this.seekedFn))
    this.medias.map(m => {
      if (m === e.target) return
      m.currentTime = e.target.currentTime
    })
    setTimeout(() => {
      this.medias.map(m => m.addEventListener('seeked', this.seekedFn))
    }, 200)
  }

  volumechange (e) {
    this.medias.map(m => m.removeEventListener('volumechange', this.volumechangeFn))
    this.medias.map(m => {
      if (m === e.target) return
      m.muted = e.target.muted
      m.volume = e.target.volume
    })
    setTimeout(() => {
      this.medias.map(m => m.addEventListener('volumechange', this.volumechangeFn))
    }, 200)
  }

  set muted (val) {
    this.medias.map(media => { media.muted = val })
  }

  play (e) {
    return Promise.all(this.medias.map(media => media.play()))
  }

  pause () {
    this.medias.map(media => media.pause())
  }

  sync () {
    if (this.lastSync) {
      const secSinceLastSync = ((Date.now() - this.lastSync) / 1000)
      if (secSinceLastSync < 5) {
        return
      }
    }

    const currentTimeMin = Math.min.apply(Math, this.medias.map(a => a.currentTime))
    const currentTimeMax = Math.max.apply(Math, this.medias.map(a => a.currentTime))
    const currentTimeDiff = currentTimeMax - currentTimeMin
    if (currentTimeDiff > this.maxDiff && currentTimeDiff < 1) {
      console.log('diff', currentTimeDiff)
      this.lastSync = Date.now()
      this.pause()
      this.medias.map(m => { m.currentTime = this.medias[0].currentTime })
      setTimeout(() => {
        this.play()
      }, 200)
    }
  }
}