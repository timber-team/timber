import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom"
import OAuthCallback from './src/OAuthCallback'
import Applications from './pages/Applications'
import Browse from './pages/Browse'
import LandingPage from './pages/LandingPage'

// import 'bootstrap/dist/css/bootstrap.css'
const App: React.FC = () => {
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
                <Route path="/">
                    <LandingPage />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
