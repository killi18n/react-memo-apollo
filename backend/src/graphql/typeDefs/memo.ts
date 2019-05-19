import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Memo {
        _id: ID!
        content: String!
        writer: String!
        createdAt: String!
        updatedAt: String
        isSubscribed: Boolean
    }

    type CreateMemoReturn {
        memo: Memo
        error: Int
    }

    type Query {
        memos(page: Int!, limit: Int!): [Memo]
        memo(_id: ID!): Memo!
    }

    type Mutation {
        createMemo(content: String!, createdAt: String!): CreateMemoReturn
        updateMemo(_id: ID!, content: String): Memo
    }

    type Subscription {
        memoCreated: Memo
    }
`;

export default typeDefs;
