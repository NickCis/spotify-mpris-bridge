# Spotify MPRIS Bridge

The idea of this extension is to provide a bridge between the [MPRIS](https://specifications.freedesktop.org/mpris-spec/2.2/) interface and the Spotify Web Player.

This project takes much inspiration (and code) from [Spotify Web Player Hotkeys Firefox Extension](https://github.com/TsunDoge/spotify-hotkeys-firefox/)

## Install

1. Install mpris bridge server:
```
cd /opt/
git clone https://github.com/NickCis/spotify-mpris-bridge
cd spotify-mpris-bridge
yarn install
cp spotify-mpris-bridge.service ~/.config/systemd/user/
systemctl --user enable spotify-mpris-bridge.service
systemctl --user start spotify-mpris-bridge.service
```
2. Download last packaged addon from [releases](https://github.com/NickCis/spotify-mpris-bridge/releases).
3. [Install signed addon](https://extensionworkshop.com/documentation/publish/distribute-sideloading/).

## Developing

[Install extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing):
1. Open [`about:debugging`](about:debugging)
2. This Firefox (from left bar)
3. Load Temporary Add-on: Select the manifest from this file

## Packaging

[See Packaging article](https://extensionworkshop.com/documentation/publish/package-your-extension/)

Run `yarn build` to get the zip file. Then, it has to be signed in [Firefox Addon Page](https://addons.mozilla.org/es/developers/addons)
