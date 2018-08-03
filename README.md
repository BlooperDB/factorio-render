# factorio-render
`factorio-render` is a tool to render [Factorio](https://factorio.com) blueprints into images and videos. This library
runs both in the browser and in Node.

## Installation
```bash
# Install via NPM
npm install factorio-render

# Or, if you prefer Yarn
yarn add factorio-render
```

## Factorio Assets
Due to copyright concerns, we cannot directly distribute Factorio assets with this library. The easiest way to get
Factorio assets is by downloading Factorio through your preferred method. If you are running this in a headless
environment, steamcmd is an excellent way to automatically download the assets:

```bash
steamcmd +login <username> <password> +force_install_dir <install directory> +app_update 427520 +quit
```
