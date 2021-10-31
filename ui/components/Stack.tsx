import { useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Card from "./Card"

export default () => {
    // The bug can be fixed (extra click one) when have the data for the requests done,
    // It's only like this due to me setting the state like this 
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
        Description: 'Golang Yum',
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

    const meme = (e) => {
        if (e) {
            // DO ACCEPT
        } else {
            // DONT ACCEPT
        }
        nextCard()
    }

    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col>
                    <Button onClick={() => {meme(false)}}> Reject </Button>
                </Col>
                <Col md="auto">
                    {current ? <Card Name={current.Name} Description={current.Description} PreferredSkills={current.PreferredSkills} RequiredSkills={current.RequiredSkills} /> : <div> No more stuff for you to checkout </div>}
                </Col>  
                <Col>
                    <Button onClick={() => {meme(true)}}> Accept </Button>
                </Col>
            </Row>
        </Container>
    )
}