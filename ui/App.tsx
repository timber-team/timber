import Axios from 'axios';
import ProjectsPage from './pages/ProjectsPage';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Legal from './components/Legal';
import NavBar from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import Applications from './pages/Applications';
import Browse from './pages/Browse';
import LandingPage from './pages/LandingPage';
import Trending from './pages/Trending';
import OAuthCallback from './src/OAuthCallback';
import UserSettings from './pages/UserSettings';

Axios.defaults.baseURL = process.env.API_URL;
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
              {/* Projects page */}
              <Route exact path="/projects" component={ProjectsPage} />
              {/* Applications page */}
              <Route exact path="/applications" component={Applications} />
              {/* Trending page */}
              <Route exact path="/trending" component={Trending} />
              {/* User settings Modal */}
              <Route exact path="/settings" component={UserSettings} />
            </ProtectedRoute>
          </Switch>
        </div>
      </Router>
      <Legal />
    </div>
  );
};

export default App;
