<<<<<<< HEAD
import React, { useEffect } from "react";

import { tokens } from "../api/init";
=======
import React, { useEffect } from 'react'
import { tokens } from '../api'
>>>>>>> main

const OAuthCallback = () => {
  useEffect(() => {
    (async () => {
      await tokens.GetAccessToken(window.location.search, "google");
      window.location.href = "/";
    })();
  }, []);
  return <p>Loading...</p>;
};

export default OAuthCallback;
