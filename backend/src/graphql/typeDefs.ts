import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Query {
        memos: [Memo]
        memo(_id: ID!): Memo!
        user(_id: ID!): User!
    }

    type Memo {
        _id: ID!
        content: String!
        writer: String!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        password: String!
        createdAt: String!
    }

    type Login {
        _id: ID!
        name: String!
        jwt: String!
    }

    type Mutation {
        createMemo(content: String!, writer: String!, createdAt: String!): Memo
        updateMemo(_id: ID!, content: String): Memo
        createUser(name: String!, password: String!): User
        findUserByNameAndPassword(name: String!, password: String!): Login
    }
`;

export default typeDefs;