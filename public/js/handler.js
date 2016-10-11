'use strict'

$('#new-playlist-form').hide()
$('#edit-playlist-button').hide()
$('#new-song-button').hide()
$('#edit-playlist-form').hide()
$('#new-song-form').hide()
$('th.song-edit-buttons').hide()

$('#playlist-select').click(() => { playlistSelect(event.target) })

$('#new-playlist-button').click(() => {
  $('#new-playlist-button').hide()
  $('#new-playlist-form').show()
  $('#edit-playlist-button').hide()
})

$('#new-playlist-form').submit((event) => {
  event.preventDefault()
  $('#new-playlist-form')[0].reset()
  $('#new-playlist-form').hide()
  if ($('.selected').length) {
    $('#edit-playlist-button').show()
  }
  $('#new-playlist-button').show()
})

$('#new-playlist-submit').click(addPlaylistButtonClick)

$('#edit-playlist-button').click(() => {
  $('#edit-playlist-button').hide()
  $('#new-playlist-button').hide()
  $('#edit-playlist-form').show()
  if ($('#song-table td').length) {
    $('.song-edit-buttons').show()
  }
})

$('#edit-playlist-form').submit((event) => {
  event.preventDefault()
  $('#edit-playlist-form')[0].reset()
  $('#new-playlist-button').show()
  $('#edit-playlist-form').hide()
  $('.song-edit-buttons').hide()
  if ($('.selected').length) {
    $('#edit-playlist-button').show()
  } else {
    $('#new-song-button').hide()
  }
})

$('#delete-playlist-button').click(removePlaylistButtonClick)

$('#edit-playlist-submit').click(editPlaylistButtonClick)

$('#volume').mousemove(() => { volumeChange($('#volume')[0]) })

$('#volume').change(() => { volumeChange($('#volume')[0]) })

$('#time').mousedown(() => { mouseDownOnTime($('#time')[0]) })

$('#time').change(() => { timeChange($('#time')[0]) })

$('#previous-button').click(previousButtonClick)

$('#play-button').click(playButtonClick)

$('#next-button').click(nextButtonClick)

$('#new-song-button').click(() => {
  $('#new-song-form').show()
  $('#new-song-button').hide()
})

$('#new-song-form').submit((event) => {
  event.preventDefault()
  $('#new-song-form')[0].reset()
  $('#new-song-form').hide()
  $('#new-song-button').show()
})

$('#new-song-submit').click(addSongButtonClick)

$('#logout').click(logoutUser)
