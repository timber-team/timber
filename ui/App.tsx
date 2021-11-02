import Axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Applications from "./pages/Applications";
import Browse from "./pages/Browse";
import LandingPage from "./pages/LandingPage";
import OAuthCallback from "./src/OAuthCallback";
import { useAuth } from "./store/auth";

Axios.defaults.baseURL = process.env.BASE_URL;
Axios.defaults.withCredentials = true;

// import 'bootstrap/dist/css/bootstrap.css'
const App: React.FC = () => {
  const getUser = useAuth((state) => state.getUser);
  const [beginUserLoad, setBeginUserLoad] = useState(false);
  const isLoading = useAuth((state) => state.isLoading);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
    setBeginUserLoad(true);
  }, [getUser]);

  return (
    <Router>
      <Switch>
        <Route path="/browse">
          <Browse />
        </Route>
        <Route path="/applications">
          <Applications />
        </Route>
        <Route path="/oauth/callback/google">
          <OAuthCallback />
        </Route>
        <Route exact path="/">
          {isLoading && currentUser === undefined && <div>Loading...</div>}
          {currentUser !== undefined && <LandingPage />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
