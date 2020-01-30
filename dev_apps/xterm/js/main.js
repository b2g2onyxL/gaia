'use strict';

window.addEventListener('load', function() {
    dump('############################################!!!!!###################\n');
        var terminalContainer = document.getElementById('terminal-container');
    dump('@!#$###############################################################\n');

	var term = new Terminal({ cursorBlink: true, rows:45 });
        term.open(terminalContainer);
        //term.fit();
	
	term.write('\r\n*** Open***\r\n');
        //var socket = io.connect();
	 var socket = io('http://127.0.0.1:8001');        
	socket.on('connect', function() {
          term.write('\r\n*** Connected to backend***\r\n');

          // Browser -> Backend
          term.on('data', function(data) {
            socket.emit('data', data);
          });

          // Backend -> Browser
          socket.on('data', function(data) {
            term.write(data);
          });

          socket.on('disconnect', function() {
            term.write('\r\n*** Disconnected from backend***\r\n');
          });
        });

    dump('12312432###############################################################\n');
});

