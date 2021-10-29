import { useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Card from "./Card"
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

export default () => {
    var cards = [{
        ID: '1',
        CreatedAt: '1412312',
        UpdatedAt: '190241024',
        Name: 'Shanghai1\'s Gust Project',
        Description: 'Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust ',
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
    ]
   

    let z = cards.pop()

    const [current, setCurrent] = useState(<Card Name={z.Name} Description={z.Description} PreferredSkills={z.PreferredSkills} RequiredSkills={z.RequiredSkills} />)

    const [{ rotateZ, opacity }, api] = useSpring(() => ({ 
        rotateZ: 0,
        opacity: 1
    }))

    const bind = useDrag(({ down, cancel, movement: [mx] }) => {
        const foo = () => {} // Temp until we implement stuff to accept or decline a project
        const bar = () => {} // Temp until we implement stuff to accept or decline a project

        if (mx > 15 || mx < -15) {
            (mx > 15) ? foo() : bar()
            if (cards.length) {
                z = cards.pop()
                setCurrent(<Card Name={z.Name} Description={z.Description} PreferredSkills={z.PreferredSkills} RequiredSkills={z.RequiredSkills} />)
            } else {
                setCurrent(<div> You've ran out of projects to see for today </div>)
            }
            api.start({ rotateZ: 0, opacity: 1})
            cancel()
        }
        api.start({ rotateZ: down ? mx : 0 , opacity: 15/mx})
    })

    return (
        <div>
            <Container>
                <Row className='justify-content-md-center'>
                    <Col md="auto">
                    <animated.div {...bind()} style={{rotateZ, opacity, transformOrigin: 'bottom center'}} >
                        {current}
                    </animated.div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}