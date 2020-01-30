/* global MockAppWindow, MockNavigatorSettings, LazyLoader */
(function() {
'use strict';

requireApp('system/test/unit/mock_app_window.js');
requireApp('system/test/unit/mock_system_dialog.js');
requireApp('system/test/unit/mock_tracking_notice.js');
requireApp('system/test/unit/mock_system_simcard_dialog.js');
require('/shared/test/unit/mocks/mock_navigator_moz_settings.js');
require('/shared/test/unit/mocks/mock_lazy_loader.js');
requireApp('system/js/system_dialog_manager.js');
requireApp('system/js/service.js');

var mocksForSystemDialogManager = new window.MocksHelper([
  'SystemDialog',
  'SimPinSystemDialog',
  'LazyLoader',
  'TrackingNotice'
]).init();

suite('system/SystemDialogManager', function() {
  mocksForSystemDialogManager.attachTestHelpers();
  var realMozSettings;
  var dialogFake,
      optionsFake = {
        onShow: function() {},
        onHide: function() {}
      }, mozChromeEventFake = {
        type: 'mozChromeEvent',
        detail: {
          type: 'inputmethod-contextchange',
          inputType: 'date'
        }
      };

  suiteSetup(function() {
    realMozSettings = navigator.mozSettings;
    navigator.mozSettings = MockNavigatorSettings;
  });

  suiteTeardown(function() {
    navigator.mozSettings = realMozSettings;
  });

  setup(function() {
    MockNavigatorSettings.mSetup();
    MockNavigatorSettings.mSyncRepliesOnly = true;
    this.sinon.stub(document, 'getElementById').returns(
      document.createElement('div'));

    dialogFake = new window.SystemDialog(optionsFake);
    window.systemDialogManager = new window.SystemDialogManager();
    window.systemDialogManager.start();
    this.sinon.stub(dialogFake, 'resize');
  });

  teardown(function() {
    MockNavigatorSettings.mTeardown();
    window.systemDialogManager.states.activeDialog = null;
  });

  suite('Should change fullscreen state when appWindow opened', function() {
    var app;

    setup(function() {
      app = new MockAppWindow();
      this.sinon.stub(app, 'getTopMostWindow').returns(app);
    });

    test('Launch a non-fullscreen app', function() {
      this.sinon.stub(app, 'isFullScreen').returns(false);
      var event = new CustomEvent('hierarchytopmostwindowchanged', {
        detail: app
      });
      window.dispatchEvent(event);
      assert.isFalse(window.systemDialogManager.elements.containerElement
                    .classList.contains('fullscreen'));
    });

    test('Launch a fullscreen app', function() {
      this.sinon.stub(app, 'isFullScreen').returns(true);
      window.systemDialogManager.states.activeDialog = dialogFake;
      var event = new CustomEvent('hierarchytopmostwindowchanged', {
        detail: app
      });
      window.dispatchEvent(event);
      assert.isTrue(window.systemDialogManager.elements.containerElement
                    .classList.contains('fullscreen'));
      assert.isTrue(dialogFake.resize.called);
    });
  });

  suite('Tracking Notice', function() {
    const TRACKING_NOTICE_KEY = 'privacy.trackingprotection.shown';
    setup(function() {
      this.sinon.stub(LazyLoader, 'load');
    });

    test('it includes tracking notice code if not already shown', function() {
      var settingObj = {};
      settingObj[TRACKING_NOTICE_KEY] = false;
      navigator.mozSettings.mSet(settingObj);
      window.systemDialogManager._initTrackingNotice();
      navigator.mozSettings.mReplyToRequests();
      assert.isTrue(LazyLoader.load.called);
    });

    test('it does not include tracking notice if already shown', function() {
      var settingObj = {};
      settingObj[TRACKING_NOTICE_KEY] = true;
      navigator.mozSettings.mSet(settingObj);
      window.systemDialogManager._initTrackingNotice();
      assert.isFalse(LazyLoader.load.called);
    });
  });

  suite('Hierarchy functions', function() {
    test('setHierarchy', function() {
      this.sinon.stub(dialogFake, '_setVisibleForScreenReader');
      window.systemDialogManager.activateDialog(dialogFake);
      window.systemDialogManager.setHierarchy(true);
      assert.isTrue(dialogFake._setVisibleForScreenReader.calledWith(true));

      window.systemDialogManager.setHierarchy(false);
      assert.isTrue(dialogFake._setVisibleForScreenReader.calledWith(false));
    });

    test('setFocus', function() {
      this.sinon.stub(dialogFake, 'focus');
      window.systemDialogManager.activateDialog(dialogFake);
      assert.isTrue(window.systemDialogManager.setFocus(true));
      assert.isTrue(dialogFake.focus.called);
    });

    test('Should be inactive', function() {
      assert.isFalse(window.systemDialogManager.isActive());
    });

    test('Should be active', function() {
      window.systemDialogManager.states.activeDialog = dialogFake;
      assert.isTrue(window.systemDialogManager.isActive());
    });

    test('Should publish activated when activateDialog is called',
      function() {
        this.sinon.stub(window.systemDialogManager, 'publish');
        window.systemDialogManager.activateDialog(dialogFake);
        assert.isTrue(
          window.systemDialogManager.publish.calledWith('-activated'));
      });

    test('Should publish deactivated when deactivateDialog is called',
      function() {
        window.systemDialogManager.activateDialog(dialogFake);
        this.sinon.stub(window.systemDialogManager, 'publish');
        window.systemDialogManager.deactivateDialog(dialogFake);
        assert.isTrue(
          window.systemDialogManager.publish.calledWith('-deactivated'));
      });
  });

  suite('Handle events', function() {
    test('Dialog created', function() {
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      assert.isNull(window.systemDialogManager.states.activeDialog,
        'the dialog should not be activated');
      assert.isFalse(window.systemDialogManager.setFocus(true));
      var createdDialog =
      window.systemDialogManager.states.runningDialogs[dialogFake.instanceID];
      window.assert.isObject(createdDialog,
        'the dialog was not registered in the maanger');
    });

    test('Dialog stopped', function() {
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-stopped',
        detail: dialogFake});
      assert.isNull(window.systemDialogManager.states.activeDialog,
        'the dialog was not deactivated from the manager');
      assert.isUndefined(
        window.systemDialogManager.states.runningDialogs[dialogFake.instanceID],
        'the dialog was not unregistered from the manager');
    });

    test('Dialog request show', function() {
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      assert.isNotNull(window.systemDialogManager.states.activeDialog,
        'the dialog should be activated');
      var isContainDialog =
        window.systemDialogManager.elements.screen.classList.contains('dialog');
      assert.isTrue(isContainDialog,
        'the "dialog" was not in screen stylesheet after activated a dialog');
    });

    test('Dialog request hide', function() {
      var stubOnHide = this.sinon.stub(dialogFake, 'onHide');
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-hide',
        detail: dialogFake});
      assert.isFalse(stubOnHide.called,
        'the dialog "onHide" should not be called after it fired the request');
      var isContainDialog =
        window.systemDialogManager.elements.screen.classList.contains('dialog');
      assert.isFalse(isContainDialog,
        'the "dialog" was in screen stylesheet after deactivated a dialog');
      stubOnHide.restore();
    });

    test('Resize dialog while received "system-resize" event', function() {
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      window.systemDialogManager.respondToHierarchyEvent(
        new CustomEvent('system-resize'));
      assert.isTrue(dialogFake.resize.called,
        'the dialog was not "resize" after received "system-resize" event');
      var isContainDialog =
        window.systemDialogManager.elements.screen.classList.contains('dialog');
      assert.isTrue(isContainDialog,
        'the "dialog" was not in screen stylesheet after resize a dialog');
    });

    test('Deactivate dialog while received ' +
         '"home" or "holdhome" event', function() {
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      var spyDeactivateDialog =
        this.sinon.spy(window.systemDialogManager, 'deactivateDialog');
      var stubOnHide = this.sinon.stub(dialogFake, 'onHide');
      var spyHide =
        this.sinon.spy(window.systemDialogManager.states.activeDialog, 'hide');
      window.systemDialogManager.respondToHierarchyEvent({type: 'home'});
      assert.isTrue(spyDeactivateDialog.called,
        'the "deactivateDialog" should be called after received "home" event');
      assert.isTrue(spyHide.called,
        'the dialog was not called "hide" after received "home" event');
      assert.isTrue(stubOnHide.calledWith('home'),
        'the dialog was not "onHide" after received "home" event');
      var isContainDialog =
        window.systemDialogManager.elements.screen.classList.contains('dialog');
      assert.isFalse(isContainDialog,
        'the "dialog" was in screen stylesheet after deactivated a dialog');
      assert.isNull(window.systemDialogManager.states.activeDialog,
        'the active dialog is not null ' +
        'after its be deactivate via "home"/"holdhome" events');
      spyDeactivateDialog.restore();
      stubOnHide.restore();
    });

    test('A dialog is active, ' +
         'then another dialog create and request show', function() {
      var stubOnHide = this.sinon.stub(dialogFake, 'onHide');
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      var simPinSystemDialogFake = new window.SimPinSystemDialog(optionsFake);
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: simPinSystemDialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: simPinSystemDialogFake});
      // Check fake dialog (first dialog)
      var createdFirstDialog =
      window.systemDialogManager.states.runningDialogs[dialogFake.instanceID];
      window.assert.isObject(createdFirstDialog,
        'the first dialog was not registered in the maanger');
      assert.isTrue(stubOnHide.called,
        'the first dialog was not "onHide" ' +
        'after received second dialog show request');

      // Check fake simpin dialog (second dialog)
      var createdSecondDialog =
      window.systemDialogManager.states.runningDialogs[
        simPinSystemDialogFake.instanceID];
      window.assert.isObject(createdSecondDialog,
        'the second dialog was not registered in the maanger');
      // Check "dialog" style is in screen stylesheet
      // after two dialogs reaquest show event
      var isContainDialog =
        window.systemDialogManager.elements.screen.classList.contains('dialog');
      assert.isTrue(isContainDialog,
        'the "dialog" was not in screen stylesheet after activated a dialog');
      stubOnHide.restore();
    });

    test('valid mozChromeEvent', function() {
      var stubBroadcast = this.sinon.stub(dialogFake, 'broadcast');
      window.systemDialogManager.handleEvent({type: 'system-dialog-started',
        detail: dialogFake});
      window.systemDialogManager.handleEvent({type: 'system-dialog-show',
        detail: dialogFake});
      window.systemDialogManager.respondToHierarchyEvent(mozChromeEventFake);
      assert.isTrue(stubBroadcast.called, 'broadcast was called for an ' +
        'active dialog');
      assert.isTrue(stubBroadcast.calledWith('inputmethod-contextchange',
        mozChromeEventFake.detail), 'broadcast arguments are correct');
    });
  });
});

})();

