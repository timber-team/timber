import { Card } from "react-bootstrap"
import Tag from "./Tag"

interface viableProps {
    Name: string,
    Description: string,
    PreferredSkills: string[],
    RequiredSkills: string[],
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const style = {
    'display': 'flex',
    'flex-direction': 'row'
}

export default (props: viableProps) => {
    return (
        <Card style={{ width: '18rem' }} onClick={props.onClick}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>{props.Name}</Card.Title>
                <Card.Text style={style}>{props.PreferredSkills.map(x => <Tag skill={x} />)}</Card.Text>
                <Card.Text>{props.Description}</Card.Text>
            </Card.Body>
        </Card>
    )
}