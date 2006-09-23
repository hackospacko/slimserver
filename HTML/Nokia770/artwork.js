var url = '[% webroot %]browsedb.html';
var parsedData;
var artistHrefTemplate = '[% webroot %]browsedb.html?hierarchy=album,track&amp;contributor.id=ARTIST&amp;level=1&player=[% playerURI %]';
var albumHrefTemplate = '[% webroot %]browsedb.html?hierarchy=album,track&level=1&album.id=ALBUM&player=[% playerURI %]';
var playAlbumTemplate = '[% webroot %]status.html?command=playlist&subcommand=loadtracks&album.id=ALBUM&player=[% playerURI %]';
var addAlbumTemplate = '[% webroot %]playlist.html?command=playlist&subcommand=addtracks&album.id=ALBUM&player=[% playerURI %]';
var blankRequest = 'hierarchy=album,track&level=0&artwork=2&player=00%3A04%3A20%3A05%3A1b%3A82&artwork=1&start=[% start %]&ajaxRequest=1';

var thisAlbum, thatAlbum;

[% PROCESS html/global.js %]
[% PROCESS skin_global.js %]

var thumbHrefTemplate = '/music/COVER/thumb_'+thumbSize+'x'+thumbSize+'_f_000000.jpg';

// parses the data if it has not been done already
function fillDataHash(theData) {
	var returnData = null;
	if (theData['player_id']) { 
		return theData;
	} else {
		var myData = theData.responseText;
		returnData = parseData(myData);
		return returnData;
	}
}

function emptyFunction() {
}

function showArrows(firstOne, secondOne, lastOne) {
	if (firstOne == '1') {
		if ($('last_cover_click')) {
			$('last_cover_click').onclick = emptyFunction;
			$('last_cover_click').src = '[% webroot %]html/images/rew.gif';
		}
		if ($('next_cover_click')) {
			$('next_cover_click').onclick = nextCover;
			$('next_cover_click').src = '[% webroot %]html/images/ffw_active.gif';
		}
	} else if (secondOne == lastOne) {
		if ($('last_cover_click')) {
			$('last_cover_click').onclick = lastCover;
			$('last_cover_click').src = '[% webroot %]html/images/rew_active.gif';
		}
		if ($('next_cover_click')) {
			$('next_cover_click').onclick = emptyFunction;
			$('next_cover_click').src = '[% webroot %]html/images/ffw.gif';
		}
	} else {
		if ($('last_cover_click')) {
			$('last_cover_click').onclick = lastCover;
			$('last_cover_click').src = '[% webroot %]html/images/rew_active.gif';
		}
		if ($('next_cover_click')) {
			$('next_cover_click').onclick = nextCover;
			$('next_cover_click').src = '[% webroot %]html/images/ffw_active.gif';
		}
	}
}

function refreshThumbs(theData) {
	parsedData = fillDataHash(theData);
	showArrows(thisAlbum, thatAlbum, parsedData['last']);
	refreshThumb(parsedData, '1', thisAlbum);
	refreshThumb(parsedData, '2', thatAlbum);
}

function refreshThumb(theData, whichOne, thatOne) {
	parsedData = fillDataHash(theData);
	var thumbId = 'thumb_' + whichOne;
	var thumbKey = 'coverthumb_' + thatOne;
	var albumKey = 'albumid_' + thatOne;
	var playId = 'play_' + whichOne;
	var addId = 'add_' + whichOne;
	var thatThumb = parsedData[thumbKey];
	var thatAlbum = parsedData[albumKey];
	if ($(thumbId)) {
		var thumbHref = thumbHrefTemplate.replace('COVER', thatThumb);
		$(thumbId).src = thumbHref;
	}
	if ($(playId)) {
		var playHref = playAlbumTemplate.replace('ALBUM', thatAlbum);
		refreshHref(playId, playHref);
	}
	if ($(addId)) {
		var addHref = addAlbumTemplate.replace('ALBUM', thatAlbum);
		refreshHref(addId, addHref);
	}
	var textKeys = [ 'artist_', 'album_' ];
	for (var i = 0; i < textKeys.length; i++) {
		var thisIdKey = textKeys[i] + whichOne;
		var thisDataKey = textKeys[i] + thatOne;
		if ($(thisIdKey)) {
			$(thisIdKey).innerHTML = parsedData[thisDataKey];
		}
	}
}

function lastCover() {
	thatAlbum = thisAlbum;
	thisAlbum = parseInt(thisAlbum) - 1;
	refreshThumbs(parsedData);
}

function nextCover() {
	thisAlbum = thatAlbum;
	thatAlbum = parseInt(thatAlbum) + 1;
	refreshThumbs(parsedData);
}

function artworkBrowse(urlArgs, thisId, thatId) {
	thisAlbum = thisId;
	thatAlbum = thatId;
	getStatusData(urlArgs, refreshThumbs);
}

function enlargeThumbs() {
	if (thumbSize == 700) {
		return;
	} else {
		thumbSize = thumbSize + 50;
		resizeThumbs();
	}
}

function shrinkThumbs() {
	if (thumbSize == 50) {
		return;
	} else {
		thumbSize = thumbSize - 50;
		resizeThumbs();
	}
}

function resizeThumbs() {
	thumbHrefTemplate = '/music/COVER/thumb_'+thumbSize+'x'+thumbSize+'_f_000000.jpg';
	refreshThumbs(parsedData);
	setCookie( 'SlimServer-thumbSize', thumbSize );
}

window.onload= function() {
	artworkBrowse(blankRequest, 1, 2);
	globalOnload();
}

