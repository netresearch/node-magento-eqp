# @netresearch/node-magento-eqp

[![npm version](https://img.shields.io/npm/v/@netresearch/node-magento-eqp?style=flat-square)](https://www.npmjs.com/package/@netresearch/node-magento-eqp)
[![CI](https://img.shields.io/github/actions/workflow/status/netresearch/node-magento-eqp/lint.and.build.yml?branch=main&style=flat-square&label=CI)](https://github.com/netresearch/node-magento-eqp/actions/workflows/lint.and.build.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/netresearch/node-magento-eqp/codeql.yml?branch=main&style=flat-square&label=CodeQL)](https://github.com/netresearch/node-magento-eqp/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/npm/l/@netresearch/node-magento-eqp?style=flat-square)](https://github.com/netresearch/node-magento-eqp/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/@netresearch/node-magento-eqp?style=flat-square)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Documentation](https://img.shields.io/badge/docs-TypeDoc-green?style=flat-square)](https://netresearch.github.io/node-magento-eqp)

TypeScript API wrapper for the [Adobe Commerce Marketplace EQP API](https://developer.adobe.com/commerce/marketplace/guides/eqp/v1/).

## Installation

```sh
yarn add @netresearch/node-magento-eqp
```

or

```sh
npm install @netresearch/node-magento-eqp
```

## Usage

### TypeScript (ES Modules)

```typescript
import { EQP } from '@netresearch/node-magento-eqp';

const eqp = new EQP({
	appId: 'YOUR_APP_ID',
	appSecret: 'YOUR_APP_SECRET',
	environment: 'sandbox' // or 'production' (default)
});

const packages = await eqp.packageService.getPackages();
```

### JavaScript (CommonJS)

```javascript
const { EQP } = require('@netresearch/node-magento-eqp');

(async () => {
	const eqp = new EQP({
		appId: 'YOUR_APP_ID',
		appSecret: 'YOUR_APP_SECRET'
	});

	const packages = await eqp.packageService.getPackages();
	console.log(packages);
})();
```

### Available services

| Service           | Description                                |
| ----------------- | ------------------------------------------ |
| `packageService`  | List and retrieve extension/theme packages |
| `fileService`     | File upload metadata                       |
| `userService`     | User profile management                    |
| `keyService`      | Magento access keys (M1/M2)                |
| `callbackService` | Webhook registration and event enrichment  |
| `reportService`   | Marketplace analytics (experimental)       |

### Constructor options

| Option        | Type                        | Default        | Description                 |
| ------------- | --------------------------- | -------------- | --------------------------- |
| `appId`       | `string`                    | _required_     | Your EQP application ID     |
| `appSecret`   | `string`                    | _required_     | Your EQP application secret |
| `environment` | `'production' \| 'sandbox'` | `'production'` | API environment             |
| `autoRefresh` | `boolean`                   | `false`        | _Reserved for future use_   |
| `expiresIn`   | `number`                    | `360`          | _Reserved for future use_   |
| `adapter`     | `Adapter`                   | `FetchAdapter` | Custom HTTP adapter         |

## API documentation

Full API documentation is available at [netresearch.github.io/node-magento-eqp](https://netresearch.github.io/node-magento-eqp).

## Related packages

- [`@netresearch/node-red-contrib-magento-eqp`](https://github.com/netresearch/node-red-contrib-magento-eqp) — Node-RED nodes for Magento EQP callbacks

## Contributing

Contributions, issues, and feature requests are welcome. See the [contributing guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) - Netresearch DTT GmbH
