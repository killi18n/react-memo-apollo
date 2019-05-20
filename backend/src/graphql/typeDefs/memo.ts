import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Memo {
        _id: ID!
        content: String!
        writer: String!
        createdAt: String!
        updatedAt: String
    }

    type CreateMemoReturn {
        memo: Memo
        error: Int
    }

    type GetMemosReturn {
        memos: [Memo]
        lastPage: Int
    }

    type Query {
        memos(limit: Int!, cursor: String): GetMemosReturn
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
