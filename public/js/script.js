'use strict'

let currentPlaylist = null
let viewingPlaylist = null
let currentSong = null
let currentUser = null

let dj = new DiscJockey()

window.addEventListener('load', (event) => {
  // currentPlaylist = Model.loadPlaylists();
  // View.displayAllPlaylists(Model.getAllPlaylists());
  // if (currentPlaylist) {
  //     View.selectPlaylist($$('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
  //     View.displayAllSongs(currentPlaylist, songClick);
  // }
})

window.addEventListener('unload', (event) => {
  localStorage.clear()
})

let changeSong = (song) => {
  currentSong = song
  if (currentSong) {
    // dj.setTracklist(viewingPlaylist.songs)
    // dj.startTrack(currentSong).catch((error) => {
      // request('POST', '/song', song, (song) => {
      //   currentSong = song
      //   dj.startTrack(currentSong)
      // })
    //})
  }
  View.setTimes(dj.getTime(), dj.getDuration())
  View.setPlayButtonText(dj.isPaused())
  View.displayCurrentSong(currentSong)
  let index = currentPlaylist.songs.indexOf(currentSong)
  if (index != -1) {
    View.highlightCurrentSong(song._id)
  }
}

// audio.addEventListener('ended', (event) => {
//   changeSong(getNextSong())
// })

let moveTimeSlider = () => {
  if (dj.hasCurrentTrack()) {
    View.setTimes(dj.getTime(), dj.getDuration())
  } else {
    View.setTimes(null)
  }
}

let updateTime = () => {
  View.setTimes($$('#time').value / 100 * dj.getDuration(), dj.getDuration())
}

let keepTime = setInterval(moveTimeSlider, 100)

let timeChange = (input) => {
  dj.setTime($$('#time').value / 100 * dj.getDuration() || 0)
  keepTime = setInterval(moveTimeSlider, 100)
  input.removeEventListener('mousemove', updateTime)
}

let mouseDownOnTime = (input) => {
  input.addEventListener('mousemove', updateTime)
  clearInterval(keepTime)
}

let addPlaylistButtonClick = () => {
  let name = $$('#new-playlist-name').value
  if (name) {
    let playlist = {
      name: name,
      songs: []
    }
    let url = '/user/' + currentUser._id + '/playlist'
    request('POST', url, playlist, (playlist) => {
      viewingPlaylist = playlist
      View.displayNewPlaylist(playlist._id, name)
      View.displayAllSongs(viewingPlaylist, songClick)
      View.selectPlaylist(playlist._id)
    })
  }
}

let playlistSelect = (selected) => {
  currentUser.playlists.forEach((playlist) => {
    if (playlist._id === selected.id) {
      viewingPlaylist = playlist
      $$('#songs').innerHTML = ''
      View.displayAllSongs(viewingPlaylist, songClick)
      View.selectPlaylist(selected.id)
      dj.preloadTracks(viewingPlaylist.songs)
      let index = viewingPlaylist.songs.indexOf(currentSong)
      if (index !== -1) {
        View.highlightCurrentSong(currentSong._id)
      }
    }
  })
}

let songClick = (tr) => {
  let index = View.getIndexOfSong(tr)
  dj.setTracklist(viewingPlaylist.songs)
  dj.startTrack(index)
  View.setPlayButtonText(dj.isPaused())
}

let addSongButtonClick = () => {
  let url = $$('#new-song-url').value
  let title = $$('#new-song-title').value
  let artist = $$('#new-song-artist').value
  let song = {
    url: url,
    title: title,
    artist: artist
  }
  let requestUrl = '/playlist/' + viewingPlaylist._id + '/song'
  request('POST', requestUrl, song, (song) => {
    if (song) {
      viewingPlaylist.songs.push(song)
      let index = viewingPlaylist.songs.length - 1
      View.displayNewSong(song._id, index, title, artist, songClick)
      dj.addToTracklist(song)
    }
  })
}

let previousButtonClick = () => {
  if (dj.hasCurrentTrack()) {
    if (dj.isPaused() || dj.getTime() > 2) {
      dj.setTime(0)
    } else {
      dj.startPreviousTrack()
      View.setPlayButtonText(dj.isPaused())
    }
  }
}

let playButtonClick = () => {
  if (dj.hasCurrentTrack()) {
    if (dj.isPaused()) {
      dj.play()
    } else {
      dj.pause()
    }
  } else if (viewingPlaylist.songs.length > 0) {
    dj.setTracklist(viewingPlaylist.songs)
    dj.startTrack(0)
  }
  View.setPlayButtonText(dj.isPaused())
}

let nextButtonClick = () => {
  if (dj.hasCurrentTrack()) {
    dj.startNextTrack()
    View.setPlayButtonText(dj.isPaused())
  }
}

let getPreviousSong = () => {
  if (!currentPlaylist || !currentSong) {
    return null
  }
  let index = currentPlaylist.songs.indexOf(currentSong)
  if (index === 0 || index === -1) {
    return null
  } else {
    return currentPlaylist.songs[index - 1]
  }
}

let getNextSong = () => {
  if (!currentPlaylist || !currentSong) {
    return null
  }
  let index = currentPlaylist.songs.indexOf(currentSong)
  if (index === currentPlaylist.songs.length - 1 || index === -1) {
    return null
  } else {
    return currentPlaylist.songs[index + 1]
  }
}

let moveUpButtonClick = (event, button) => {
//     event.stopPropagation();
//     var tr = button.parentNode.parentNode;
//     currentPlaylist = Model.moveSongUp(currentPlaylist, parseInt(tr.id, 10));
//     View.displayAllSongs(currentPlaylist, songClick);
}

let moveDownButtonClick = (event, button) => {
//     event.stopPropagation();
//     var tr = button.parentNode.parentNode;
//     currentPlaylist = Model.moveSongDown(currentPlaylist, parseInt(tr.id, 10));
//     View.displayAllSongs(currentPlaylist, songClick);
}

let removeSongButtonClick = (event, button) => {
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
    View.removeSongFromDisplay(tr)
    View.displayAllSongs(viewingPlaylist, songClick)
  })
}

let volumeChange = (input) => {
  dj.setVolume(parseInt(input.value, 10) / 100.0)
}

let editPlaylistButtonClick = () => {
  let newName = $$('#rename-playlist-box').value
  if (newName === '') {
    return
  }
  viewingPlaylist.name = newName
  let playlistId = viewingPlaylist._id
  let url = '/playlist/' + playlistId + '/rename'
  request('POST', url, viewingPlaylist, () => {
    View.displayAllPlaylists(currentUser.playlists)
    View.selectPlaylist(viewingPlaylist._id)
  })
}

let removePlaylistButtonClick = () => {
  let userId = currentUser._id
  let playlistId = viewingPlaylist._id
  let url = '/user/' + userId + '/playlist/' + playlistId + '/delete'
  let playlists = currentUser.playlists
  request('POST', url, null, () => {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i]._id === playlistId) {
        if (currentPlaylist === playlists[i]) {
          currentPlaylist = null
        }
        playlists.splice(i, 1)
        break
      }
    }
    View.displayAllPlaylists(currentUser.playlists)
    viewingPlaylist = currentUser.playlists[0] || null
    View.displayAllSongs(viewingPlaylist, songClick)
    if (viewingPlaylist) {
        View.selectPlaylist(viewingPlaylist._id)
        dj.preloadTracks(viewingPlaylist.songs)
    }
  })
}

let loginUser = (token) => {
  let user = {
    token: token
  }
  $.ajax({
    type: 'POST',
    url: '/login',
    data: user,
    success: (user) => {
      currentUser = user
      $('#loadingdiv').show()
      setTimeout(() => { $('#loadingdiv').hide() }, 2500)
      document.getElementById('userid').innerHTML = user.username
      let playlists = user.playlists
      View.displayAllPlaylists(playlists)
      if (playlists && playlists.length > 0) {
        viewingPlaylist = playlists[0]
        View.selectPlaylist(viewingPlaylist._id)
      }
      View.displayAllSongs(viewingPlaylist, songClick)
    },
    dataType: 'json'
  })
}
