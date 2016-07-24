(function(window, document) {
  currentPlaylist = null;
  currentSong = null;
  currentUser = null;

  var audio = new Audio();

  window.addEventListener('load', function(event) {
    // currentPlaylist = Model.loadPlaylists();
    // View.displayAllPlaylists(Model.getAllPlaylists());
    // if (currentPlaylist) {
    //     View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
    //     View.displayAllSongs(currentPlaylist, songClick);
    // }
  });

  changeSong = function(song) {
    currentSong = song;
    if (currentSong) {
      audio.removeAttribute('src');
      audio.load();
      audio.src = currentSong.streamUrl;
      audio.play();
    } else {
      audio.src = '';
    }
    View.setTimes(audio.currentTime, audio.duration);
    View.setPlayButtonText(audio.paused);
    View.displayCurrentSong(currentSong);
    var index = currentPlaylist.songs.indexOf(currentSong);
    if (index != -1) {
      View.highlightCurrentSong(song._id);
    }
  }

  window.addEventListener('unload', function(event) {
    localStorage.clear();
  });

  audio.addEventListener('ended', function(event) {
    changeSong(getNextSong());
  });

  var moveTimeSlider = function() {
    View.setTimes(audio.currentTime, audio.duration);
  }
  var updateTime = function() {
    View.setTimes($('#time').value / 100 * audio.duration, audio.duration);
  }

  var keepTime = setInterval(moveTimeSlider, 100);

  timeChange = function(input) {
    audio.currentTime = $('#time').value / 100 * audio.duration || 0;
    keepTime = setInterval(moveTimeSlider, 100);
    input.removeEventListener('mousemove', updateTime);
  }

  mouseDownOnTime = function(input) {
    input.addEventListener('mousemove', updateTime);
    clearInterval(keepTime);
  }

  addPlaylistButtonClick = function() {
    var name = $('#new-playlist-name').value;
    if (name) {
      
      let playlist = {
        name: name,
        songs: []
      }
      request('POST', '/user/' + currentUser._id + '/playlist', playlist, (playlist) => {
        currentPlaylist = playlist
        // Model.addNewPlaylist(playlist);
        View.displayNewPlaylist(playlist._id, name);
        View.displayAllSongs(currentPlaylist, songClick);
        View.selectPlaylist(playlist._id);
      })
    }
  }

  playlistSelect = function(selected) {
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

  songClick = function(tr) {
    currentPlaylist.songs.forEach((song) => {
      if (song._id === tr.id) {
        changeSong(song)
      }
    })
  }

  addSongButtonClick = function() {
    let url = $('#new-song-url').value
    let title = $('#new-song-title').value
    let artist = $('#new-song-artist').value
    let song = {
      url: url,
      title: title,
      artist: artist
    }
    request('POST', '/playlist/' + currentPlaylist._id + '/song', song, (song) => {
      currentPlaylist.songs.push(song)
      View.displayNewSong(song._id, currentPlaylist.songs.length - 1, title, artist, songClick);
    })
  }

  previousButtonClick = function() {
    if (audio.paused || audio.currentTime > 2) {
      audio.currentTime = 0;
    } else {
      changeSong(getPreviousSong());
    }
  }

  playButtonClick = function() {
    if (currentPlaylist) {
      if (currentSong) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
        View.setPlayButtonText(audio.paused);
      } else if (currentPlaylist.songs.length > 0) {
        changeSong(currentPlaylist.songs[0]);
      }
    }
  }

  nextButtonClick = function() {
    changeSong(getNextSong());
  }

  getPreviousSong = function() {
    if (!currentPlaylist || !currentSong) {
      return null;
    }
    var index = currentPlaylist.songs.indexOf(currentSong);
    if (index === 0 || index === -1) {
      return null;
    } else {
      return currentPlaylist.songs[index - 1];
    }
  }

  getNextSong = function() {
    if (!currentPlaylist || !currentSong) {
      return null;
    }
    var index = currentPlaylist.songs.indexOf(currentSong);
    if (index === currentPlaylist.songs.length - 1 || index === -1) {
      return null;
    } else {
      return currentPlaylist.songs[index + 1];
    }
  }

  moveUpButtonClick = function(event, button) {
  //     event.stopPropagation();
  //     var tr = button.parentNode.parentNode;
  //     currentPlaylist = Model.moveSongUp(currentPlaylist, parseInt(tr.id, 10));
  //     View.displayAllSongs(currentPlaylist, songClick);
  }

  moveDownButtonClick = function(event, button) {
  //     event.stopPropagation();
  //     var tr = button.parentNode.parentNode;
  //     currentPlaylist = Model.moveSongDown(currentPlaylist, parseInt(tr.id, 10));
  //     View.displayAllSongs(currentPlaylist, songClick);
  }

  removeSongButtonClick = function(event, button) {
  //     event.stopPropagation();
  //     var tr = button.parentNode.parentNode;
  //     currentPlaylist = Model.removeSong(currentPlaylist, parseInt(tr.id, 10));
  //     View.removeSongFromDisplay(tr);
  //     View.displayAllSongs(currentPlaylist, songClick);
  }

  volumeChange = function(input) {
    audio.volume = parseInt(input.value, 10) / 100.0;
  }

  muteButtonClick = function() {
    audio.volume = 0;
    $('#volume').value = 0;
  }

  editPlaylistButtonClick = function() {
  //     var newName = $('#rename-playlist-box').value;
  //     if (newName !== '') {
  //         Model.renamePlaylist(currentPlaylist, newName);
  //         View.displayAllPlaylists(Model.getAllPlaylists());
  //         View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
  //     }
  }

  removePlaylistButtonClick = function() {
  //     Model.removePlaylist(currentPlaylist);
  //     View.displayAllPlaylists(Model.getAllPlaylists());
  //     currentPlaylist = Model.getAllPlaylists()[0] || null;
  //     View.displayAllSongs(currentPlaylist, songClick);
  //     if (currentPlaylist) {
  //         View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
  //     }
  }

  loginUser = function() {
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

  registerUser = function() {
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

})(this, this.document);