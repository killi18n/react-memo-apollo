import { gql } from 'apollo-server-express';

const typeDefs = gql`
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

    type LoginOrRegister {
        _id: ID
        name: String
        jwt: String
        error: Int
    }

    type Query {
        memos: [Memo]
        memo(_id: ID!): Memo!
        user(_id: ID!): User!
        checkUserLoggedIn(token: String!): User
    }

    type Mutation {
        createMemo(content: String!, writer: String!, createdAt: String!): Memo
        updateMemo(_id: ID!, content: String): Memo
        createUser(name: String!, password: String!): LoginOrRegister
        findUserByNameAndPassword(
            name: String!
            password: String!
        ): LoginOrRegister
    }
`;

export default typeDefs;
