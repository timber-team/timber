import React from "react"
import { Badge, Card } from "react-bootstrap"
import * as API from '../api'
import ReactMarkdown from 'react-markdown'

interface viableProps {
    Name: string,
    Description: string,
    PreferredSkills: string[] | API.types.Tag[],
    RequiredSkills: string[] | API.types.Tag[]
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
                <Card.Text key="tags" style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}> 
                    {props.RequiredSkills.map(x => <Badge pill bg="primary"> {x} </Badge>)}
                    {props.PreferredSkills.map(x => <Badge pill bg="secondary"> {x} </Badge>)} 
                </Card.Text>
                <Card.Text key="description" style={{ overflow: 'auto' }}><ReactMarkdown children={props.Description}></ReactMarkdown></Card.Text>
            </Card.Body>
        </Card>
    )
}