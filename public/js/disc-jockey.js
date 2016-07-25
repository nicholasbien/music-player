function DiscJockey() {
  let tracks = {}
  let tracklist = []
  let currentTrack = null
  let resetCurrentTrack = () => {
    currentTrack.pause()
    currentTrack.currentTime = 0
    currentTrack = null
  }

  this.addToTracklist = (song) => {
    tracklist.push(tracks[song._id])
  }

  this.setTracklist = (playlist) => {
    tracklist = []
    playlist.songs.forEach((song) => {
      this.addToTracklist(song)
    })
    tracklist.playlist = playlist
  }

  this.preloadTrack = (song, errorCallback) => {
    if (tracks[song._id] && tracks[song._id].src === song.streamUrl) {
      return
    }
    tracks[song._id] = new Audio()
    tracks[song._id].innerHTML = '<source  src="' + song.streamUrl + '"/>'
    tracks[song._id].firstChild.addEventListener('error', function(e) {
      errorCallback(song)
    })
    tracks[song._id].song = song
    tracks[song._id].addEventListener('ended', () => {
      this.startNextTrack()
    })
  }

  this.preloadTracks = (songs, errorCallback) => {
    songs.forEach((song) => {
      this.preloadTrack(song, errorCallback)
    })
  }

  this.play = (callback) => {
    currentTrack.play()
  }

  this.pause = () => {
    currentTrack.pause()
  }

  this.startTrack = (index) => {
    if (currentTrack) {
      resetCurrentTrack()
    }
    currentTrack = tracklist[index]
    this.play()
  }

  this.startPreviousTrack = () => {
    let index = tracklist.indexOf(currentTrack)
    if (index === 0) {
      resetCurrentTrack()
    } else {
      this.startTrack(index - 1)
    }
  }

  this.startNextTrack = () => {
    let index = tracklist.indexOf(currentTrack)
    if (index === tracklist.length - 1) {
      resetCurrentTrack()
    } else {
      this.startTrack(index + 1)
    }
  }

  this.hasCurrentTrack = () => {
    if (currentTrack) {
      return true
    } else {
      return false
    }
  }

  this.getTime = () => {
    return currentTrack.currentTime
  }

  this.setTime = (time) => {
    if (currentTrack) {
      currentTrack.currentTime = time
    }
  }

  this.getDuration = () => {
    return currentTrack.duration
  }

  this.isPaused = () => {
    return !currentTrack || currentTrack.paused
  }

  this.getVolume = () => {
    return currentTrack.volume
  }

  this.setVolume = (volume) => {
    currentTrack.volume = volume
  }

  this.getCurrentSong = () => {
    return currentTrack.song
  }

  this.getCurrentPlaylist = () => {
    return tracklist.playlist
  }
}