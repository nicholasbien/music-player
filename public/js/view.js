'use strict'

function View() {
  let currentPlaylist = null

  let highlightSong = (id) => {
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

  this.setPlaylist = (playlist) => {
    currentPlaylist = playlist
    this.displaySongs(playlist.songs)
  }

  this.displaySongs = (songs, callback) => {
    $('#songs').innerHTML = ''
    if (songs.length > 0) {
      songs.forEach((song, index) => {
        this.displaySong(song, callback)
      })
    } else {
      hide('th.song-edit-buttons')
    }
  }

  this.startSong = (song, playlist) => {
    this.setTimes(null)
    displayCurrentSong(song)
    if (currentPlaylist === playlist) {
      this.highlightCurrentSong(song._id)
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

  this.displayNewPlaylist = (id, name) => {
    let li = create('li')
    li.id = id
    li.innerHTML = name
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

  this.displaySong = (song, callback) => {
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

  this.displayAllPlaylists = (playlists) => {
    $('#playlist-select').innerHTML = ''
    if (playlists) {
      playlists.forEach((playlist) => {
        this.displayNewPlaylist(playlist._id, playlist.name)
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
}