const express = require("express");

const app = express();

const fs = require("fs");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const typeDefs = fs.readFileSync("./typeDefs.graphql", "utf8");

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.get("/", (req, res) => res.send("Welcome to PhotoShare API").end());

const port = 4000;

app.listen({ port }, () => {
  console.info(`listening at http://localhost:${port}`);
  console.info(`http://localhost:${port}${server.graphqlPath}`);
});
