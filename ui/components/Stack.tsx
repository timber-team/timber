import { useContext, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Card from "./Card"
import { GenericInterface, swipeInfo, StackContext } from "./StackContext"

export default () => {   
    const [current, setCurrent] = useState([{
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

    const [stack, setStack] = useState<swipeInfo>(undefined)
    const stackState: GenericInterface<swipeInfo> = {
        value: stack,
        setter: setStack
    }

    return (
        <StackContext.Provider value={stackState}>
            <Container>
                <Row className='justify-content-md-center'>
                    <Col md="auto">
                        <Card Name={current[current.length - 1].Name} Description={current[current.length - 1].Description} PreferredSkills={current[current.length - 1].PreferredSkills} RequiredSkills={current[current.length - 1].RequiredSkills} />
                    </Col>
                </Row>
            </Container>
        </StackContext.Provider>
    )
}