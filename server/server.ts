import '@babel/polyfill';
import 'isomorphic-fetch';
import fs from 'fs';

import dotenv from 'dotenv';
import Koa from 'koa';
import next from 'next';
import Router from 'koa-router';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';
import { Session } from '@shopify/shopify-api/dist/auth/session';

import routes from './router/index';
import { updateTheme } from './updateTheme/updateTheme';

dotenv.config();
const port = parseInt(process.env.PORT ?? '', 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const FILENAME = './session.json';

const storeCallback = async (session: Session) => {
  fs.writeFileSync(FILENAME, JSON.stringify(session));
  return true;
};

const loadCallback = async (id: string) => {
  if (fs.existsSync(FILENAME)) {
    const sessionResult = fs.readFileSync(FILENAME, 'utf8');
    return { ...new Session(id), ...JSON.parse(sessionResult) };
  }
  return undefined;
};

const deleteCallback = async () => false;

const sessionStorage = new Shopify.Session.CustomSessionStorage(
  storeCallback,
  loadCallback,
  deleteCallback,
);

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY ?? '',
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET ?? '',
  SCOPES: process.env.SCOPES?.split(',') ?? [],
  HOST_NAME: process.env.HOSTLT?.replace(/https:\/\//, '') ?? '',
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: sessionStorage,
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS: Record<string, any> = {};
(async () => {
  const session = await loadCallback('');
  if (session?.shop && session?.scope) {
    ACTIVE_SHOPIFY_SHOPS[session?.shop] = session?.scope;
  }
})();

// eslint-disable-next-line promise/catch-or-return
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;
        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: '/webhooks',
          topic: 'APP_UNINSTALLED',
          webhookHandler: async (topic, shop, body) =>
            shop &&
            ACTIVE_SHOPIFY_SHOPS[shop] &&
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });
        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`,
          );
        }
        console.log('Start updating theme');
        updateTheme(shop, accessToken);
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    }),
  );

  const handleRequest = async (ctx: Koa.Context) => {
    await handle(ctx.req, ctx.res);
    ctx!.respond = false;
    ctx!.res.statusCode = 200;
  };

  router.post('/webhooks', async (ctx: Koa.Context) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    '/graphql',
    verifyRequest({ returnHeader: true }),
    async (ctx: Koa.Context) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    },
  );

  const injectSession = async (ctx: Koa.Context, next: Koa.Next) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    ctx!.sessionFromToken = session;
    if (session?.shop && session?.accessToken) {
      const client = new Shopify.Clients.Rest(
        session.shop,
        session.accessToken,
      );
      ctx!.myClient = client;
    }
    return next();
  };
  server.use(injectSession);
  server.use(routes());
  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);
  router.get('(.*)', async (ctx) => {
    const shop = (() => {
      const { shop } = ctx.query;
      if (!shop) return undefined;
      if (typeof shop === 'string') return shop;
      return shop[0];
    })();

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (!shop || ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
