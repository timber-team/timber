import React, {useEffect, useState} from 'react';
import {Route} from 'react-router-dom';

import {useAuth} from '../store/auth';
import EditProfileModal from './EditProfileModal';
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
