(function(window, document) {
	var Model = {};

	var playlists = [];

	Model.loadPlaylists = function() {
		playlists = JSON.parse(localStorage.getItem('playlists')) || [];
		playlists.forEach(function(playlist) {
			playlist.songs.forEach(function(song) {
				requestStream(song.url, function(streamUrl) {
					song.streamUrl = streamUrl;
				});
			});
		});
		return playlists[0] || null;
	}

	Model.getPlaylistByName = function(name) {
		for (var i = 0; i < playlists.length; i++) {
			if (playlists[i].name === name) {
				return playlists[i];
			}
		}
		return null;
	}

	Model.getIndexOfPlaylist = function(playlist) {
		return playlists.indexOf(playlist);
	}

	Model.addNewPlaylist = function(name) {
		var playlist = {
			name: name,
			songs: []
		}
		playlists.push(playlist);
		return playlist;
	}

	Model.addNewSong = function(playlist, url, title, artist) {
		var song = {
			url: url,
			title: title,
			artist: artist
		};
		requestStream(song.url, function(streamUrl) {
			song.streamUrl = streamUrl;
		});
		var index = playlists.indexOf(playlist);
		playlists[index].songs.push(song);
		localStorage.setItem('playlists', JSON.stringify(playlists));
	}

	Model.removeSong = function(playlist, songIndex) {
		var playlistIndex = playlists.indexOf(playlist);
		playlists[playlistIndex].songs.splice(songIndex, 1);
		localStorage.setItem('playlists', JSON.stringify(playlists));
		return playlists[playlistIndex];
	}

	Model.moveSongUp = function(playlist, songIndex) {
		var playlistIndex = playlists.indexOf(playlist);
		if (songIndex != 0) {
			var song = playlists[playlistIndex].songs.splice(songIndex, 1)[0];
			playlists[playlistIndex].songs.splice(songIndex - 1, 0, song);
		}
		return playlists[playlistIndex];
	}

	Model.moveSongDown = function(playlist, songIndex) {
		var playlistIndex = playlists.indexOf(playlist);
		if (songIndex != playlists[playlistIndex].songs.length - 1) {
			var song = playlists[playlistIndex].songs.splice(songIndex, 1)[0];
			playlists[playlistIndex].songs.splice(songIndex + 1, 0, song);
		}
		return playlists[playlistIndex];
	}

	var requestStream = function(url, callback) {
		var request = new XMLHttpRequest();
		request.addEventListener('load', function(event) {
			callback(JSON.parse(request.responseText));
		});
        request.open('GET', '/search?url=' + url);
        request.send();
    };

    Model.getAllPlaylists = function() {
    	return playlists;
    }

    Model.renamePlaylist = function(playlist, name) {
    	playlist.name = name;
    }

    Model.removePlaylist = function(playlist) {
    	var index = playlists.indexOf(playlist);
    	playlists.splice(index, 1);
    }

    Model.saveChanges = function() {
    	localStorage.setItem('playlists', JSON.stringify(playlists));
    }

	window.Model = Model;
})(this, this.document);