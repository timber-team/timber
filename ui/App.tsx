import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom"
import Applications from './pages/Applications'
import Browse from './pages/Browse'
import LandingPage from './pages/LandingPage'

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
                <Route path="/">
                    <LandingPage />
                </Route>
            </Switch>
        </Router>
    )
}

export default App