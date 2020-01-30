function Chatgroup(name, message, timestamp, image, icon) {
	this.name = name;
	this.message = message;
	this.timestamp = timestamp;
	this.image = image;
	this.icon = icon;
}

function getChatsFromDocument() {
	var chatArray = [];
	var htmlElements = document.getElementById('content-list').getElementsByClassName('contact');

	for(var i=0; i<htmlElements.length; i++) {
		var name = htmlElements[i].getElementsByTagName('p')[0].innerHTML;
		var message = htmlElements[i].getElementsByTagName('p')[1].innerHTML;
		var timestamp = htmlElements[i].getElementsByTagName('p')[2].innerHTML;
		var image = htmlElements[i].getElementsByTagName('img')[0].getAttribute('src');
		var icon = htmlElements[i].getElementsByTagName('span')[0].className.substring(12);

		chatArray.push(new Chatgroup(name, message, timestamp, image, icon));
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
		chatListHtml += '<img class="cht-grp-img" src="'+ c[i].image +'"/>' + "\n";
		chatListHtml += '<p class="cht-grp-nam">'+ c[i].name +'</p>' + "\n";
		chatListHtml += '<p class="cht-grp-msg">'+ c[i].message +'</p>' + "\n";
		chatListHtml += '<span class="cht-grp-icn '+ c[i].icon +'"><p class="cht-grp-tst">'+ c[i].timestamp +'</p></span>' + "\n";
		chatListHtml += '</a></li>' + "\n";
	}

	document.getElementById('content-list').innerHTML = chatListHtml;
}

window.onload = function() {
	if(location.pathname.split('/').pop() == 'index.html') {
		var hc = document.getElementById('header-cluster');
		hc.removeAttribute('href');		
	}
	displayChats(getChatsFromDocument());
	document.getElementById('content-list').style.opacity = '1';
}