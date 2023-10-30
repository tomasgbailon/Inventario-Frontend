import './SecondNavBar.css'
import PopOver from '../Tools/PopOver/PopOver'
import { useContext } from 'react'
import { DashboardContext } from './Dashboard'

// Selections:
// 1: Departamentos
// 2: Administración
// 3: Proyectos

export default function SecondNavBar({selection}) {
    const {organizationId} = useContext(DashboardContext);
    return (
        <div className="second-navbar">
            <div className="second-navbarItem">
                <a href={'/organization/'+organizationId+'/'}>
                    Departamentos
                </a>
                {selection != 1 && <div className="thinBlueLine"/>}
                {selection == 1 && <div className="thinGreyLine"/>}
            </div>
            <div className="second-navbarItem">
                <a href={'/administration/'+organizationId+'/'}>
                    Administración
                </a>
                {selection != 2 && <div className="thinBlueLine"/>}
                {selection == 2 && <div className="thinGreyLine"/>}
            </div>
            <div className="second-navbarItem">
                <a href={'/proyects/'+organizationId+'/'}>
                    Proyectos
                </a>
                {selection != 3 && <div className="thinBlueLine"/>}
                {selection == 3 && <div className="thinGreyLine"/>}
            </div>
        </div>
    )
}