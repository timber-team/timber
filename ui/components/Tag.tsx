interface viableProps {
    skill: String
}

// This CSS is a placeholder, someone who is good at CSS make this spanking and slick
const style = {
    'margin-right': '8px',
    'padding': '4px',
    'background-color': 'coral',
    'border-radius': '4px',
    'color': 'white'
}
export default (props: viableProps) => {
    return (
        <div style={style}>
            {props.skill}
        </div>
    )
}