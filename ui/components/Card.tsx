import { Card } from "react-bootstrap"
import Tag from "./Tag"

interface viableProps {
    Name: string,
    Description: string,
    PreferredSkills: string[],
    RequiredSkills: string[]
}

const style = {
    display: 'flex',
    flexDirection: 'row'
}

export default (props: viableProps) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>{props.Name}</Card.Title>
                <Card.Text style={style}>{props.PreferredSkills.map(x => <Tag skill={x} />)}</Card.Text>
                <Card.Text style={{ overflow: 'auto' }}>{props.Description}</Card.Text>
            </Card.Body>
        </Card>
    )
}
