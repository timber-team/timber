import React from 'react'
// import 'bootstrap/dist/css/bootstrap.css'
import './style/custom.scss'

import { Card } from 'react-bootstrap'

const App: React.FC = () => {
    return (
        <Card>
            <Card.Header>Hello there</Card.Header>
            <Card.Body>General Kenobi</Card.Body>
        </Card>
    )
}

export default App