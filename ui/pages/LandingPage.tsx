import "../style/custom.scss";

import React, { useEffect, useState } from "react";

import Legal from "../components/Legal";
import Nav from "../components/Nav";
import { useAuth } from "../store/auth";
import { Button, Col, Container, Row } from "react-bootstrap"
import Card from "../components/Card"

// import { GetProjectByID } from "../api/project";

const LandingPage: React.FC = () => {
      const currentUser = useAuth((state) => state.currentUser);
      const colStyle = {
        display: 'flex',
        alignItems: 'end',
        flexDirection: 'column'
      }

    const [cards, setCards] = useState([{
        ID: '1',
        CreatedAt: '1412312',
        UpdatedAt: '190241024',
        Name: 'Shanghai1\'s Gust Project',
        Description: 'Gust Gust Gust Gust Gust Gust Gust',
        OwnerID: '1',
        Collaborators: [],
        PreferredSkills: ['Gust', 'Ro', 'Postgres', 'Redis'],
        RequiredSkills: ['Gust', 'Ro'],
        Applications: []
    },
    {
        ID: '2',
        CreatedAt: '14123132',
        UpdatedAt: '1902410234',
        Name: 'Thomas\'s Go Project',
        Description: `# Golang Pog \n## Majorly pog\n- Reason\n1. bruh\n2. Brueh
      `,
        OwnerID: '2',
        Collaborators: [],
        PreferredSkills: ['Go'],
        RequiredSkills: ['Go'],
        Applications: []
    }
    ])

    // FIX later
    const [current, setCurrent] = useState(cards[cards.length - 1])

    const nextCard = () => {
        setCards(cards.slice(0, -1))
        setCurrent(cards[cards.length - 1])
    }

    const cardChoice = (e: boolean) => {
        if (e) {
            // DO ACCEPT
        } else {
            // DONT ACCEPT
        }
        nextCard()
    }
    return (
        <div>
            <main style={{ minHeight: "100%", padding: '2em' }}>
                <Container>
                    <Row className='justify-content-md-center align-content-md-center'>
                        <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                            <Button style={{padding: '15% 6%',}} variant='primary'
                                onClick={() => {cardChoice(true)}}
                            >✗</Button>
                        </Col>
                        <Col md="auto">
                            {current ? 
                            <Card Name={current.Name} Description={current.Description} PreferredSkills={current.PreferredSkills} RequiredSkills={current.RequiredSkills} />
                            : <div> No more stuff for you to checkout </div>}
                        </Col>
                        <Col style={{display: 'flex', alignItems: 'center',}}>
                            <Button style={{padding: '15% 6%',}} variant='secondary'
                                onClick={() => {cardChoice(false)}}
                            >✓</Button>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default LandingPage;
