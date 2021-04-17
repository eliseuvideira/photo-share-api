const { ApolloServer } = require("apollo-server");

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
  },
  {
    photoId: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    userId: "sSchmidt",
  },
  {
    photoId: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    userId: "sSchmidt",
  },
];

const tags = [
  { photoId: "1", userId: "gPlake" },
  { photoId: "2", userId: "sSchmidt" },
  { photoId: "2", userId: "mHattrup" },
  { photoId: "2", userId: "gPlake" },
];

const typeDefs = `
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
      const photo = { ...args.input, photoId: id() };
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
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const { url } = await server.listen();

  console.info(`listening at ${url}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
