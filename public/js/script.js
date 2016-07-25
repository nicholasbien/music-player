(function(window, document) {

  let viewingPlaylist = null
  let currentSong = null
  let currentUser = null

  let dj = new DiscJockey()
  let view = new View()

  let reprocessSong = (song) => {
    request('POST', '/song', song, (song) => {
      dj.preloadTrack(song)
    })
  }

  let moveTimeSlider = () => {
    if (dj.hasCurrentTrack()) {
      view.setTimes(dj.getTime(), dj.getDuration())
    } else {
      view.setTimes(null)
    }
  }

  let updateTime = () => {
    view.setTimes($('#time').value / 100 * dj.getDuration(), dj.getDuration())
  }

  let keepTime = setInterval(moveTimeSlider, 100)

  window.timeChange = (input) => {
    dj.setTime($('#time').value / 100 * dj.getDuration() || 0)
    keepTime = setInterval(moveTimeSlider, 100)
    input.removeEventListener('mousemove', updateTime)
  }

  window.mouseDownOnTime = (input) => {
    input.addEventListener('mousemove', updateTime)
    clearInterval(keepTime)
  }

  window.volumeChange = (input) => {
    dj.setVolume(parseInt(input.value, 10) / 100.0)
  }

  window.addPlaylistButtonClick = () => {
    let name = $('#new-playlist-name').value
    if (name) {
      let playlist = {
        name: name,
        songs: []
      }
      let url = '/user/' + currentUser._id + '/playlist'
      request('POST', url, playlist, (playlist) => {
        view.setPlaylist(playlist, songClick)
      })
    }
  }

  window.playlistSelect = (selected) => {
    currentUser.playlists.forEach((playlist) => {
      if (playlist._id === selected.id) {
        $('#songs').innerHTML = ''
        view.setPlaylist(playlist, songClick)
        dj.preloadTracks(playlist.songs, reprocessSong)
      }
    })
  }

  window.songClick = (tr) => {
    let index = view.getIndexOfSong(tr)
    dj.setTracklist(view.getCurrentPlaylist())
    dj.startTrack(index)
    view.startSong(dj.getCurrentSong(), dj.getCurrentPlaylist())
  }

  window.addSongButtonClick = () => {
    let url = $('#new-song-url').value
    let title = $('#new-song-title').value
    let artist = $('#new-song-artist').value
    let song = {
      url: url,
      title: title,
      artist: artist
    }
    let visiblePlaylist = view.getCurrentPlaylist()
    let requestUrl = '/playlist/' + visiblePlaylist._id + '/song'
    request('POST', requestUrl, song, (song) => {
      if (song) {
        view.addSong(song, songClick)
        dj.addToTracklist(song)
      }
    })
  }

  window.previousButtonClick = () => {
    if (dj.hasCurrentTrack()) {
      if (dj.isPaused() || dj.getTime() > 2) {
        dj.setTime(0)
      } else {
        dj.startPreviousTrack()
        view.startSong(dj.getCurrentSong(), dj.getCurrentPlaylist())
      }
    }
  }

  window.playButtonClick = () => {
    if (dj.hasCurrentTrack()) {
      if (dj.isPaused()) {
        dj.play()
      } else {
        dj.pause()
      }
    } else {
      let visiblePlaylist = view.getCurrentPlaylist()
      if (visiblePlaylist && visiblePlaylist.songs.length > 0) {
        dj.setTracklist(visiblePlaylist)
        dj.startTrack(0)
        view.startSong(dj.getCurrentSong(), dj.getCurrentPlaylist())
      }
    }
  }

  window.nextButtonClick = () => {
    if (dj.hasCurrentTrack()) {
      dj.startNextTrack()
      view.startSong(dj.getCurrentSong(), dj.getCurrentPlaylist())
    }
  }
  window.moveUpButtonClick = (event, button) => {
  //     event.stopPropagation();
  //     var tr = button.parentNode.parentNode;
  //     currentPlaylist = Model.moveSongUp(currentPlaylist, parseInt(tr.id, 10));
  //     view.displayAllSongs(currentPlaylist, songClick);
  }

  window.moveDownButtonClick = (event, button) => {
  //     event.stopPropagation();
  //     var tr = button.parentNode.parentNode;
  //     currentPlaylist = Model.moveSongDown(currentPlaylist, parseInt(tr.id, 10));
  //     view.displayAllSongs(currentPlaylist, songClick);
  }

  window.removeSongButtonClick = (event, button) => {
    event.stopPropagation()
    let tr = button.parentNode.parentNode
    let songId = tr.id
    let playlistId = viewingPlaylist._id
    let songs = viewingPlaylist.songs
    let url = '/playlist/' + playlistId + '/song/' + songId + '/delete'
    request('POST', url, null, () => {
      for (let i = 0; i < songs.length; i++) {
        if (songs[i]._id === songId) {
          songs.splice(i, 1)
          break
        }
      }
      view.removeSongFromPlaylist(tr)
      // view.displaySongs()
    })
  }

  window.editPlaylistButtonClick = () => {
    let newName = $('#rename-playlist-box').value
    if (newName === '') {
      return
    }
    let visiblePlaylist = view.getCurrentPlaylist()
    let playlistId = visiblePlaylist._id
    let url = '/playlist/' + playlistId + '/rename'
    request('POST', url, visiblePlaylist, (playlist) => {
      // rename on view
    })
  }

  window.removePlaylistButtonClick = () => {
    let userId = currentUser._id
    let playlistId = viewingPlaylist._id
    let url = '/user/' + userId + '/playlist/' + playlistId + '/delete'
    let playlists = currentUser.playlists
    request('POST', url, null, () => {
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i]._id === playlistId) {
          playlists.splice(i, 1)
          break
        }
      }
      // remove playlist on view
      // view.displayAllPlaylists(currentUser.playlists)
      // viewingPlaylist = currentUser.playlists[0] || null
      // view.displaySongs(viewingPlaylist.songs, songClick)
      // if (viewingPlaylist) {
      //     view.selectPlaylist(viewingPlaylist._id)
      //     dj.preloadTracks(viewingPlaylist.songs, reprocessSong)
      // }
    })
  }

  window.loginUserButtonClick = () => {
    let username = $('#login-username').value
    let password = $('#login-password').value
    let user = {
      username: username,
      password: password
    }
    request('POST', '/login', user, (user) => {
      currentUser = user
      let playlists = user.playlists
      view.addPlaylists(playlists)
      if (playlists && playlists.length > 0) {
        view.setPlaylist(playlists[0], songClick)
        dj.preloadTracks(playlists[0].songs, reprocessSong)
      }
    })
  }

  window.registerUserButtonClick = () => {
    let username = $('#register-username').value
    let password = $('#register-password').value
    let user = {
      username: username,
      password: password
    }
    request('POST', '/register', user, (user) => {
      currentUser = user
      // set blank view
      // view.displayAllPlaylists(null)
      // view.displaySongs(viewingPlaylist.songs, songClick)
    })
  }

  window.addEventListener('load', (event) => {

  })

  window.addEventListener('unload', (event) => {

  })

})(window, document)