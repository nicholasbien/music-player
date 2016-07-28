'use strict'

function View() {
  let playlists = []
  let currentPlaylist = null
  let clickCallback = null

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

  let displayPlaylist = (playlist) => {
    let li = create('li')
    li.id = playlist._id
    li.innerHTML = playlist.name
    $('#playlist-select').appendChild(li)
    show('#new-song-button')
    show('#edit-playlist-button')
  }

  let displayPlaylists = () => {
    playlists.forEach((playlist) => {
      displayPlaylist(playlist)
    })
  }

  let updateIndexes = () => {
    let trs = $('#songs').childNodes
    for (let i = 0; i < trs.length; i++) {
      trs[i].firstChild.innerHTML = i + 1
    }
  }

  this.setCurrentSong = (song) => {
    if (!song) {
      $('#current-song').innerHTML = ''
    } else {
      $('#current-song').innerHTML = song.artist + ' - ' + song.title
      highlightCurrentSong(song._id)
    }
  }

  this.setPlaylist = (id, callback) => {
    clickCallback = callback
    clearSongs()
    playlists.forEach((playlist) => {
      if (playlist._id === id) {
        currentPlaylist = playlist
      }
    })
    selectPlaylist(currentPlaylist._id)
    displaySongs(currentPlaylist.songs, callback)
  }

  this.startSong = (song) => {
    this.setTimes(null)
    this.setCurrentSong(song)
    if (song) {
      this.setPlayButtonText(false)
    } else {
      this.setPlayButtonText(true)
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
    playlists.push(playlist)
    displayPlaylist(playlist)
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
    updateIndexes()
    for (let i = 0; i < currentPlaylist.songs.length; i++) {
      if (currentPlaylist.songs[i] === tr.id) {
        currentPlaylist.songs.splice(i, 1)
        break
      }
    }
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

  this.removePlaylist = (id) => {
    let newIndex = -1
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i]._id === id) {
        playlists.splice(i, 1)
        newIndex = i - 1
        break
      }
    }
    clearPlaylists()
    displayPlaylists()
    if (newIndex > 0) {
      this.setPlaylist(playlists[newIndex]._id, clickCallback)
    }
  }

  this.reset = () => {
    clearSongs()
    clearPlaylists()
    playlists = []
    currentPlaylist = null
  }

  this.renamePlaylist = (renamedPlaylist) => {
    playlists.forEach((playlist) => {
      if (playlist._id === renamedPlaylist._id) {
        playlist.name = renamedPlaylist.name
      }
    })
    clearPlaylists()
    displayPlaylists()
    this.setPlaylist(renamedPlaylist, clickCallback)
  }
}