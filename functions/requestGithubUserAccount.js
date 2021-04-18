const fetch = require("node-fetch");

exports.requestGithubUserAccount = async (token) => {
  const response = await fetch(`https://api.github.com/user`, {
    headers: {
      accept: "application/json",
      authorization: `token ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
