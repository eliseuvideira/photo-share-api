const fetch = require("node-fetch");

exports.requestGithubToken = async (credentials) => {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return data;
};
