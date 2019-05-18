import express from 'express';
import { ApolloServer } from 'apollo-server-express';

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
    context: async ({ req }) => {
        try {
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

// const router = express.Router();

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
