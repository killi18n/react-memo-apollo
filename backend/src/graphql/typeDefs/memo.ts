import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Memo {
        _id: ID!
        content: String!
        writer: String!
        createdAt: String!
        updatedAt: String!
    }

    type CreateMemoReturn {
        memo: Memo
        error: Int
    }

    type Query {
        memos: [Memo]
        memo(_id: ID!): Memo!
    }

    type Mutation {
        createMemo(
            content: String!
            writer: String!
            createdAt: String!
        ): CreateMemoReturn
        updateMemo(_id: ID!, content: String): Memo
    }
`;

export default typeDefs;
