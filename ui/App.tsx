import React, {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import EditProfileForm from './components/EditProfileForm';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicantReview from './pages/ApplicationReview';
import Applications from './pages/Applications';
import Browse from './pages/Browse';
import LandingPage from './pages/LandingPage';
import ProjectsPage from './pages/ProjectsPage';
import Trending from './pages/Trending';
import OAuthCallback from './src/OAuthCallback';
import {useAuth} from './store/auth';

const App: React.FC = () => {
  const getUser = useAuth((state) => state.getUser);
  const [beginUserLoad, setBeginUserLoad] = useState(false);
  const isLoading = useAuth((state) => state.isLoading);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
    setBeginUserLoad(true);
  }, [getUser]);

  const routes =
    beginUserLoad && !isLoading ? (
      <Switch>
        <Route path="/oauth/callback/*" component={OAuthCallback} />
        <ProtectedRoute user={currentUser}>
          {/* Landing page */}
          <Route exact path="/" component={LandingPage} />
          {/* Browse page */}
          <Route exact path="/browse" component={Browse} />
          {/* Projects page */}
          <Route exact path="/projects">
            <ProjectsPage user={currentUser} />
          </Route>
          {/* Applications page */}
          <Route exact path="/applications" component={Applications} />
          {/* Trending page */}
          <Route exact path="/trending" component={Trending} />
          {/* Review page */}
          <Route exact path="/review/:id" component={ApplicantReview} />
          {/* Settings page */}
          <Route exact path="/settings" component={EditProfileForm} />
        </ProtectedRoute>
      </Switch>
    ) : undefined;

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      <Router>
        <NavBar currentUser={currentUser} />
        <div
          style={{
            minHeight: 'var(--bs-content-height)',
          }}
        >
          {isLoading ||
            (!beginUserLoad && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ))}
          {routes}
        </div>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
