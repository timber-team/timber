interface viableProps {
    skill: String
}

// This CSS is a placeholder, someone who is good at CSS make this spanking and slick
const style = {
    marginRight: '8px',
    padding: '4px',
    backgroundColor: 'coral',
    borderRadius: '4px',
    color: 'white'
}
export default (props: viableProps) => {
    return (
        <div style={style}>
            {props.skill}
        </div>
    )
}