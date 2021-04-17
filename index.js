const express = require("express");

const app = express();

const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");

const id = (() => {
  let _id = 0;
  return () => ++_id;
})();

const users = [
  { userId: "mHattrup", name: "Mike Hattrup" },
  { userId: "gPlake", name: "Glen Plake" },
  { userId: "sSchmidt", name: "Scot Schmidt" },
];

const photos = [
  {
    photoId: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    userId: "gPlake",
    created: "3-28-1977",
  },
  {
    photoId: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    userId: "sSchmidt",
    created: "1-2-1985",
  },
  {
    photoId: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    userId: "sSchmidt",
    created: "2018-04-15T19:09:57.308Z",
  },
];

const tags = [
  { photoId: "1", userId: "gPlake" },
  { photoId: "2", userId: "sSchmidt" },
  { photoId: "2", userId: "mHattrup" },
  { photoId: "2", userId: "gPlake" },
];

const typeDefs = `
  scalar DateTime

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    photoId: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  type User {
    userId: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  input CreatePhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
    userId: ID!
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    createPhoto(input: CreatePhotoInput): Photo!
  }
`;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  Mutation: {
    createPhoto: (parent, args) => {
      const photo = { ...args.input, photoId: id(), created: new Date() };
      photos.push(photo);
      return photo;
    },
  },

  Photo: {
    url: (photo) => `http://localhost:4000/img/${photo.photoId}.jpg`,
    postedBy: (photo) => users.find((user) => user.userId === photo.userId),
    taggedUsers: (photo) =>
      tags
        .filter((tag) => tag.photoId === photo.photoId)
        .map(({ userId }) => users.find((user) => user.userId === userId)),
  },

  User: {
    postedPhotos: (user) =>
      photos.filter((photo) => photo.userId === user.userId),
    inPhotos: (user) =>
      tags
        .filter((tag) => tag.userId === user.userId)
        .map(({ photoId }) => photos.find((p) => p.photoId === photoId)),
  },

  DateTime: new GraphQLScalarType({
    name: "DateTime",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.get("/", (req, res) => res.send("Welcome to PhotoShare API").end());

const port = 4000;

app.listen({ port }, () => {
  console.info(`listening at http://localhost:${port}`);
  console.info(`http://localhost:${port}${server.graphqlPath}`);
});
