var hoverImgChangeId = ["open-up-img", "left-seek", "play", "right-seek"];

function imgOn() {
	var src = this.getAttribute("src");
	var newSrc = src.substring(0, src.length - 7) + "on.png";
  this.setAttribute("src", newSrc);
}

function imgOff() {
	var src = this.getAttribute("src");
	var newSrc = src.substring(0, src.length - 6) + "off.png";
  this.setAttribute("src", newSrc);
}

for (var i = 0; i < hoverImgChangeId.length; i++) {
	document.getElementById(hoverImgChangeId[i]).addEventListener("mouseover", imgOn, false);
	document.getElementById(hoverImgChangeId[i]).addEventListener("mouseout", imgOff, false);
}

document.getElementById("open-up-img").addEventListener("click", function() {
	if (document.getElementById("song-info-container").style.borderTop != "") {
		this.setAttribute("src", "./images/open-on.png");
		document.getElementById("song-info-container").style.borderTop = "";
		document.getElementById("option-container").style.display = "none";
		document.getElementById("add-playlist-execute").style.display = "none";
		document.getElementById("add-container").style.display = "none";
		document.getElementById("playlist-container").style.display = "none";
		document.getElementById("playlists-container").style.display = "none";
		document.getElementById("add-playlist").style.display = "none";
	} else {
		this.setAttribute("src", "./images/close-on.png");
		document.getElementById("song-info-container").style.borderTop = "1px solid rgba(255, 255, 255, 0.3)";
		document.getElementById("option-container").style.display = "inline";
		document.getElementById("playlists-container").style.display = "inline";
	}
});

document.getElementById("add-playlist").addEventListener("click", function() {
	this.style.display = "none";
	document.getElementById("add-playlist-execute").style.display = "inline";
});

document.getElementById("option-playlists-button").addEventListener("click", function() {
	document.getElementById("add-playlist-execute").style.display = "none";
	document.getElementById("add-container").style.display = "none";
	document.getElementById("playlist-container").style.display = "none";
	document.getElementById("playlists-container").style.display = "inline";
	document.getElementById("add-playlist").style.display = "block";
});

document.getElementById("option-song-button").addEventListener("click", function() {
	document.getElementById("add-playlist-execute").style.display = "none";
	document.getElementById("playlist-container").style.display = "none";
	document.getElementById("playlists-container").style.display = "none";
	document.getElementById("add-playlist").style.display = "none";
	document.getElementById("add-container").style.display = "inline";
});