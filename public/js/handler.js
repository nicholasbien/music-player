(function(window, document) {

    $('#playlist-select').addEventListener('change', function() {
        playlistSelect($('#playlist-select'));
    });

    $('#new-playlist-button').addEventListener('click', function() {
        hide('new-playlist-button');
        show('new-playlist-form');
        hide('edit-playlist-button');
    });

    $('#new-playlist-form').style.display = 'none';
    $('#new-playlist-form').addEventListener('submit', function(event) {
        event.preventDefault();
        $('#new-playlist-form').reset();
        hide('new-playlist-form');
        show('edit-playlist-button');
        show('new-playlist-button');
    });

    $('#new-playlist-submit').addEventListener('click', addPlaylistButtonClick);

    $('#edit-playlist-button').addEventListener('click', function() {
        hide('edit-playlist-button');
        hide('new-playlist-button');
        show('edit-playlist-form');
        showClass('song-edit-buttons');
    });

    $('#edit-playlist-form').style.display = 'none';
    $('#edit-playlist-form').addEventListener('submit', function(event) {
        event.preventDefault();
        $('#edit-playlist-form').reset();
        show('new-playlist-button');
        hide('edit-playlist-form');
        hideClass('song-edit-buttons');
        show('edit-playlist-button');
    });

    $('#delete-playlist-button').addEventListener('click', removePlaylistButtonClick);

    $('#edit-playlist-submit').addEventListener('click', editPlaylistButtonClick);

    $('#mute-button').addEventListener('click', muteButtonClick);

    $('#volume').addEventListener('mousemove', function() {
        volumeChange($('#volume'));
    });

    $('#volume').addEventListener('change', function() {
        volumeChange($('#volume'));
    });

    $('#time').addEventListener('mousedown', function() {
        mouseDownOnTime($('#time'));
    });

    $('#time').addEventListener('change', function() {
        timeChange($('#time'));
    });

    $('#previous-button').addEventListener('click', previousButtonClick);
    $('#play-button').addEventListener('click', playButtonClick);
    $('#next-button').addEventListener('click', nextButtonClick);

    $('#new-song-button').style.display = 'none';
    $('#new-song-button').addEventListener('click', function() {
        show('new-song-form');
        hide(this.id);
    });

    $('#new-song-form').style.display = 'none';
    $('#new-song-form').addEventListener('submit', function() {
        event.preventDefault();
        $('#new-song-form').reset();
        hide('new-song-form');
        show('new-song-button');
    });

    $('#new-song-submit').addEventListener('click', addSongButtonClick);

})(this, this.document);
