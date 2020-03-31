# Jest Config

[![Travis](https://img.shields.io/travis/com/eliasnorrby/jest-config?style=for-the-badge)](https://travis-ci.com/eliasnorrby/jest-config)
[![npm](https://img.shields.io/npm/v/@eliasnorrby/jest-config?style=for-the-badge)](https://www.npmjs.com/package/@eliasnorrby/jest-config)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=eliasnorrby/jest-config)](https://dependabot.com)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Jest config for TypeScript. The setup script provides a one-liner to get Jest
set up in your project.

# Setup

## Using `npx`

Run the following command to install and configure jest

```sh
npx @eliasnorrby/jest-config
```

This will run a setup script, adding this package to `devDependencies` and writing
the config to `jest.config.js`.

### `--no-install`

Run setup with the `--no-install` flag to avoid installing this package as a
dependency. Your `jest.config.js` will contain a basic configuration for you to
add to instead of extending this package.

## Manually

Install the package

```sh
npm i -D @eliasnorrby/jest-config
```

and add the configuration to `jest.config.js`.

### `jest.config.js`

```js
module.exports = require('@eliasnorrby/jest-config')
```

# Overriding settings

```js
module.exports = {
  ...require('@eliasnorrby/jest-config'),
  // Add options here
  roots: ['.'],
}
```
