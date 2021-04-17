const { ApolloServer } = require("apollo-server");

const id = (() => {
  let _id = 0;
  return () => ++_id;
})();

const photos = [];

const typeDefs = `
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    createPhoto(name: String! description: String): Photo!
  }
`;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  Mutation: {
    createPhoto: (parent, args) => {
      const photo = { ...args, id: id() };
      photos.push(photo);
      return photo;
    },
  },

  Photo: {
    url: (parent) => `http://localhost:4000/img/${parent.id}.jpg`,
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
