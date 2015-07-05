(function(window, document) {
	var View = {};

	View.displayNewPlaylist = function(name) {
		var option = create('option');
		option.innerHTML = name;
		option.name = name;
		option.selected = true;
		$('#playlist-select').add(option);
		show('new-song-button');
	}

	View.selectPlaylist = function(index) {
		$('#playlist-select').options.selectedIndex = index;
	}

	View.displayNewSong = function(id, title, artist, callback) {
		var tr = create('tr');
		tr.id = id;
		tr.onclick = function() { callback(this); };
		var td = create('td');
		td.innerHTML = id + 1;
		tr.appendChild(td);
		td = create('td');
		td.innerHTML = title;
		tr.appendChild(td);
		td = create('td');
		td.innerHTML = artist;
		tr.appendChild(td);
		td = create('td');
		td.className = 'song-edit-buttons';
		if ($('#edit-playlist-button').style.display !== 'none') {
			td.style.display = 'none'
		}
		td.innerHTML = '<button onclick="moveUpButtonClick(event, this)">Move Up</button>' +
		               '<button onclick="moveDownButtonClick(event, this)">Move Down</button>' +
		               '<button onclick="removeSongButtonClick(event, this)">Delete</button>';
		tr.appendChild(td);
		$('#song-table').appendChild(tr);
	}

	View.displayAllSongs = function(playlist, callback) {
		$('#song-table').innerHTML = '';
		if (playlist) {
		    playlist.songs.forEach(function(song, index) {
	            View.displayNewSong(index, song.title, song.artist, callback);
	        });
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
    		$('#play-button').innerHTML = 'Play';
    	} else {
    		$('#play-button').innerHTML = 'Pause';
    	}
    }

    View.displayCurrentSong = function(song) {
    	if (!song) {
    		$('#current-song').innerHTML = 'Now Playing: '
    	} else {
    		$('#current-song').innerHTML = 'Now Playing: ' + song.artist + ' - ' + song.title;
    	}
    }

	window.View = View;
})(this, this.document);