import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuth } from "../store/auth";
import ModalLogin from "./ModalLogin";

const ProtectedRoute = ({ children }: { children: any }) => {
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
      render={({ location }) =>
        isLoading || !beginUserLoad ? (
          <div>Loading...</div>
        ) : currentUser ? (
          children
        ) : (
          <ModalLogin />
        )
      }
    />
  );
};

export default ProtectedRoute;
