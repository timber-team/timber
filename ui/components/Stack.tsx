import { Container } from "react-bootstrap"
import Card from "./Card"

export default () => {
    let dummy_cards = [{
        ID: '1',
        CreatedAt: '100',
        UpdatedAt: '110',
        Name: 'Shanghai1\s Gust Project',
        Description: 'Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust Gust ',
        OwnerID: '1',
        Collaborators: [],
        PreferredSkills: ['Gust', 'Ro', 'Postgres', 'Redis'],
        RequiredSkills: ['Gust', 'Ro'],
        Applications: []
    }]

    return (
        <div>
            <Container>
                <Card Name={dummy_cards[0].Name} Description={dummy_cards[0].Description} PreferredSkills={dummy_cards[0].PreferredSkills} RequiredSkills={dummy_cards[0].RequiredSkills}/>
            </Container>
        </div>
    )
}