'use strict'

function View() {
  let currentPlaylist = null

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

  this.setPlaylist = (playlist, callback) => {
    currentPlaylist = playlist
    this.selectPlaylist(playlist._id)
    addSongs(playlist.songs, callback)
  }

  let addSongs = (songs, callback) => {
    $('#songs').innerHTML = ''
    if (songs.length > 0) {
      songs.forEach((song, index) => {
        this.addSong(song, callback)
      })
    } else {
      hide('th.song-edit-buttons')
    }
  }

  this.startSong = (song, playlist) => {
    this.setTimes(null)
    displayCurrentSong(song)
    if (currentPlaylist === playlist) {
      highlightCurrentSong(song._id)
    }
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
    let li = create('li')
    li.id = playlist._id
    li.innerHTML = playlist.name
    $('#playlist-select').appendChild(li)
    show('#new-song-button')
    show('#edit-playlist-button')
  }

  this.selectPlaylist = (id) => {
    let previous = $('#playlist-select > .selected')
    if (previous) {
      previous.className = ''
    }
    let current = document.getElementById(id)
    if (current) {
      current.className = 'selected'
    }
  }

  this.addSong = (song, callback) => {
    let tr = create('tr')
    tr.id = song._id
    tr.onclick = () => { callback(tr) }
    let td = create('td')
    let index = $('#songs').childNodes.length
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

  this.addPlaylists = (playlists) => {
    $('#playlist-select').innerHTML = ''
    if (playlists) {
      playlists.forEach((playlist) => {
        this.addPlaylist(playlist)
      })
    }
    
  }

  this.removeSongFromPlaylist = (tr) => {
    tr.parentNode.removeChild(tr)
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