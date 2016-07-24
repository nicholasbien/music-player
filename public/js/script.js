let currentPlaylist = null
let currentSong = null
let currentUser = null

let audio = new Audio()

window.addEventListener('load', (event) => {
  // currentPlaylist = Model.loadPlaylists();
  // View.displayAllPlaylists(Model.getAllPlaylists());
  // if (currentPlaylist) {
  //     View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
  //     View.displayAllSongs(currentPlaylist, songClick);
  // }
})

window.addEventListener('unload', (event) => {
  localStorage.clear()
})

changeSong = (song) => {
  currentSong = song
  if (currentSong) {
    audio.removeAttribute('src')
    audio.load()
    audio.src = currentSong.streamUrl
    audio.play()
  } else {
    audio.src = ''
  }
  View.setTimes(audio.currentTime, audio.duration)
  View.setPlayButtonText(audio.paused)
  View.displayCurrentSong(currentSong)
  let index = currentPlaylist.songs.indexOf(currentSong)
  if (index != -1) {
    View.highlightCurrentSong(song._id)
  }
}

audio.addEventListener('ended', (event) => {
  changeSong(getNextSong())
})

let moveTimeSlider = () => {
  View.setTimes(audio.currentTime, audio.duration)
}
let updateTime = () => {
  View.setTimes($('#time').value / 100 * audio.duration, audio.duration)
}

let keepTime = setInterval(moveTimeSlider, 100)

timeChange = (input) => {
  audio.currentTime = $('#time').value / 100 * audio.duration || 0
  keepTime = setInterval(moveTimeSlider, 100)
  input.removeEventListener('mousemove', updateTime)
}

mouseDownOnTime = (input) => {
  input.addEventListener('mousemove', updateTime)
  clearInterval(keepTime)
}

addPlaylistButtonClick = () => {
  let name = $('#new-playlist-name').value
  if (name) {
    let playlist = {
      name: name,
      songs: []
    }
    let url = '/user/' + currentUser._id + '/playlist'
    request('POST', url, playlist, (playlist) => {
      currentPlaylist = playlist
      View.displayNewPlaylist(playlist._id, name)
      View.displayAllSongs(currentPlaylist, songClick)
      View.selectPlaylist(playlist._id)
    })
  }
}

playlistSelect = (selected) => {
  currentUser.playlists.forEach((playlist) => {
    if (playlist._id === selected.id) {
      currentPlaylist = playlist
      $('#songs').innerHTML = ''
      View.displayAllSongs(currentPlaylist, songClick)
      View.selectPlaylist(selected.id)
      let index = currentPlaylist.songs.indexOf(currentSong)
      if (index !== -1) {
        View.highlightCurrentSong(currentSong._id)
      }
    }
  })
}

songClick = (tr) => {
  currentPlaylist.songs.forEach((song) => {
    if (song._id === tr.id) {
      changeSong(song)
    }
  })
}

addSongButtonClick = () => {
  let url = $('#new-song-url').value
  let title = $('#new-song-title').value
  let artist = $('#new-song-artist').value
  let song = {
    url: url,
    title: title,
    artist: artist
  }
  let url = '/playlist/' + currentPlaylist._id + '/song'
  request('POST', url, song, (song) => {
    currentPlaylist.songs.push(song)
    let index = currentPlaylist.songs.length - 1
    View.displayNewSong(song._id, index, title, artist, songClick)
  })
}

previousButtonClick = () => {
  if (audio.paused || audio.currentTime > 2) {
    audio.currentTime = 0
  } else {
    changeSong(getPreviousSong())
  }
}

playButtonClick = () => {
  if (currentPlaylist) {
    if (currentSong) {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
      View.setPlayButtonText(audio.paused)
    } else if (currentPlaylist.songs.length > 0) {
      changeSong(currentPlaylist.songs[0])
    }
  }
}

nextButtonClick = () => {
  changeSong(getNextSong())
}

getPreviousSong = () => {
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

getNextSong = () => {
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

moveUpButtonClick = (event, button) => {
//     event.stopPropagation();
//     var tr = button.parentNode.parentNode;
//     currentPlaylist = Model.moveSongUp(currentPlaylist, parseInt(tr.id, 10));
//     View.displayAllSongs(currentPlaylist, songClick);
}

moveDownButtonClick = (event, button) => {
//     event.stopPropagation();
//     var tr = button.parentNode.parentNode;
//     currentPlaylist = Model.moveSongDown(currentPlaylist, parseInt(tr.id, 10));
//     View.displayAllSongs(currentPlaylist, songClick);
}

removeSongButtonClick = (event, button) => {
//     event.stopPropagation();
//     var tr = button.parentNode.parentNode;
//     currentPlaylist = Model.removeSong(currentPlaylist, parseInt(tr.id, 10));
//     View.removeSongFromDisplay(tr);
//     View.displayAllSongs(currentPlaylist, songClick);
}

volumeChange = (input) => {
  audio.volume = parseInt(input.value, 10) / 100.0
}

muteButtonClick = () => {
  audio.volume = 0
  $('#volume').value = 0
}

editPlaylistButtonClick = () => {
//     var newName = $('#rename-playlist-box').value;
//     if (newName !== '') {
//         Model.renamePlaylist(currentPlaylist, newName);
//         View.displayAllPlaylists(Model.getAllPlaylists());
//         View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
//     }
}

removePlaylistButtonClick = () => {
//     Model.removePlaylist(currentPlaylist);
//     View.displayAllPlaylists(Model.getAllPlaylists());
//     currentPlaylist = Model.getAllPlaylists()[0] || null;
//     View.displayAllSongs(currentPlaylist, songClick);
//     if (currentPlaylist) {
//         View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
//     }
}

loginUser = () => {
  let username = $('#username').value
  let password = $('#password').value
  let user = {
    username: username,
    password: password
  }
  request('POST', '/login', user, (user) => {
    currentUser = user
    let playlists = user.playlists
    View.displayAllPlaylists(playlists)
    if (playlists && playlists.length > 0) {
      currentPlaylist = playlists[0]
      View.selectPlaylist(currentPlaylist._id)
    }
    View.displayAllSongs(currentPlaylist, songClick)
  })
}

registerUser = () => {
  let username = $('#username').value
  let password = $('#password').value
  let user = {
    username: username,
    password: password
  }
  request('POST', '/user', user, (user) => {
    currentUser = user
    currentPlaylist = null
    View.displayAllPlaylists(null)
    View.displayAllSongs(currentPlaylist, songClick)
  })
}