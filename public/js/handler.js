(function(window, document) {

  hide('#new-playlist-form');
  hide('#edit-playlist-button');
  hide('#new-song-button');
  hide('#edit-playlist-form');
  hide('#new-song-form');
  hide('th.song-edit-buttons');

  $('#playlist-select').addEventListener('click', function() {
    if (event.target) {
      playlistSelect(event.target);
    }
  });

  $('#new-playlist-button').addEventListener('click', function() {
    hide('#new-playlist-button');
    show('#new-playlist-form');
    hide('#edit-playlist-button');
  });

  $('#new-playlist-form').addEventListener('submit', function(event) {
    event.preventDefault();
    $('#new-playlist-form').reset();
    hide('#new-playlist-form');
    if ($('.selected')) {
      show('#edit-playlist-button');
    }
    show('#new-playlist-button');
  });

  $('#new-playlist-submit').addEventListener('click', addPlaylistButtonClick);

  $('#edit-playlist-button').addEventListener('click', function() {
    hide('#edit-playlist-button');
    hide('#new-playlist-button');
    show('#edit-playlist-form');
    if ($('#song-table td')) {
      show('.song-edit-buttons');
    }
  });

  $('#edit-playlist-form').addEventListener('submit', function(event) {
    event.preventDefault();
    $('#edit-playlist-form').reset();
    show('#new-playlist-button');
    hide('#edit-playlist-form');
    hide('.song-edit-buttons');
    if ($('.selected')) {
      show('#edit-playlist-button');
    } else {
      hide('#new-song-button');
    }
  });

  $('#delete-playlist-button').addEventListener('click', removePlaylistButtonClick);

  $('#edit-playlist-submit').addEventListener('click', editPlaylistButtonClick);

  //$('#mute-button').addEventListener('click', muteButtonClick);

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

  $('#new-song-button').addEventListener('click', function() {
    show('#new-song-form');
    hide('#new-song-button');
  });

  $('#new-song-form').addEventListener('submit', function() {
    event.preventDefault();
    $('#new-song-form').reset();
    hide('#new-song-form');
    show('#new-song-button');
  });

  $('#new-song-submit').addEventListener('click', addSongButtonClick);

  $('#register-form').addEventListener('submit', function() {
    event.preventDefault()
    $('#register-form').reset()
  });

  $('#register-submit').addEventListener('click', registerUser);

  $('#login-submit').addEventListener('click', loginUser);

})(this, this.document);
