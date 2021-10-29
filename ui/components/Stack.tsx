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
    ]
   

    let z = cards.pop()

    const [current, setCurrent] = useState(<Card Name={z.Name} Description={z.Description} PreferredSkills={z.PreferredSkills} RequiredSkills={z.RequiredSkills} />)

    const [{ rotateZ, opacity, x }, api] = useSpring(() => ({ 
        rotateZ: 0,
        opacity: 1,
        x: 0
    }))

    const bind = useDrag(({down, cancel, movement: [mx], active }) => {
        if (down && Math.atan(mx/424) * (180 / Math.PI) > 14) {
            console.log('right')
            cancel()
        } else if (down && Math.atan(mx/424) * (180 / Math.PI) < -14) {
            console.log('left')
            cancel()
        }
        api.start({ rotateZ: down ? Math.atan(mx/424) * (180 / Math.PI) : 0, 
            immediate: active,
            opacity: 0.5 + (0.5 * 12.5/(Math.abs(Math.atan(mx/424) * (180 / Math.PI))))})
    }, {bounds: {left: Math.atan(0.26) * -424, right: Math.atan(0.26) * 424, top: 0, bottom: 0}})

    return (
        <div>
            <Container>
                <Row className='justify-content-md-center'>
                    <Col md="auto">
                    <animated.div {...bind()} style={{rotateZ, opacity, x, transformOrigin: 'bottom center'}} >
                        {current}
                    </animated.div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}