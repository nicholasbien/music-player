(function(window, document) {
	var View = {};

	View.displayNewPlaylist = function(name) {
		var li = create('li');
		li.innerHTML = name;
		$('#playlist-select').appendChild(li);
		show('#new-song-button');
		show('#edit-playlist-button');
	}

	View.selectPlaylist = function(li) {
		var previous = $('#playlist-select > .selected');
		if (previous) {
			previous.className = '';
		}
		li.className = 'selected';
	}

	View.displayNewSong = function(id, title, artist, callback) {
		var tr = create('tr');
		tr.id = id;
		tr.onclick = function() { callback(this); };
		var td = create('td');
		td.innerHTML = id + 1;
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
		if (playlist) {
			if (playlist.songs.length > 0) {
				playlist.songs.forEach(function(song, index) {
	            	View.displayNewSong(index, song.title, song.artist, callback);
	        	});
			} else {
				hide('th.song-edit-buttons');
			}
		}
    }

    View.displayAllPlaylists = function(playlists) {
    	$('#playlist-select').innerHTML = '';
		playlists.forEach(function(playlist) {
			View.displayNewPlaylist(playlist.name);
		});
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

    View.highlightCurrentSong = function(index) {
    	var previous = $('#song-table tbody > .playing');
		if (previous) {
			previous.className = '';
		}
    	$('tr' + '#\\3' + index + ' ').className = 'playing';
    }

	window.View = View;
})(this, this.document);