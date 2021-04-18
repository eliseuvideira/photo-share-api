const { GraphQLScalarType } = require("graphql");
const { authorizeWithGithub } = require("./functions/authorizeWithGithub");

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

  Mutation: {
    githubAuth: async (parent, { code }, { db }) => {
      const {
        message,
        access_token,
        avatar_url,
        login,
        name,
      } = await authorizeWithGithub({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      });

      if (message) {
        throw new Error(message);
      }

      const {
        ops: [user],
      } = await db
        .collection("users")
        .replaceOne(
          { userId: login },
          {
            name,
            avatar: avatar_url,
            githubToken: access_token,
            userId: login,
          },
          { upsert: true }
        );

      return { user, token: access_token };
    },
  },
};

exports.resolvers = resolvers;
