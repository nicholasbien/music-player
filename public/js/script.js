function Playlist() {
    var self = this;
    self.name;
    self.songs = [];
}

function Song() {
    var self = this;
    self.url;
    self.streamUrl;
    self.title;
    self.artist;
}

function PlayerViewModel() {
    var self = this;

    self.getStreamUrl = function(url, callback) {
        $.get('/search?id=' + url.substring(url.indexOf('=') + 1), function(data) {
            callback(data);
        });
    };

    var storedPlaylists = JSON.parse(localStorage.getItem('playlists'));
    self.playlists = ko.observableArray(storedPlaylists);
    self.playlists().forEach(function(playlist) {
        playlist.songs.forEach(function(song) {
            self.getStreamUrl(song.url, function(streamUrl) {
                song.streamUrl = streamUrl;
            });
        });
    });

    self.songs = ko.observableArray([]);

    self.currentPlaylist = ko.observable(null);
    
    self.newPlaylistFormVisible = ko.observable(false);
    self.newPlaylistName = ko.observable('');

    self.newSongFormVisible = ko.observable(false);

    self.currentSong = ko.observable(null);
    self.previousSong = ko.computed(function() {
        var index = self.songs().indexOf(self.currentSong());
        if (index === 0 || index === -1) {
            return null;
        } else {
            return self.songs()[index - 1];
        }
    });
    self.nextSong = ko.computed(function() {
        var index = self.songs().indexOf(self.currentSong());
        if (index === self.songs().length - 1 || index === -1) {
            return null;
        } else {
            return self.songs()[index + 1];
        }
    });

    self.reorderBoxVisible = ko.observable(false);
    self.renameBoxVisible = ko.observable(false);

    self.audioPaused = ko.observable(true);
    self.volumeLevel = ko.observable(100);

    self.audio = new Audio();
    self.audio.addEventListener('ended', function(event) {
        self.currentSong(self.nextSong());
    });

    self.currentTime = ko.observable(0);
    self.audioPosition = ko.observable(0);
    self.totalTime = ko.observable(0);

    self.currentTime.subscribe(function(currentTime) {
        self.audioPosition(parseInt(100 * currentTime / self.audio.duration, 10) || 0);
        self.totalTime(self.audio.duration);
    });

    self.audioPosition.subscribe(function(audioPosition) {
        var newCurrentTime = self.audioPosition() / 100 * self.audio.duration;
        if (Math.abs(newCurrentTime - self.audio.currentTime) > 1) {
            self.audio.currentTime = newCurrentTime;
        }
    });

    self.currentPlaylist.subscribe(function(currentPlaylist) {
        self.currentSong(null);
        if (currentPlaylist != null) {
            self.songs(currentPlaylist.songs);
        } else {
            self.songs([]);
        }
    });

    self.currentSong.subscribe(function(currentSong) {
        if (currentSong === null) {
            self.audio.src = '';
            self.audioPaused(true);
        } else {
            self.audio.src = currentSong.streamUrl;
            self.audio.play();
            setInterval(function() { self.currentTime(self.audio.currentTime); }, 100);
        }
    });
    self.audioPaused.subscribe(function(audioPaused) {
        if (audioPaused) {
            self.audio.pause();
        } else {
            self.audio.play();
        }
    });
    self.volumeLevel.subscribe(function(volumeLevel) {
        self.audio.volume = parseInt(volumeLevel, 10) / 100.0;
    });

    self.playButtonText = ko.computed(function() {
        if (self.audioPaused()) {
            return 'Play';
        } else {
            return 'Pause';
        }
    });

    self.songs.subscribe(function(songs) {
        if (self.currentPlaylist() != null) {
            self.currentPlaylist().songs = songs;
            localStorage.setItem('playlists', ko.toJSON(self.playlists));
        }
    });

    self.reorderSongs = function() {
        var newSongs = new Array(self.songs.length);
        var $reorderBoxes = $('.reorder-box');
        $reorderBoxes.each(function(index) {
            if ($(this).val() === '') {
                newSongs.splice(index, 0, self.songs()[index]);
            } else {
                newSongs.splice(parseInt($(this).val() - 1, 10), 0, self.songs()[index]);
            }
            $(this).val('');
        });
        self.songs(newSongs);
        self.reorderBoxVisible(false);
    }

    self.renamePlaylist = function() {
        var $renameBox = $('#rename-box');
        var index = self.playlists().indexOf(self.currentPlaylist());
        var playlist = new Playlist();
        playlist.name = $renameBox.val();
        playlist.songs = self.currentPlaylist().songs;
        self.playlists.splice(index, 1, playlist);
        self.currentPlaylist(self.playlists()[index]);
        $renameBox.val('');
        self.renameBoxVisible(false);
    }
    
    self.addSong = function() {
        var $newSongUrl = $('#new-song-url');
        var $newSongTitle = $('#new-song-title');
        var $newSongArtist = $('#new-song-artist');
        
        var url = $newSongUrl.val();
        self.getStreamUrl(url, function(streamUrl) {
            var song = new Song();
            song.url = url;
            song.streamUrl = streamUrl;
            song.title = $newSongTitle.val();
            song.artist = $newSongArtist.val();
            self.songs.push(song);
            $newSongUrl.val('');
            $newSongTitle.val('');
            $newSongArtist.val('');
            self.newSongFormVisible(false);
        });
    }


    self.addPlaylist = function() {
        var newPlaylist = new Playlist();
        newPlaylist.name = self.newPlaylistName();
        self.playlists.push(newPlaylist);
        self.newPlaylistName('');
        self.newPlaylistFormVisible(false);
        self.currentPlaylist(newPlaylist);
    }

    self.deletePlaylist = function() {
        var index = self.playlists().indexOf(self.currentPlaylist());
        self.playlists.splice(index, 1);
    }



    self.previousButtonClick = function() {
        if (self.audioPaused() || self.audio.currentTime > 2) {
            self.audio.currentTime = 0;
        } else {
            self.currentSong(self.previousSong());
        }
    }

    self.playButtonClick = function() {
        if (self.currentSong() === null && self.songs().length > 0) {
            self.currentSong(self.songs()[0]);
        }
        if (self.currentSong() !== null) {
            var temp = self.audioPaused();
            self.audioPaused(!temp);
        }
    }

    self.nextButtonClick = function() {
        self.currentSong(self.nextSong());
    }

    self.songClick = function(song) {
        self.currentSong(song);
        self.audioPaused(false);
    }

    self.deleteSong = function(song) {
        var index = self.songs().indexOf(song);
        self.songs.splice(index, 1);
    }
}

ko.applyBindings(new PlayerViewModel());