import './Circle.css'

export default function Circle(props) {
    return (
        <div className='circle' style={{backgroundColor: props.color}}>
            <p>{props.text}</p>
        </div>
    )
}