'use strict'

let View = {}

View.getIndexOfSong = (tr) => {
  let trs = $('#songs')[0].childNodes
  for (let i = 0; i < trs.length; i++) {
    if (trs[i] === tr) {
      return i
    }
  }
  return -1
}

View.displayNewPlaylist = (id, name) => {
  // HERE
  let li = document.createElement('li')
  li.id = id
  li.innerHTML = name
  $('#playlist-select').append(li)
  $('#new-song-button').show()
  $('#edit-playlist-button').show()
}

View.selectPlaylist = (id) => {
  let previous = $('#playlist-select > .selected')[0]
  if (previous) {
    previous.className = ''
  }
  let current = document.getElementById(id)
  if (current) {
    current.className = 'selected'
  }
}

View.displayNewSong = (id, index, title, artist, callback) => {
  let tr = document.createElement('tr')
  tr.id = id
  tr.onclick = () => { callback(tr) }
  let td = document.createElement('td')
  td.innerHTML = index + 1
  td.className = 'song-number'
  $(tr).append(td)
  td = document.createElement('td')
  td.innerHTML = title
  td.className = 'song-title'
  $(tr).append(td)
  td = document.createElement('td')
  td.innerHTML = artist
  td.className = 'song-artist'
  $(tr).append(td)
  td = document.createElement('td')
  td.className = 'song-edit-buttons'
  if ($('th.song-edit-buttons')[0].style.display == 'none') {
    td.style.display = 'none'
  }
  td.innerHTML = '<button onclick="moveUpButtonClick(event, this)">Up</button>' +
           '<button onclick="moveDownButtonClick(event, this)">Down</button>' +
           '<button onclick="removeSongButtonClick(event, this)">Delete</button>'
  $(tr).append(td)
  $('#songs').append(tr)
}

View.displayAllSongs = (playlist, callback) => {
  $('#songs').html('')
  if (playlist && playlist.songs) {
    if (playlist.songs.length > 0) {
      playlist.songs.forEach((song, index) => {
        View.displayNewSong(song._id, index, song.title, song.artist, callback)
      })
    } else {
      $('th.song-edit-buttons').hide()
    }
  }
}

View.displayAllPlaylists = (playlists) => {
  $('#playlist-select').html('')
  if (playlists) {
    playlists.forEach((playlist) => {
      View.displayNewPlaylist(playlist._id, playlist.name)
    })
  }
  
}

View.removeSongFromDisplay = (tr) => {
  tr.parentNode.removeChild(tr)
}

View.setTimes = (time, duration) => {
  if (time) {
    let elapsedTime = parseInt(time / 60, 10) + ':' + ('0' + parseInt(time) % 60).slice(-2)
    $('#elapsedTime').html(elapsedTime)
    let songTime = parseInt(duration / 60, 10) + ':' + ('0' + parseInt(duration) % 60).slice(-2)
    $('#songTime').html(songTime)
  } else {
    $('#elapsedTime').html('0:00')
    $('#songTime').html('-:--')
  }
  $('#time').val(100 * time / duration || 0)
}

View.setPlayButtonText = (paused) => {
  if (paused) {
    $('#play-button').html('&gt')
  } else {
    $('#play-button').html('| |')
  }
}

View.displayCurrentSong = (song) => {
  if (!song) {
    $('#current-song').html('')
  } else {
    $('#current-song').html(song.artist + ' - ' + song.title)
  }
}

View.highlightCurrentSong = (id) => {
  let previous = $('#song-table tbody > .playing')[0]
  if (previous) {
    previous.className = ''
  }
  let current = document.getElementById(id)
  if (current) {
    current.className = 'playing'
  }
}