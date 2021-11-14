import React from 'react';
import {Route, RouteProps} from 'react-router-dom';

import {User} from '../api/types';
import EditProfileForm from './EditProfileForm';
import {LoginModal} from './LoginModal';

type ProtectedRouteProps = RouteProps & {
  user?: User;
  children: React.ReactNode;
};

const ProtectedRoute = ({user, children, ...rest}: ProtectedRouteProps) => {
  return (
    <Route
      {...rest}
      render={({location}) =>
        user ? (
          user.username.length > 0 &&
          user &&
          user.tags &&
          user.tags.length > 0 ? (
            children
          ) : (
            <EditProfileForm type="modal" />
          )
        ) : (
          <LoginModal />
        )
      }
    />
  );
};

export default ProtectedRoute;
