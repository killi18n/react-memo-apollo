// This example uses React Router v4, although it should work
// equally well with other routers that support SSR
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import express, { Request, Response } from 'express';
import { StaticRouter, matchPath } from 'react-router';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'node-fetch';
import { Provider } from 'react-redux';
import { ServerStyleSheet } from 'styled-components';
import path from 'path';
import { Helmet } from 'react-helmet';

import App from './components/App';
import { renderToString } from 'react-dom/server';
// import Html from 'Html';
import configure from './store/configure';
import routeConfig from 'lib/routeConfig';

const manifestJson = require('../build/asset-manifest.json');

const authLink = setContext((_, { headers }) => {
    if (typeof window !== 'undefined') {
        if (!localStorage.getItem('userInfo')) {
            return {
                headers: {
                    ...headers,
                    authorization: '',
                },
            };
        }
    }

    const checkStorage =
        typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
    const token = checkStorage ? JSON.parse(checkStorage).jwt : '';
    return {
        headers: {
            ...headers,
            authorization: token,
        },
    };
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    fetch: fetch as any,
});

const wsLink =
    typeof window !== 'undefined'
        ? new WebSocketLink({
              uri: 'ws://localhost:4000/graphql',
              onDisconnected: () => {
                  console.log('not connected');
              },
              options: {
                  lazy: true,
                  reconnect: true,
                  connectionParams: () => {
                      const checkStorage =
                          typeof window !== 'undefined'
                              ? localStorage.getItem('userInfo')
                              : null;
                      return {
                          headers: {
                              Authorization: checkStorage
                                  ? JSON.parse(checkStorage).jwt
                                  : '',
                          },
                      };
                  },
              },
          })
        : '';

const link =
    typeof window !== 'undefined'
        ? split(
              // split based on operation type
              ({ query }) => {
                  const definition = getMainDefinition(query);
                  return (
                      definition.kind === 'OperationDefinition' &&
                      definition.operation === 'subscription'
                  );
              },
              wsLink as any,
              authLink.concat(httpLink)
          )
        : authLink.concat(httpLink);

const cache = new InMemoryCache();

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = express();
// console.log(path.resolve('build'));

app.use('/static', express.static(path.resolve('build')));

app.use((req: Request, res: Response) => {
    const client = new ApolloClient({
        ssrMode: true,
        // Remember that this is the interface the SSR server will use to connect to the
        // API server, so we need to ensure it isn't firewalled, etc
        link,
        cache,
    });

    const context = {};

    const sheet = new ServerStyleSheet();

    const store = configure();

    // The client-side App will instead use <BrowserRouter>
    const component = (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </Provider>
        </ApolloProvider>
    );

    const helmet = Helmet.renderStatic();

    // rendering code (see below)

    getDataFromTree(component).then(() => {
        const content = renderToString(sheet.collectStyles(component));
        const styleTags = sheet.getStyleTags();
        const initialState = client.extract();

        const jsKeys = Object.keys(manifestJson.files)
            .filter(jsKey => jsKey.match(/.js$/))
            .map(key => {
                if (key === 'service-worker.js') return;
                return `<script src="/static${
                    manifestJson.files[key]
                }"></script>`;
            })
            .join('\n\t\t');

        const cssKeys = Object.keys(manifestJson.files)
            .filter(cssKey => cssKey.match(/.css$/))
            .map(key => {
                return `<link href="/static${
                    manifestJson.files[key]
                }" rel="stylesheet">`;
            })
            .join('\n\t\t');

        let matched = false;

        routeConfig.forEach(route => {
            if (matchPath(req.path, route)) {
                matched = true;
            }
        });

        if (!matched) {
            res.status(404);
        } else {
            res.status(200);
        }

        res.send(
            `
                <!DOCTYPE html>
                <html>
                    ${styleTags}
                    ${cssKeys}
                    ${helmet.title.toString()}
                    <link rel="shortcut icon" href="/static/favicon.ico"/>
                    <body>
                    <noscript>You need to enable JavaScript to run this app.</noscript>
                    <div id="root">${content}</div>
                        <script>
                            window.__APOLLO_STATE__=${JSON.stringify(
                                initialState
                            ).replace(/</g, '\\u003c')}
                        </script>
                        ${jsKeys}
                    </body>
                </html>
            `
        );
        res.end();
    });
});

app.listen(5000, () =>
    console.log(`app Server is now running on http://localhost:${5000}`)
);
