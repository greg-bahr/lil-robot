const socket = require('socket.io-client')(location.host);

$(document).ready(function() {

    $("#forward").on('touchstart mousedown', function() {
	socket.emit('drive', { direction: 'forward' });
	$(this).css({color: 'white', background: '#aaa'});
    });

    $(".button").on('touchend mouseup', function() {
	socket.emit('drive', { direction: 'stop' });
	$(this).css({color: 'black', background: '#ccc'});
    });

    $("#backwards").on('touchstart mousedown', function() {
        socket.emit('drive', { direction: 'backward' });
	$(this).css({color: 'white', background: '#aaa'});
    });

    $("#left").on('touchstart mousedown', function() {
        socket.emit('drive', { direction: 'left' });
	$(this).css({color: 'white', background: '#aaa'});
    });

    $("#right").on('touchstart mousedown', function() {
        socket.emit('drive', { direction: 'right' });
	$(this).css({color: 'white', background: '#aaa'});
    });

    $(document).keydown((e) => {
	switch(e.which) {
	    case 37: // left
		$('#left').trigger('mousedown');
	        break;
	    case 38: // up
		$('#forward').trigger('mousedown');
		break;
	    case 39: // right
		$('#right').trigger('mousedown');
		break;
	    case 40: // down
		$('#backwards').trigger('mousedown');
		break;
	    default: return;
	}
	e.preventDefault();
    });

    $(document).keyup((e) => {
	switch(e.which) {
	    case 37:
	    case 38:
	    case 39:
	    case 40:
		$('.button').trigger('mouseup');
		break;
	    default: return;
	}
	e.preventDefault();
    });
    var canvas = document.getElementById('canvas');
    var url = 'ws://'+document.location.hostname+':8082/';
    var player = new JSMpeg.Player(url, {canvas: canvas});
});
