import './Generator.css'
import GenPopOver from './PopOver/GenPopOver'
import { useState } from 'react'

export default function Generator({text, label}) {
    return(
        <>
            <GenPopOver mainText='Generar informe' color='green' Id={1} type="date" label={label}/>
        </>
    )
}