/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';

import {useAuth} from '../store/auth';
import {LoginModal} from './LoginModal';

const ProtectedRoute = ({children}: { children: any }) => {
  const {currentUser, getUser, isLoading, error} = useAuth();
  const [beginUserLoad, setBeginUserLoad] = useState(false);

  useEffect(() => {
    getUser(false);
    setBeginUserLoad(true);
  }, [getUser]);

  return (
    <Route
      render={({location}) =>
        isLoading || !beginUserLoad ? (
          <div>Loading...</div>
        ) : currentUser ? (
          children
        ) : (
          <LoginModal />
        )
      }
    />
  );
};

export default ProtectedRoute;
