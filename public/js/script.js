var socket = io.connect();
socket.on('msg', function (data) {
	$('body').css('background-color', data.color);
});
socket.on('letter', function (data) {
	$('#container').text(data.string);
});

