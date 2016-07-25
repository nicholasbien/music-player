'use strict'

function View() {
  let playlists = []
  let currentPlaylist = null

  let clearPlaylists = () => {
    $('#playlist-select').innerHTML = ''
  }

  let clearSongs = () => {
    $('#songs').innerHTML = ''
  }

  let highlightCurrentSong = (id) => {
    let previous = $('#song-table tbody > .playing')
    if (previous) {
      previous.className = ''
    }
    let current = document.getElementById(id)
    if (current) {
      current.className = 'playing'
    }
  }

  let displayCurrentSong = (song) => {
    if (!song) {
      $('#current-song').innerHTML = ''
    } else {
      $('#current-song').innerHTML = song.artist + ' - ' + song.title
    }
  }

  let displaySongs = (songs, callback) => {
    if (songs.length > 0) {
      songs.forEach((song, index) => {
        displaySong(song, callback)
      })
    } else {
      hide('th.song-edit-buttons')
    }
  }

  let displaySong = (song, callback) => {
    let tr = create('tr')
    tr.id = song._id
    let index = $('#songs').childNodes.length
    tr.onclick = () => { callback(tr) }
    let td = create('td')
    td.innerHTML = index + 1
    td.className = 'song-number'
    tr.appendChild(td)
    td = create('td')
    td.innerHTML = song.title
    td.className = 'song-title'
    tr.appendChild(td)
    td = create('td')
    td.innerHTML = song.artist
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

  let selectPlaylist = (id) => {
    let previous = $('#playlist-select > .selected')
    if (previous) {
      previous.className = ''
    }
    let current = document.getElementById(id)
    if (current) {
      current.className = 'selected'
    }
  }

  this.setPlaylist = (id, callback) => {
    clearSongs()
    playlists.forEach((playlist) => {
      if (playlist._id === id) {
        currentPlaylist = playlist
      }
    })
    selectPlaylist(currentPlaylist._id)
    displaySongs(currentPlaylist.songs, callback)
  }

  this.startSong = (song, playlist) => {
    this.setTimes(null)
    displayCurrentSong(song)
  }

  this.getIndexOfSong = (tr) => {
    let trs = $('#songs').childNodes
    for (let i = 0; i < trs.length; i++) {
      if (trs[i] === tr) {
        return i
      }
    }
    return -1
  }

  this.addPlaylist = (playlist) => {
    playlists.push(playlist)
    let li = create('li')
    li.id = playlist._id
    li.innerHTML = playlist.name
    $('#playlist-select').appendChild(li)
    show('#new-song-button')
    show('#edit-playlist-button')
  }

  this.addPlaylists = (playlists) => {
    playlists.forEach((playlist) => {
      this.addPlaylist(playlist)
    })
  }

  this.addSong = (song, callback) => {
    currentPlaylist.songs.push(song)
    displaySong(song, callback)
  }

  this.removeSongFromPlaylist = (tr) => {
    tr.parentNode.removeChild(tr)
    // remove also from currentPlaylist
  }

  this.setTimes = (time, duration) => {
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

  this.setPlayButtonText = (paused) => {
    if (paused) {
      $('#play-button').innerHTML = '&gt'
    } else {
      $('#play-button').innerHTML = '| |'
    }
  }

  this.getCurrentPlaylist = () => {
    return currentPlaylist
  }
}