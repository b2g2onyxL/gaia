/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

window.addEventListener('load', function() {
    dump('############################################!!!!!###################\n');
  var test = window.navigator.mozTestapi
    dump('@!#$###############################################################\n');
  test.setTestData();
  document.getElementById('test1').value =   test.vl;
  document.getElementById('test2').value =   test.returnBoolean(false);
  document.getElementById('test3').value =   test.exec("uname");
    dump('12312432###############################################################\n');
});

window.onload = function() {
  var testo = window.navigator.mozTestapi
  document.getElementById('doit').onclick = function() {
  var cmd = document.getElementById('test4').value;
  document.getElementById('test3').value =   testo.exec(cmd);
 };
};


