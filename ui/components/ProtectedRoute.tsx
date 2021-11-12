/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Route} from 'react-router-dom';

import {useAuth} from '../store/auth';
import EditProfileModal from './EditProfileModal';
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
      render={({location}) => {
        if (isLoading || !beginUserLoad) {
          return <div>Loading...</div>;
        }
        if (!currentUser) {
          return <LoginModal />;
        }
        if (currentUser.username.length < 1) {
          return <EditProfileModal />;
        }
        return children;
      }}
    />
  );
};

export default ProtectedRoute;
