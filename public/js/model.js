(function(window, document) {
	var Model = {};

	var playlists = [];

	Model.loadPlaylists = function(databasePlaylists) {
		playlists = databasePlaylists
		return playlists[0] || null;
	}

	Model.getSamplePlaylist = function() {
		var playlist = {
			name: 'Sample Playlist',
			songs: []
		}
		playlist.songs = [
			{
				url: 'https://soundcloud.com/benkhan/1000bk',
				title: '1000',
				artist: 'Ben Khan'
			}, {
				url: 'https://soundcloud.com/blackbirdblackbirdsf/all',
				title: 'All',
				artist: 'Blackbird Blackbird'
			}, {
				url: 'https://soundcloud.com/satinjackets/you-make-me-feel-good',
				title: 'You Make Me Feel Good',
				artist: 'Satin Jackets'
			}
		];
		return playlist;
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
		console.log(playlist)
		console.log(playlists)
		return playlists.indexOf(playlist);
	}

	Model.addNewPlaylist = function(playlist) {
		// var playlist = {
		// 	name: name,
		// 	songs: []
		// }
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