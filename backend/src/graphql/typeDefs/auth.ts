import { gql } from 'apollo-server-express';

const typeDefs = gql`
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
        user(_id: ID!): User!
        checkUserLoggedIn(token: String!): User
    }

    type Mutation {
        createUser(name: String!, password: String!): LoginOrRegister
        findUserByNameAndPassword(
            name: String!
            password: String!
        ): LoginOrRegister
    }
`;

export default typeDefs;
