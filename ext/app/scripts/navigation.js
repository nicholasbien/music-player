(function(window, document) {

  var hoverImgChangeId = ['open-up-img', 'left-seek', 'play', 'right-seek'];

  function imgOn() {
  	var src = this.getAttribute('src');
  	var newSrc = src.substring(0, src.length - 7) + 'on.png';
    this.setAttribute('src', newSrc);
  }

  function imgOff() {
  	var src = this.getAttribute('src');
  	var newSrc = src.substring(0, src.length - 6) + 'off.png';
    this.setAttribute('src', newSrc);
  }

  for (var i = 0; i < hoverImgChangeId.length; i++) {
    var str = '#' + hoverImgChangeId[i];
  	$(str).addEventListener('mouseover', imgOn, false);
  	$(str).addEventListener('mouseout', imgOff, false);
  }

  $('#open-up-img').addEventListener('click', function() {
  	if ($('#song-info-container').style.borderTop != '') {
  		this.setAttribute('src', './images/open-on.png');
  		$('#song-info-container').style.borderTop = '';
      hide('hide-container');
  	} else {
  		this.setAttribute('src', './images/close-on.png');
  		$('#song-info-container').style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
      show('hide-container');
      show('option-container');
      show('playlists-container');
      View.showPlaylists();
  	}
  });

  $('#add-playlist').addEventListener('click', function() {
  	this.style.display = 'none';
    show('add-playlist-execute');
  });

  $('#option-playlists-button').addEventListener('click', function() {
  	hide('add-playlist-execute');
  	hide('add-container');
  	hide('playlist-container');
  	show('playlists-container');
  	$('#add-playlist').style.display = 'block'; // special case
  });

  $('#option-song-button').addEventListener('click', function() {
  	hide('add-playlist-execute');
  	hide('playlist-container');
  	hide('playlists-container');
  	hide('add-playlist');
    show('add-container');
  });

})(this, this.document);
