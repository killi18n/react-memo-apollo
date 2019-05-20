import React from 'react';
import ReactDOM from 'react-dom/server';
import {
    ApolloProvider,
    getDataFromTree,
    renderToStringWithData,
} from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import express from 'express';
import { StaticRouter } from 'react-router';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import nodeFetch from 'node-fetch';
import App from './components/App';
import Html from './Html';

const app = express();

const authLink = setContext((_, { headers }) => {
    if (!localStorage.getItem('userInfo')) {
        return {
            headers: {
                ...headers,
                authorization: '',
            },
        };
    }
    const checkStorage = localStorage.getItem('userInfo');
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
    fetch: nodeFetch,
});

const wsLink = process.browser
    ? new WebSocketLink({
          uri: 'ws://localhost:4000/graphql',
          onDisconnected: () => {
              console.log('not connected');
          },
          options: {
              lazy: true,
              reconnect: true,
              connectionParams: () => {
                  const checkStorage = localStorage.getItem('userInfo');
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
    : null;

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

const cache = new InMemoryCache();

app.use((req, res) => {
    const client = new ApolloClient({
        ssrMode: true,
        link,
        cache,
    });

    const context = {};

    const component = (
        <ApolloProvider client={client}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </ApolloProvider>
    );

    renderToStringWithData(component)
        .then((content: any) => {
            const html = <Html content={content} client={client} />;
            res.send(`<!DOCTYPE html>\n${ReactDOM.renderToString(html)}`);
            res.status(200);
            res.end();
        })
        .catch((e: any) => {
            console.error('RENDERING ERROR:', e); // eslint-disable-line no-console
            res.status(500);
            res.end(
                `An error occurred. Please submit an issue to [https://github.com/apollographql/GitHunt-React] with the following stack trace:\n\n${
                    e.stack
                }`
            );
        });
});

app.listen(5000, () =>
    console.log(
        // eslint-disable-line no-console
        `app Server is now running on http://localhost:${5000}`
    )
);
