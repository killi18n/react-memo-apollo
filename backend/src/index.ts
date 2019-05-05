import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

dotenv.config();

const { MONGO_URI: mongoURI } = process.env;

const server = new ApolloServer({ typeDefs, resolvers });

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
