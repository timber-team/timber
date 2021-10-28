import { useState } from "react"
import { Container } from "react-bootstrap"
import Card from "./Card"

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
    
    const click = () => {
        if (cards.length) {
            z = cards.pop()
            setCurrent(<Card Name={z.Name} Description={z.Description} PreferredSkills={z.PreferredSkills} RequiredSkills={z.RequiredSkills} onClick={click} />)
        } else {
            setCurrent(<div> You've ran out of projects to see for today </div>)
        }
    }

    let z = cards.pop()

    const [current, setCurrent] = useState(<Card Name={z.Name} Description={z.Description} PreferredSkills={z.PreferredSkills} RequiredSkills={z.RequiredSkills} onClick={click} />)

    return (
        <div>
            <Container>
                {current}
            </Container>
        </div>
    )
}