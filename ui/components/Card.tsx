import { Card } from "react-bootstrap"
import Tag from "./Tag"
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { StackContext } from "./StackContext"
import { useContext } from "react"

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
    const ctx = useContext(StackContext)

    const [{ rotateZ, opacity, x }, api] = useSpring(() => ({ 
        rotateZ: 0,
        opacity: 1,
        x: 0
    }))

    const bind = useDrag(({down, cancel, movement: [mx], active }) => {
        if (down && Math.atan(mx/424) * (180 / Math.PI) > 15) {
            ctx.setter({swiped: ctx.value.swiped + 1, accept: false})
            cancel()
        } else if (down && Math.atan(mx/424) * (180 / Math.PI) < -15) {
            ctx.setter({swiped: ctx.value.swiped + 1, accept: true})
            cancel()
        }
        api.start({ rotateZ: down ? Math.atan(mx/424) * (180 / Math.PI) : 0, 
            immediate: active,
            opacity: 0.5 + (0.5 * 12.5/(Math.abs(Math.atan(mx/424) * (180 / Math.PI))))})
    }, {bounds: {left: Math.atan(0.26) * -424, right: Math.atan(0.26) * 424, top: 0, bottom: 0}})

    return (
        <animated.div {...bind()} style={{rotateZ, opacity, x, transformOrigin: 'bottom center'}} >
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>{props.Name}</Card.Title>
                    <Card.Text style={style}>{props.PreferredSkills.map(x => <Tag skill={x} />)}</Card.Text>
                    <Card.Text style={{ overflow: 'auto' }}>{props.Description}</Card.Text>
                </Card.Body>
            </Card>
        </animated.div>
    )
}
