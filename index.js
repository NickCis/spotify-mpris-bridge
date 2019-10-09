var Player = require('mpris-service');

var player = Player({
	name: 'nodejs',
	identity: 'Node.js media player',
	// supportedUriSchemes: ['file'],
	// supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
	supportedInterfaces: ['player']
});

player.getPosition = function() {
  // return the position of your player
  return 0;
}

// Events
var events = ['next', 'previous', 'pause', 'playpause', 'stop', 'play'];
events.forEach(function (eventName) {
	player.on(eventName, function () {
		console.log('Event:', eventName, arguments);
	});
});
