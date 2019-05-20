import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import App from 'components/App';
import configure from 'store/configure';
import 'index.css';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root');

// const userInfoStorage = localStorage.getItem('userInfo');

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
});

const wsLink = new WebSocketLink({
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
});

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

const client = new ApolloClient({
    link,
    cache,
});

const store = configure();

if (rootElement) {
    const Root = () => (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </ApolloProvider>
    );
    ReactDOM.render(<Root />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
