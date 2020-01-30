'use strict';

function log(vule) {
 // document.getElementById('logcat').innerHTML = vule;
	console.log(vule);
}

function reflashall(socket) {
  return new Promise(function (resolve, reject) {
    //-------------------------------------------------------------
    socket.emit('SSRIsOn');
    socket.on('SSRIsOn-reply', function (data) {
	if(data == "yes"){
		SsrOn();
	}else {
		SsrOff();
	}
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.server.get');
    socket.on('SSR.Conf.server.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('server').value = 'Unknown'
      }
      document.getElementById('server').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.server_port.get');
    socket.on('SSR.Conf.server_port.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('server_port').value = 'Unknown'
      }
      document.getElementById('server_port').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.local_port.get');
    socket.on('SSR.Conf.local_port.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('local_port').value = 'Unknown'
      }
      document.getElementById('local_port').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.password.get');
    socket.on('SSR.Conf.password.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('password').value = 'Unknown'
      }
      document.getElementById('password').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.method.get');
    socket.on('SSR.Conf.method.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('method').value = 'Unknown'
      }
      document.getElementById('method').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.timeout.get');
    socket.on('SSR.Conf.timeout.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('timeout').value = 'Unknown'
      }
      document.getElementById('timeout').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.protocol.get');
    socket.on('SSR.Conf.protocol.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('protocol').value = 'Unknown'
      }
      document.getElementById('protocol').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.obfs.get');
    socket.on('SSR.Conf.obfs.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('obfs').value = 'Unknown'
      }
      document.getElementById('obfs').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.obfs_param.get');
    socket.on('SSR.Conf.obfs_param.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('obfs_param').value = 'Unknown'
      }
      document.getElementById('obfs_param').value = data;
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    socket.emit('SSR.Conf.protocol_param.get');
    socket.on('SSR.Conf.protocol_param.get-reply', function (data) {
      if (data == 'no') {
        document.getElementById('protocol_param').value = 'Unknown'
      }
      document.getElementById('protocol_param').value = data;
    });
    //-------------------------------------------------------------
    resolve(true);
  })
}


function reflashstatus(socket) {
  return new Promise(function (resolve, reject) {
    //-------------------------------------------------------------
    //log('reflashstatus');
    socket.emit('SSRIsOn');
    socket.on('SSRIsOn-reply', function (data) {
      console.log('reflashstatus' + data);
	if(data == "yes"){
		SsrOn();
	}else {
		SsrOff();
	}
      resolve(data);
    });
  })
}


function SsrOn(){
    	document.getElementById('ssr-start').style.display = 'none';
     // document.getElementById('h-title').style.visibility = 'hidden';
      document.getElementById('h-title').innerHTML = 'Online';
      document.getElementById('ssr-stop').style.display = 'inline-block';
}

function SsrOff(){
      document.getElementById('ssr-start').style.display = 'inline-block';
    //  document.getElementById('h-title').style.visibility = 'visible';
      document.getElementById('h-title').innerHTML = 'SSR';
      document.getElementById('ssr-stop').style.display = 'none';
}

function ssr() {
  if( document.getElementById('ssr-start').style.display == 'inline-block' || document.getElementById('ssr-stop').style.display == 'none' ){
    	document.getElementById('ssr-start').style.display = 'none';
     // document.getElementById('h-title').style.visibility = 'hidden';
      document.getElementById('h-title').innerHTML = 'Online';
      document.getElementById('ssr-stop').style.display = 'inline-block';
  }else{
      document.getElementById('ssr-start').style.display = 'inline-block';
    //  document.getElementById('h-title').style.visibility = 'visible';
      document.getElementById('h-title').innerHTML = 'SSR';
      document.getElementById('ssr-stop').style.display = 'none';
  }
}


function reflash(){


}

function Chatgroup(name, message) {
	this.name = name;
	this.message = message;
}

function getChatsFromDocument() {
	var chatArray = [];
	var htmlElements = document.getElementById('content-list').getElementsByClassName('contact');

	for(var i=0; i<htmlElements.length; i++) {
		var name = htmlElements[i].getElementsByTagName('p')[0].innerHTML;
		var message = htmlElements[i].getElementsByTagName('p')[1].innerHTML;
		//var timestamp = htmlElements[i].getElementsByTagName('p')[2].innerHTML;
		//var image = htmlElements[i].getElementsByTagName('img')[0].getAttribute('src');
		//var icon = htmlElements[i].getElementsByTagName('span')[0].className.substring(12);

		chatArray.push(new Chatgroup(name, message));
	}

	chatArray.sort(function(a, b) {
		var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
		if (nameA < nameB) //sort string ascending
			return -1
		if (nameA > nameB)
			return 1
		return 0 //default return value (no sorting)
	});

	return chatArray;
}

function displayChats(c) {
	var chatListHtml = "";

	for(var i in c) {
		chatListHtml += '<li class="contact"><a href="#">' + "\n";
		//chatListHtml += '<img class="cht-grp-img" src="'+ c[i].image +'"/>' + "\n";
		chatListHtml += '<p class="cht-grp-nam">'+ c[i].name +'</p>' + "\n";
		chatListHtml += '<p class="cht-grp-msg">'+ c[i].message +'</p>' + "\n";
		//chatListHtml += '<span class="cht-grp-icn '+ c[i].icon +'"><p class="cht-grp-tst">'+ c[i].timestamp +'</p></span>' + "\n";
		chatListHtml += '</a></li>' + "\n";
	}

	document.getElementById('content-list').innerHTML = chatListHtml;
}


function connect(){
  var socket = io('http://127.0.0.1:8003');
	log('connect enter');
  socket.on('connect', function () {
    log('\r\n*** Connected to backend***\r\n');
    reflashall(socket);
    $('#reflash-btn').click(function ()
    {
      log('reflash click');
      reflashall(socket).then(data => {
      });
    });
    $('#start-btn').click(function ()
    {
      log('onoff click');
      socket.emit('SSRIsOn');
      reflashstatus(socket).then(data => {
        console.log(data);
        if (data == 'no') {
          socket.emit('SSROn');
        } else if (data == 'yes') {
          socket.emit('SSROff')
        }
      setTimeout(function (){
    	  reflashstatus(socket);
      }, 200);
        
      });
    });
    //-------------------------------------------------------------
    $('#server').blur(function ()
    {
      log('server blur');
      socket.emit('SSR.Conf.server.set', document.getElementById('server').value);
    });
    socket.on('SSR.Conf.server.get-reply', function (data) {
      log('SSR.Conf.server.get-reply' + data);
      if (data == 'no') {
        document.getElementById('server').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#server_port').blur(function ()
    {
      log('server_port blur');
      socket.emit('SSR.Conf.server_port.set', Number(document.getElementById('server_port').value));
    });
    socket.on('SSR.Conf.server_port.get-reply', function (data) {
      log('SSR.Conf.server_port.get-reply' + data);
      if (data == 'no') {
        document.getElementById('server_port').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#local_port').blur(function ()
    {
      log('local_port blur');
      socket.emit('SSR.Conf.local_port.set', Number(document.getElementById('local_port').value));
    });
    socket.on('SSR.Conf.local_port.get-reply', function (data) {
      log('SSR.Conf.local_port.get-reply' + data);
      if (data == 'no') {
        document.getElementById('local_port').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#password').blur(function ()
    {
      log('password blur');
      socket.emit('SSR.Conf.password.set', document.getElementById('password').value);
    });
    socket.on('SSR.Conf.password.get-reply', function (data) {
      log('SSR.Conf.password.get-reply' + data);
      if (data == 'no') {
        document.getElementById('password').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#method').blur(function ()
    {
      log('method blur');
      socket.emit('SSR.Conf.method.set', document.getElementById('method').value);
    });
    socket.on('SSR.Conf.method.get-reply', function (data) {
      log('SSR.Conf.method.get-reply' + data);
      if (data == 'no') {
        document.getElementById('method').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#timeout').blur(function ()
    {
      log('timeout blur');
      socket.emit('SSR.Conf.timeout.set', Number(document.getElementById('timeout').value));
    });
    socket.on('SSR.Conf.timeout.get-reply', function (data) {
      log('SSR.Conf.timeout.get-reply' + data);
      if (data == 'no') {
        document.getElementById('timeout').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#protocol').blur(function ()
    {
      log('protocol blur');
      socket.emit('SSR.Conf.protocol.set', document.getElementById('protocol').value);
    });
    socket.on('SSR.Conf.protocol.get-reply', function (data) {
      log('SSR.Conf.protocol.get-reply' + data);
      if (data == 'no') {
        document.getElementById('protocol').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#obfs').blur(function ()
    {
      log('obfs blur');
      socket.emit('SSR.Conf.obfs.set', document.getElementById('obfs').value);
    });
    socket.on('SSR.Conf.obfs.get-reply', function (data) {
      log('SSR.Conf.obfs.get-reply' + data);
      if (data == 'no') {
        document.getElementById('obfs').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#obfs_param').blur(function ()
    {
      log('obfs_param blur');
      socket.emit('SSR.Conf.obfs_param.set', document.getElementById('obfs_param').value);
    });
    socket.on('SSR.Conf.obfs_param.get-reply', function (data) {
      log('SSR.Conf.obfs_param.get-reply' + data);
      if (data == 'no') {
        document.getElementById('obfs_param').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    $('#protocol_param').blur(function ()
    {
      log('protocol_param blur');
      socket.emit('SSR.Conf.protocol_param.set', document.getElementById('protocol_param').value);
    });
    socket.on('SSR.Conf.protocol_param.get-reply', function (data) {
      log('SSR.Conf.protocol_param.get-reply' + data);
      if (data == 'no') {
        document.getElementById('protocol_param').value = 'Unknown'
      }
    });
    //-------------------------------------------------------------
  });

}

window.onload = function() {
	document.getElementById('h-title').innerHTML = 'SSR';
	if(location.pathname.split('/').pop() == 'index.html') {
		var hc = document.getElementById('header-cluster');
		hc.removeAttribute('href');		
	}
	displayChats(getChatsFromDocument());
	document.getElementById('content-list').style.opacity = '1';
	connect();
}
