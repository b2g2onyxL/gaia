function keepFocus() {
	document.getElementById('search-input').focus();
	inputFilter('');
}

function showBar() {
	document.getElementById('search-btn').style.display = 'none';
	document.getElementById('h-title').style.visibility = 'hidden';
	document.getElementById('h-title').style.width = '0px';
	document.getElementById('search-form').style.display = 'inline-block';
	
	if(location.pathname.split('/').pop() == 'contacts.html') {
		document.getElementById('header-cluster').setAttribute('href','contacts.html');
		document.getElementById('search-form').style.width = '23rem';
	} else {
		document.getElementById('back-b').style.display = 'inline-block';
		document.getElementById('header-cluster').setAttribute('href','index.html');
		document.getElementById('search-form').style.width = '14rem';
	}
	keepFocus();
}

function inputFilter(val) {
	var contacts = document.getElementsByClassName('contact');
	var regex = new RegExp(val,'gi');

	for(var i=0; i<contacts.length; i++) {
		var name = contacts[i].getElementsByClassName('cht-grp-nam')[0].innerHTML;
		if(regex.test(name)) {
			contacts[i].style.display = 'block';
		} else {
			contacts[i].style.display = 'none';
		}
	}
}