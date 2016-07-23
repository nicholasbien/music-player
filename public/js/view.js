(function(window, document) {
	var View = {};

	View.displayNewPlaylist = function(id, name) {
		var li = create('li');
        li.id = id;
		li.innerHTML = name;
		$('#playlist-select').appendChild(li);
		show('#new-song-button');
		show('#edit-playlist-button');
	}

	View.selectPlaylist = function(id) {
		var previous = $('#playlist-select > .selected');
		if (previous) {
			previous.className = '';
		}
        var current = document.getElementById(id);
        if (current) {
            current.className = 'selected';
        }
	}

	View.displayNewSong = function(id, index, title, artist, callback) {
		var tr = create('tr');
		tr.id = id;
		tr.onclick = function() { callback(this); };
		var td = create('td');
		td.innerHTML = index + 1;
		td.className = 'song-number';
		tr.appendChild(td);
		td = create('td');
		td.innerHTML = title;
		td.className = 'song-title';
		tr.appendChild(td);
		td = create('td');
		td.innerHTML = artist;
		td.className = 'song-artist';
		tr.appendChild(td);
		td = create('td');
		td.className = 'song-edit-buttons';
		if ($('th.song-edit-buttons').style.display == 'none') {
			td.style.display = 'none';
		}
		td.innerHTML = '<button onclick="moveUpButtonClick(event, this)">Up</button>' +
		               '<button onclick="moveDownButtonClick(event, this)">Down</button>' +
		               '<button onclick="removeSongButtonClick(event, this)">Delete</button>';
		tr.appendChild(td);
		$('#songs').appendChild(tr);
	}

	View.displayAllSongs = function(playlist, callback) {
		$('#songs').innerHTML = '';
		if (playlist && playlist.songs) {
			if (playlist.songs.length > 0) {
				playlist.songs.forEach(function(song, index) {
	            	View.displayNewSong(song._id, index, song.title, song.artist, callback);
	        	});
			} else {
				hide('th.song-edit-buttons');
			}
		}
    }

    View.displayAllPlaylists = function(playlists) {
    	$('#playlist-select').innerHTML = '';
        if (playlists) {
            playlists.forEach(function(playlist) {
                View.displayNewPlaylist(playlist._id, playlist.name);
            });
        }
		
    }

    View.removeSongFromDisplay = function(tr) {
    	tr.parentNode.removeChild(tr);
    }

    View.setTimes = function(time, duration) {
    	if (time) {
        	var elapsedTime = parseInt(time / 60, 10) + ':' + ('0' + parseInt(time) % 60).slice(-2);
        	$('#elapsedTime').innerHTML = elapsedTime;
        	var songTime = parseInt(duration / 60, 10) + ':' + ('0' + parseInt(duration) % 60).slice(-2);
        	$('#songTime').innerHTML = songTime;
    	} else {
    		$('#elapsedTime').innerHTML = '0:00';
			$('#songTime').innerHTML = '-:--';
    	}
        $('#time').value = 100 * time / duration || 0;
    }

    View.setPlayButtonText = function(paused) {
    	if (paused) {
    		$('#play-button').innerHTML = '&gt;';
    	} else {
    		$('#play-button').innerHTML = '| |';
    	}
    }

    View.displayCurrentSong = function(song) {
    	if (!song) {
    		$('#current-song').innerHTML = ''
    	} else {
    		$('#current-song').innerHTML = song.artist + ' - ' + song.title;
    	}
    }

    View.highlightCurrentSong = function(id) {
    	var previous = $('#song-table tbody > .playing');
		if (previous) {
			previous.className = '';
		}
        var current = document.getElementById(id);
        if (current) {
            current.className = 'playing';
        }
    }

	window.View = View;
})(this, this.document);