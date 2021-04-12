<h1 align="center">Welcome to node-magento-eqp 👋</h1>
<p>
  <a href="https://npmjs.com/package/@netresearch/node-magento-eqp">
    <img alt="Version" src="https://img.shields.io/npm/v/@netresearch/node-magento-eqp?style=for-the-badge" />
  </a>

  <a href="https://github.com/netresearch/node-magento-eqp/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/npm/l/@netresearch/node-magento-eqp.svg?style=for-the-badge" />
  </a>

  <a href="https://github.com/netresearch/node-magento-eqp/actions" target="_blank">
    <img alt="Build status" src="https://img.shields.io/github/workflow/status/netresearch/node-magento-eqp/%F0%9F%94%8E%20Lint?style=for-the-badge" />
  </a>

  <a href="https://netresearch.github.io/node-magento-eqp" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/Documentation-available-green.svg?style=for-the-badge">
  </a>

  <a href="https://twitter.com/netresearch" target="_blank">
    <img alt="Twitter: Netresearch" src="https://img.shields.io/twitter/follow/netresearch?style=for-the-badge" />
  </a>
</p>

> Simple API wrapper around the Magento Marketplace EQP API

The primary focus of this package is, to provide a simple API wrapper and typings (unfinished) around the [Magento Marketplace EQP API](https://devdocs.magento.com/marketplace/eqp/v1/api.html).

## Install

```sh
yarn install @netresearch/node-magento-eqp
```

## Usage

Usage in TypeScript (with ES Modules)

```typescript
import * as MagentoEQP from '@netresearch/node-magento-eqp';

const eqp = new MagentoEQP.EQP();

async function main() {
  await eqp.authenticate('APP_ID', 'APP_SECRET');

  const packages = await eqp.getPackages();

  // Do something with the packages
}

main();
```

Usage in JavaScript (with CommonJS)

```typescript
const MagentoEQP = require('@netresearch/node-magento-eqp');

const eqp = new MagentoEQP.EQP();

async function main() {
  await eqp.authenticate('APP_ID', 'APP_SECRET');

  const packages = await eqp.getPackages();

  // Do something with the packages
}

main();
```

## Author

👤 **TheDevMinerTV <tobigames200@gmail.com>**

- Github: [@TheDevMinerTV](https://github.com/TheDevMinerTV)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/netresearch/node-magento-eqp/issues). You can also take a look at the [contributing guide](https://github.com/netresearch/node-magento-eqp/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

---
