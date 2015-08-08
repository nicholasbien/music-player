(function(window, document) {
	currentPlaylist = null;
	currentSong = null;
	var audio = new Audio();

    window.addEventListener('load', function(event) {
        currentPlaylist = Model.loadPlaylists();
        View.displayAllPlaylists(Model.getAllPlaylists());
        if (currentPlaylist) {
            View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
            View.displayAllSongs(currentPlaylist, songClick);
        }
    });

    window.addEventListener('unload', function(event) {
        Model.saveChanges();
    });

    audio.addEventListener('ended', function(event) {
        currentSong = getNextSong();
        if (currentSong) {
            audio.src = currentSong.streamUrl;
            audio.play();
        } else {
            audio.src = '';
            View.setTimes(audio.currentTime, audio.duration);
            View.setPlayButtonText(audio.paused);
        }
        View.displayCurrentSong(currentSong);
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
		currentPlaylist = Model.addNewPlaylist(name);
		View.displayNewPlaylist(name, currentPlaylist);
        View.displayAllSongs(currentPlaylist, songClick);
        View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
	}

	playlistSelect = function(selected) {
        currentPlaylist = Model.getPlaylistByName(selected.innerHTML);
		$('#songs').innerHTML = '';
        View.displayAllSongs(currentPlaylist, songClick);
        View.selectPlaylist(selected);
	}

    songClick = function(tr) {
        currentSong = currentPlaylist.songs[tr.id];
        if (currentSong) {
            audio.src = currentSong.streamUrl;
            audio.play();
        } else {
            audio.src = '';
            audio.pause();
        }
        View.setPlayButtonText(audio.paused);
        View.displayCurrentSong(currentSong);
    }

	addSongButtonClick = function() {
		var url = $('#new-song-url').value;
		var title = $('#new-song-title').value;
		var artist = $('#new-song-artist').value;
		currentPlaylist = Model.addNewSong(currentPlaylist, url, title, artist);
		View.displayNewSong(currentPlaylist.songs.length - 1, title, artist, songClick);
	}

    previousButtonClick = function() {
        if (audio.paused || audio.currentTime > 2) {
            audio.currentTime = 0;
        } else {
            currentSong = getPreviousSong();
            if (currentSong) {
                audio.src = currentSong.streamUrl;
                audio.play();
            } else {
                audio.pause();
                audio.src = '';
            }
        }
        View.setTimes(audio.currentTime, audio.duration);
        View.setPlayButtonText(audio.paused);
        View.displayCurrentSong(currentSong);
    }

    playButtonClick = function() {
        if (currentPlaylist) {
            if (currentSong) {
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            }
            if (!currentSong && currentPlaylist.songs.length > 0) {
                currentSong = currentPlaylist.songs[0];
                audio.src = currentSong.streamUrl;
                audio.play();
            }
        }
        View.setPlayButtonText(audio.paused);
        View.displayCurrentSong(currentSong);
    }

    nextButtonClick = function() {
        currentSong = getNextSong();
        if (currentSong) {
            audio.src = currentSong.streamUrl;
            audio.play();
        } else {
            audio.pause();
            audio.src = '';
        }
        View.setTimes(audio.currentTime, audio.duration);
        View.setPlayButtonText(audio.paused);
        View.displayCurrentSong(currentSong);
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
        event.stopPropagation();
        var tr = button.parentNode.parentNode;
        currentPlaylist = Model.moveSongUp(currentPlaylist, parseInt(tr.id, 10));
        View.displayAllSongs(currentPlaylist, songClick);
    }

    moveDownButtonClick = function(event, button) {
        event.stopPropagation();
        var tr = button.parentNode.parentNode;
        currentPlaylist = Model.moveSongDown(currentPlaylist, parseInt(tr.id, 10));
        View.displayAllSongs(currentPlaylist, songClick);
    }

    removeSongButtonClick = function(event, button) {
        event.stopPropagation();
        var tr = button.parentNode.parentNode;
        currentPlaylist = Model.removeSong(currentPlaylist, parseInt(tr.id, 10));
        View.removeSongFromDisplay(tr);
    }

    volumeChange = function(input) {
        audio.volume = parseInt(input.value, 10) / 100.0;
    }

    muteButtonClick = function() {
        audio.volume = 0;
        $('#volume').value = 0;
    }

    editPlaylistButtonClick = function() {
        var newName = $('#rename-playlist-box').value;
        if (newName !== '') {
            Model.renamePlaylist(currentPlaylist, newName);
            View.displayAllPlaylists(Model.getAllPlaylists());
        }
    }

    removePlaylistButtonClick = function() {
        Model.removePlaylist(currentPlaylist);
        View.displayAllPlaylists(Model.getAllPlaylists());
        currentPlaylist = Model.getAllPlaylists()[0] || null;
        View.displayAllSongs(currentPlaylist, songClick);
        View.selectPlaylist($('#playlist-select').childNodes[Model.getIndexOfPlaylist(currentPlaylist)]);
    }

})(this, this.document);