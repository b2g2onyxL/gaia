/* global BaseIcon */
'use strict';

(function(exports) {
  var BatteryIcon = function(manager) {
    BaseIcon.call(this, manager);
  };
  BatteryIcon.prototype = Object.create(BaseIcon.prototype);
  BatteryIcon.prototype.name = 'BatteryIcon';
  BatteryIcon.prototype.update = function() {
    if (!this.element) {
      return;
    }
    this.show();
    var battery = this.manager._battery;
    var icon = this.element;
    var previousLevel = parseInt(icon.dataset.level, 10);
    var previousCharging = (icon.dataset.charging === 'true');

    icon.dataset.charging = battery.charging;
    var level = Math.floor(battery.level * 10) * 10;


    this.debug('previous level: ', previousLevel);
    this.debug('current level:', level);

    //document.getElementById('statusbar-battery-level').value = "dsfdsfdsf";

//ittat
    var levelcurrent = battery.level * 100;
 	dump("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%levelcurrent:" + levelcurrent);
	document.getElementById("statusbar-battery-level").innerHTML=levelcurrent; //levelcurrent
//end

    if (previousLevel === level &&
        previousCharging === battery.charging) {
      return;
    }

    icon.dataset.level = level;
    navigator.mozL10n.setAttributes(
      icon,
      battery.charging ? 'statusbarBatteryCharging' : 'statusbarBattery',
      {level: level}
    );
    this.previousCharging = battery.charging;
    this.publish('changed');
  };

  BatteryIcon.prototype.view = function view() {
//ittat
    var battery = this.manager._battery;
   var level = battery.level * 100;

   return `<div id="statusbar-battery"
              class="sb-icon sb-icon-battery"
              role="listitem"> </div>` +
	  `<div style="order: 1;" id="statusbar-battery-level">` + level  + `</div>`;
  };

  exports.BatteryIcon = BatteryIcon;
}(window));
