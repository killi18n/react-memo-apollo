import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Query {
        memos: [Memo]
        memo(_id: ID!): Memo!
    }

    type Memo {
        _id: ID!
        content: String!
        writer: String!
        createdAt: String!
        updatedAt: String!
    }

    type Mutation {
        createMemo(content: String!, writer: String!, createdAt: String!): Memo
        updateMemo(_id: ID!, content: String): Memo
    }
`;

export default typeDefs;
