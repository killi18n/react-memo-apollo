import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from 'react-apollo';
import App from 'components/App';
import configure from 'store/configure';
import 'index.css';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root');

const authLink = setContext((_, { headers }) => {
    const userInfoStorage = localStorage.getItem('userInfo');
    if (!userInfoStorage) {
        return {
            headers: {
                ...headers,
                authorization: '',
            },
        };
    }
    const token = JSON.parse(userInfoStorage).jwt;
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

const cache = new InMemoryCache();

const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
