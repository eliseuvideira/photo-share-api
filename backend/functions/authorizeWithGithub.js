const { requestGithubToken } = require("./requestGithubToken");
const { requestGithubUserAccount } = require("./requestGithubUserAccount");

exports.authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};
