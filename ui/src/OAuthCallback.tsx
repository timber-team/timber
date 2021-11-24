import React, {useEffect} from 'react';

import {getAccessToken} from '../api/tokens';

const OAuthCallback = () => {
  useEffect(() => {
    const query = window.location.search;
    const provider =
      window.location.pathname.split('/')[
          window.location.pathname.split('/').length - 1
      ];

    getAccessToken(query, provider).then(() => {
      window.location.href = '/';
    });
  }, []);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default OAuthCallback;
