import express from 'express';
import http from 'http';
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { decodeToken } from 'lib/token';

dotenv.config();

const { MONGO_URI: mongoURI } = process.env;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    schema,
    context: async ({ req, connection }: any) => {
        try {
            if (connection) {
                const token = connection.context.headers['Authorization'];
                if (!token || token === '') {
                    return {
                        decodeToken: null,
                    };
                }

                const decoded = await decodeToken(token);

                return {
                    decodedToken: decoded,
                };
            }
            const token = req.headers.authorization;

            if (!token) {
                return {
                    decodedToken: null,
                };
            }
            const decoded = await decodeToken(token);

            return {
                decodedToken: decoded,
            };
        } catch (e) {
            console.log(e);
            // return {
            //     decodedToken: null,
            // };
            throw new Error('not logged in');
        }
    },
});

mongoose
    .connect(mongoURI as string)
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(e => {
        console.log(e);
    });

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// const router = express.Router();

httpServer.listen({ port: 4000 }, () => {
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    console.log(
        `🚀 Server ready at http://localhost:4000${server.subscriptionsPath}`
    );
});
