import React, {useEffect} from 'react';
import {tokens} from '../api';

const OAuthCallback = () => {
  useEffect(() => {
    (async () => {
      await tokens.getAccessToken(window.location.search, 'google');
      window.location.href = '/';
    })();
  }, []);
  return <p>Loading...</p>;
};

export default OAuthCallback;
