const { GraphQLScalarType } = require("graphql");
const mongoose = require("mongoose");

const resolvers = {
  Query: {
    totalPhotos: (parent, args, { db }) =>
      db.collection("photos").estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) =>
      db.collection("photos").find().toArray(),
    totalUsers: (parent, args, { db }) =>
      db.collection("users").estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection("users").find().toArray(),
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

exports.resolvers = resolvers;
