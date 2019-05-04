import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const memos = [
    {
        id: 1,
        content: 'hello world',
        writer: 'dongho',
        createdAt: '2019-01-02',
    },
    {
        id: 2,
        content: 'my name is dongho!',
        writer: 'dongho',
        createdAt: '2019-01-03',
    },
    {
        id: 3,
        content: 'Good to see ya!',
        writer: 'dongho',
        createdAt: '2019-01-04',
    },
];

const typeDefs = gql`
    type Query {
        memos: [Memo]
        memo(id: ID!): Memo!
    }

    type Memo {
        id: ID!
        content: String!
        writer: String!
        createdAt: String!
    }
`;

type FindByIdPayload = {
    id: number;
};

const resolvers = {
    Query: {
        memos: () => memos,
        memo: (_: any, { id }: FindByIdPayload) => {
            const targetMemo = memos.filter(memo => memo.id === +id);
            return targetMemo[0];
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

// const router = express.Router();

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
