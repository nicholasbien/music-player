'use strict'

hide('#new-playlist-form')
hide('#edit-playlist-button')
hide('#login-form')
hide('#register-form')
hide('#new-song-button')
hide('#edit-playlist-form')
hide('#new-song-form')
hide('th.song-edit-buttons')

$('#playlist-select').addEventListener('click', () => {
  if (event.target) {
    playlistSelect(event.target)
  }
})

$('#new-playlist-button').addEventListener('click', () => {
  hide('#new-playlist-button')
  show('#new-playlist-form')
  hide('#edit-playlist-button')
})

$('#new-playlist-form').addEventListener('submit', (event) => {
  event.preventDefault()
  $('#new-playlist-form').reset()
  hide('#new-playlist-form')
  if ($('.selected')) {
    show('#edit-playlist-button')
    show('#new-song-button')
  }
  show('#new-playlist-button')

})

$('#new-playlist-submit').addEventListener('click', addPlaylistButtonClick)

$('#edit-playlist-button').addEventListener('click', () => {
  hide('#edit-playlist-button')
  hide('#new-playlist-button')
  show('#edit-playlist-form')
  if ($('#song-table td')) {
    show('.song-edit-buttons')
  }
})

$('#edit-playlist-form').addEventListener('submit', (event) => {
  event.preventDefault()
  $('#edit-playlist-form').reset()
  show('#new-playlist-button')
  hide('#edit-playlist-form')
  hide('.song-edit-buttons')
  if ($('.selected')) {
    show('#edit-playlist-button')
  } else {
    hide('#new-song-button')
  }
})

$('#delete-playlist-button').addEventListener('click', removePlaylistButtonClick)

$('#edit-playlist-submit').addEventListener('click', editPlaylistButtonClick)

$('#volume').addEventListener('mousemove', () => {
  volumeChange($('#volume'))
})

$('#volume').addEventListener('change', () => {
  volumeChange($('#volume'))
})

$('#time').addEventListener('mousedown', () => {
  mouseDownOnTime($('#time'))
})

$('#time').addEventListener('change', () => {
  timeChange($('#time'))
})

$('#previous-button').addEventListener('click', previousButtonClick)
$('#play-button').addEventListener('click', playButtonClick)
$('#next-button').addEventListener('click', nextButtonClick)

$('#new-song-button').addEventListener('click', () => {
  show('#new-song-form')
  hide('#new-song-button')
})

$('#new-song-form').addEventListener('submit', (event) => {
  event.preventDefault()
  $('#new-song-form').reset()
  hide('#new-song-form')
  show('#new-song-button')
})

$('#new-song-submit').addEventListener('click', addSongButtonClick)

$('#register-form').addEventListener('submit', () => {
  event.preventDefault()
  $('#register-form').reset()
})

$('#login-button').addEventListener('click', () => {
  hide('#login-button')
  hide('#register-button')
  show('#login-form')
})

$('#login-form').addEventListener('submit', (event) => {
  event.preventDefault()
  $('#login-form').reset()
  hide('#login-form')
  show('#login-button', true)
  show('#register-button', true)
})

$('#login-submit').addEventListener('click', loginUserButtonClick)

$('#register-button').addEventListener('click', () => {
  hide('#login-button')
  hide('#register-button')
  show('#register-form')
})

$('#register-form').addEventListener('submit', () => {
  event.preventDefault()
  $('#register-form').reset()
  hide('#register-form')
  show('#login-button', true)
  show('#register-button', true)
})

$('#register-submit').addEventListener('submit', registerUserButtonClick)