import React, {useEffect} from 'react';
import {tokens} from '../api';

const OAuthCallback = () => {

  console.log('OAuthCallback');

  useEffect(() => {
    (async () => {

      console.log("Waiting...")
      // sleep for two seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('OAuthCallback');
      await tokens.getAccessToken(window.location.search, window.location.pathname.split("/")[window.location.pathname.split("/").length - 1])
      window.location.href = '/';
    })();
  }, []);
  return <p>Loading...</p>;
};

export default OAuthCallback;
