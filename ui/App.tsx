import Axios from 'axios';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Legal from './components/Legal';
import NavBar from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import Applications from './pages/Applications';
import Browse from './pages/Browse';
import LandingPage from './pages/LandingPage';
import OAuthCallback from './src/OAuthCallback';

Axios.defaults.baseURL = process.env.BASE_URL;
Axios.defaults.withCredentials = true;

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh'
      }}
    >
      <NavBar />
      <Router>
        <div
          style={{
            minHeight: 'var(--bs-content-height)'
          }}
        >
          <Switch>
            {/* Oauth callback */}
            <Route path="/oauth/callback/*" component={OAuthCallback} />
            {/* Protected routes */}
            <ProtectedRoute>
              {/* Landing page */}
              <Route exact path="/" component={LandingPage} />
              {/* Browse page */}
              <Route exact path="/browse" component={Browse} />
              {/* Applications page */}
              <Route exact path="/applications" component={Applications} />
            </ProtectedRoute>
          </Switch>
        </div>
      </Router>
      <Legal />
    </div>
  );
};

export default App;
