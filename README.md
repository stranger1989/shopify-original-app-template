# Shopify Original App Template

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

My Original Boilerplate to create an embedded Shopify app made with Node & typescript, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) where you can install and test your app.
- In the Partner dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app). You’ll need this app’s API credentials during the setup process.

## Usage
via shopify cli

login development store
```shell
shopify login --store <DOMAIN>
```

launch server
```shell
shopify app serve
```
## License

This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
