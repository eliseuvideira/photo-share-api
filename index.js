const dotenv = require("dotenv-safe");

dotenv.config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const fs = require("fs");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const typeDefs = fs.readFileSync("./typeDefs.graphql", "utf8");

app.get("/", (req, res) => res.send("Welcome to PhotoShare API").end());

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "photo-share-api",
  });

  const db = mongoose.connection;

  const server = new ApolloServer({ typeDefs, resolvers, context: { db } });

  server.applyMiddleware({ app });

  const port = 4000;

  app.listen({ port }, () => {
    console.info(`http://localhost:${port}${server.graphqlPath}`);
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
