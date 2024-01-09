import './Generator.css'
import GenPopOver from './PopOver/GenPopOver'

export default function Generator({text, label}) {
    return(
        <>
            <GenPopOver mainText='Generar informe' color='green' Id={1} type="date" label={label}/>
        </>
    )
}