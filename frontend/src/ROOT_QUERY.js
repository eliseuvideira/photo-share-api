import { gql } from "apollo-boost";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      userId
      name
      avatar
    }
  }
`;
