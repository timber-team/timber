import React, {useEffect, useState} from 'react';
import {Route} from 'react-router-dom';

import {useAuth} from '../store/auth';
import {LoginModal} from './LoginModal';

const ProtectedRoute = ({children}: { children: any }) => {
  const getUser = useAuth((state) => state.getUser);
  const [beginUserLoad, setBeginUserLoad] = useState(false);
  const isLoading = useAuth((state) => state.isLoading);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
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
