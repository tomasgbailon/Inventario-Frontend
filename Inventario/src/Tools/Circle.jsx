import './Circle.css'

export default function Circle(props) {
    return (
        <div className={props.size === 'big' ? 'circle-big' : 'circle'} style={{backgroundColor: props.color}}>
            <p>{props.text}</p>
        </div>
    )
}