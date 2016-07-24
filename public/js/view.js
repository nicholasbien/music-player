'use strict'

let View = {}

View.displayNewPlaylist = (id, name) => {
  let li = create('li')
  li.id = id
  li.innerHTML = name
  $('#playlist-select').appendChild(li)
  show('#new-song-button')
  show('#edit-playlist-button')
}

View.selectPlaylist = (id) => {
  let previous = $('#playlist-select > .selected')
  if (previous) {
    previous.className = ''
  }
  let current = document.getElementById(id)
  if (current) {
    current.className = 'selected'
  }
}

View.displayNewSong = (id, index, title, artist, callback) => {
  let tr = create('tr')
  tr.id = id
  tr.onclick = () => { callback(tr) }
  let td = create('td')
  td.innerHTML = index + 1
  td.className = 'song-number'
  tr.appendChild(td)
  td = create('td')
  td.innerHTML = title
  td.className = 'song-title'
  tr.appendChild(td)
  td = create('td')
  td.innerHTML = artist
  td.className = 'song-artist'
  tr.appendChild(td)
  td = create('td')
  td.className = 'song-edit-buttons'
  if ($('th.song-edit-buttons').style.display == 'none') {
    td.style.display = 'none'
  }
  td.innerHTML = '<button onclick="moveUpButtonClick(event, this)">Up</button>' +
           '<button onclick="moveDownButtonClick(event, this)">Down</button>' +
           '<button onclick="removeSongButtonClick(event, this)">Delete</button>'
  tr.appendChild(td)
  $('#songs').appendChild(tr)
}

View.displayAllSongs = (playlist, callback) => {
  $('#songs').innerHTML = ''
  if (playlist && playlist.songs) {
    if (playlist.songs.length > 0) {
      playlist.songs.forEach((song, index) => {
        View.displayNewSong(song._id, index, song.title, song.artist, callback)
      })
    } else {
      hide('th.song-edit-buttons')
    }
  }
}

View.displayAllPlaylists = (playlists) => {
  $('#playlist-select').innerHTML = ''
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
    $('#elapsedTime').innerHTML = elapsedTime
    let songTime = parseInt(duration / 60, 10) + ':' + ('0' + parseInt(duration) % 60).slice(-2)
    $('#songTime').innerHTML = songTime
  } else {
    $('#elapsedTime').innerHTML = '0:00'
    $('#songTime').innerHTML = '-:--'
  }
  $('#time').value = 100 * time / duration || 0
}

View.setPlayButtonText = (paused) => {
  if (paused) {
    $('#play-button').innerHTML = '&gt'
  } else {
    $('#play-button').innerHTML = '| |'
  }
}

View.displayCurrentSong = (song) => {
  if (!song) {
    $('#current-song').innerHTML = ''
  } else {
    $('#current-song').innerHTML = song.artist + ' - ' + song.title
  }
}

View.highlightCurrentSong = (id) => {
  let previous = $('#song-table tbody > .playing')
  if (previous) {
    previous.className = ''
  }
  let current = document.getElementById(id)
  if (current) {
    current.className = 'playing'
  }
}