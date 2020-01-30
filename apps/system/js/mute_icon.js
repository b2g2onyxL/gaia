/* global BaseIcon */
'use strict';

(function(exports) {
  var MuteIcon = function(manager) {
    BaseIcon.call(this, manager);
  };
  MuteIcon.prototype = Object.create(BaseIcon.prototype);
  MuteIcon.prototype.name = 'MuteIcon';
  MuteIcon.prototype.update = function() {
    if (!this.element || !this.enabled()) {
      return;
    }
    var muteState = this.manager.vibrationEnabled ? 'vibration' : 'mute';
    this.element.classList.toggle('vibration', muteState === 'vibration');
    this.updateLabel(muteState);
    this.manager.currentVolume.notification === 0 ?
      this.show() : this.hide();
  };

  MuteIcon.prototype.view = function view() {
    return `<div id="statusbar-mute"
              class="sb-icon sb-icon-mute"
              hidden role="listitem">
            </div>`;
  };

  exports.MuteIcon = MuteIcon;
}(window));
