<h1 align="center">Welcome to node-magento-eqp 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/netresearch" target="_blank">
    <img alt="Twitter: Netresearch" src="https://img.shields.io/twitter/follow/netresearch.svg?style=social" />
  </a>
</p>

> Simple API wrapper around the Magento Marketplace EQP API

The primary focus of this package is, to provide a simple API wrapper and typings (unfinished) around the [Magento Marketplace EQP API](https://devdocs.magento.com/marketplace/eqp/v1/api.html).

## Install

```sh
yarn install
```

## Usage

```typescript
import * as MagentoEQP from 'node-magento-eqp';

const eqp = new MagentoEQP.EQP();

async function main() {
	await eqp.authenticate('APP_ID', 'APP_SECRET');

	const packages = await eqp.getPackages();
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
