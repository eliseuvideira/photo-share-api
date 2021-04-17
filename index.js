const { ApolloServer } = require("apollo-server");

const photos = [];

const typeDefs = `
  type Query {
    totalPhotos: Int!
  }

  type Mutation {
    createPhoto(name: String! description: String): Boolean!
  }
`;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
  },

  Mutation: {
    createPhoto: (parent, args) => {
      photos.push(args);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const { url } = await server.listen();

  console.info(`listening at ${url}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
