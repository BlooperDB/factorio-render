# factorio-render
[![Travis Build Status](https://img.shields.io/travis/BlooperDB/factorio-render/master.svg?style=flat-square)](https://travis-ci.org/BlooperDB/factorio-render/)
[![NPM Version](https://img.shields.io/npm/v/factorio-render.svg?style=flat-square)](https://www.npmjs.com/package/factorio-render)
[![NPM Downloads](https://img.shields.io/npm/dt/factorio-render.svg?style=flat-square)](https://www.npmjs.com/package/factorio-render)
[![License](https://img.shields.io/github/license/BlooperDB/factorio-render.svg?style=flat-square)](https://github.com/BlooperDB/factorio-render/blob/master/LICENSE)

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
