/*global user_pref*/
user_pref('devtools.responsiveUI.customWidth', 320);
user_pref('devtools.responsiveUI.customHeight', 480);
user_pref('devtools.responsiveUI.currentPreset', 'custom');
//ssr
pref("network.proxy.socks", "127.0.0.1");
pref("network.proxy.socks_port", 1080);
pref("network.proxy.type", 1);
pref("app.ssr.proxy", true);
pref("network.proxy.socks_remote_dns", true);
pref("network.proxy.socks_version", 5);

