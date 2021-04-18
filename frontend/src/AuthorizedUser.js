import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const AuthorizedUser = () => {
  const [signingIn, setSigningIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace("?code=", "");
      alert(code);
      history.replace("/");
    }
  }, [history]);

  const requestCode = () => {
    var clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  };

  return (
    <button onClick={requestCode} disabled={signingIn}>
      Sign In with GitHub
    </button>
  );
};

export default AuthorizedUser;
