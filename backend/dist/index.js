"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var apollo_server_express_1 = require("apollo-server-express");
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
dotenv_1.default.config();
var mongoURI = process.env.MONGO_URI;
var server = new apollo_server_express_1.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
mongoose_1.default
    .connect(mongoURI)
    .then(function () {
    console.log('mongodb connected');
})
    .catch(function (e) {
    console.log(e);
});
var app = express_1.default();
server.applyMiddleware({ app: app });
// const router = express.Router();
app.listen({ port: 4000 }, function () {
    return console.log("\uD83D\uDE80 Server ready at http://localhost:4000" + server.graphqlPath);
});
//# sourceMappingURL=index.js.map