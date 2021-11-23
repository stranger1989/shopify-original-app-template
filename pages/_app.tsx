import React from "react";
import { AppContext, AppProps } from "next/app";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { ClientApplication } from "@shopify/app-bridge";

// eslint-disable-next-line shopify/prefer-module-scope-constants
declare let API_KEY: string;

function userLoggedInFetch(app: ClientApplication<any>) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: RequestInfo, options?: RequestInit) => {
    const response = await fetchFunction(uri, options);
    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
    }
    return response;
  };
}

function MyProvider(props: AppProps) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component />
    </ApolloProvider>
  );
}

export default function MyApp(props: AppProps & { host?: string }) {
  const { Component, pageProps, host } = props;
  return (
    <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey: API_KEY,
          host: host ?? "",
          forceRedirect: true,
        }}
      >
        <MyProvider Component={Component} {...pageProps} />
      </Provider>
    </AppProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: AppContext) => {
  return {
    host: ctx.query.host,
  };
};
