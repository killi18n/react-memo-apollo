"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Query {\n        memos: [Memo]\n        memo(_id: ID!): Memo!\n        user(_id: ID!): User!\n    }\n\n    type Memo {\n        _id: ID!\n        content: String!\n        writer: String!\n        createdAt: String!\n        updatedAt: String!\n    }\n\n    type User {\n        _id: ID!\n        name: String!\n        password: String!\n        createdAt: String!\n    }\n\n    type Mutation {\n        createMemo(content: String!, writer: String!, createdAt: String!): Memo\n        updateMemo(_id: ID!, content: String): Memo\n        createUser(name: String!, password: String!): User\n        checkUser(name: String!, password: String!): User\n    }\n"], ["\n    type Query {\n        memos: [Memo]\n        memo(_id: ID!): Memo!\n        user(_id: ID!): User!\n    }\n\n    type Memo {\n        _id: ID!\n        content: String!\n        writer: String!\n        createdAt: String!\n        updatedAt: String!\n    }\n\n    type User {\n        _id: ID!\n        name: String!\n        password: String!\n        createdAt: String!\n    }\n\n    type Mutation {\n        createMemo(content: String!, writer: String!, createdAt: String!): Memo\n        updateMemo(_id: ID!, content: String): Memo\n        createUser(name: String!, password: String!): User\n        checkUser(name: String!, password: String!): User\n    }\n"])));
exports.default = typeDefs;
var templateObject_1;
//# sourceMappingURL=typeDefs.js.map