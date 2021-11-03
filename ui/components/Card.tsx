import React from "react"
import { Badge, Card } from "react-bootstrap"

interface viableProps {
    Name: string,
    Description: string,
    PreferredSkills: string[] | Tag[],
    RequiredSkills: string[] | Tag[]
}

const style = {
    display: 'flex',
    flexDirection: 'row'
}

export default (props: viableProps) => {
    return (
        <Card style={{ width: '32rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>{props.Name}</Card.Title>
                <Card.Text style={style}> 
                    {props.RequiredSkills.map(x => <Badge pill bg="primary"> {x} </Badge>)}
                    {props.PreferredSkills
                        .filter(x => !props.RequiredSkills.includes(x))
                        .map(x => <Badge pill bg="secondary"> {x} </Badge>)
                    } 
                </Card.Text>
                <Card.Text style={{ overflow: 'auto' }}>{props.Description}</Card.Text>
            </Card.Body>
        </Card>
    )
}