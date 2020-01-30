// Contact prototype
function Contact(name, status, image) {
	this.name = name;
	this.status = status;
	this.image = image;
}

function getContacts() {
	var contactArray = [];
	// <li> elements array
	var ulist = document.getElementById('u-list');
	var list = ulist.getElementsByClassName('contact');

	// Contact extraction and creation
	for(var i=0; i<list.length; i++) {
		var name = list[i].getElementsByTagName('p')[0].innerHTML;
		var status = list[i].getElementsByTagName('p')[1].innerHTML;
		var image = list[i].getElementsByTagName('img')[0].getAttribute('src');

		var contact = new Contact(name, status, image);
		//console.log('Name: '+ contact.name +'\nStatus: '+ contact.status +'\nImage: '+ contact.image);
		contactArray.push(contact);
	}

	contactArray.sort(function(a, b) {
		var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
		if (nameA < nameB) //sort string ascending
			return -1
		if (nameA > nameB)
			return 1
		return 0 //default return value (no sorting)
	});

	return contactArray;
}

function getDividers(contacts) {
	var firstLetter;
	var contactDividers = {};

	for(var i=0; i<contacts.length; i++) {
		firstLetter = contacts[i].name.charAt(0).toUpperCase();

		if(!contactDividers[firstLetter]) {
			contactDividers[firstLetter] = [];
		}

		contactDividers[firstLetter].push(contacts[i]);
	}
	//console.log(contactDividers);

	return contactDividers;
}

function updateList(objectList) {
	var listHtml = "";

	for(var prop in objectList) {
		listHtml += '<li class="divider"><h3>'+ prop +'</h3></li>';
		var array = objectList[prop];
		for(var i=0; i<array.length; i++) {
			listHtml += '<li class="contact"><a href="#"><img src="'+ array[i].image +'" class="cht-grp-img"/><p class="cht-grp-nam">'+ array[i].name +'</p><p class="cht-grp-msg">'+ array[i].status +'</p></a></li>';
		}
	}

	document.getElementsByTagName('ul')[0].innerHTML = listHtml;
}

function fixBorder() {
	var as = document.getElementsByTagName('li');

	for (var i=0; i<as.length; i++){
		var previous;
		if (as[i].className == 'divider' && as[i].previousSibling != null && as[i].previousSibling.className == 'contact') {
			previous = as[i].previousSibling;
			previous.style.border = 'none';
		}
	}
}

window.onload = function() {
	var contacts = getContacts();
	contacts = getDividers(contacts);

	updateList(contacts);
	fixBorder();
	document.getElementById('u-list').className = 'visible';
};