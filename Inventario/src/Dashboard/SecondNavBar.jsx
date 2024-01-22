import './SecondNavBar.css'
import PopOver from '../Tools/PopOver/PopOver'
import { useContext } from 'react'
import { DashboardContext } from './Dashboard'
import { useNavigate } from 'react-router-dom'

// Selections:
// 1: Departamentos
// 2: Administración
// 3: Proyectos

export default function SecondNavBar({selection, accessLevel}) {
    const navigate = useNavigate();
    const {organizationId} = useContext(DashboardContext);
    return (
        <div className="second-navbar">
            { (accessLevel === 'owner' || accessLevel === 'admin' || accessLevel === 'edit' || accessLevel === 'view') &&
            <div className="second-navbarItem">
                <a onClick={
                    (event) => {
                        event.preventDefault();
                        navigate('/organization/'+organizationId+'/');
                    }
                
                }>
                    Departamentos
                </a>
                {selection != 1 && <div className="thinBlueLine"/>}
                {selection == 1 && <div className="thinGreyLine"/>}
            </div>}
            { (accessLevel === 'owner' || accessLevel === 'admin') &&
                <div className="second-navbarItem">
                <a onClick={
                    (event) => {
                        event.preventDefault();
                        navigate('/administration/'+organizationId+'/');
                    }
                }>
                    Administración
                </a>
                {selection != 2 && <div className="thinBlueLine"/>}
                {selection == 2 && <div className="thinGreyLine"/>}
            </div>}
            { (accessLevel === 'owner' || accessLevel === 'admin' || accessLevel === 'edit' || accessLevel === 'view') &&
                <div className="second-navbarItem">
                <a onClick={
                    (event) => {
                        event.preventDefault();
                        navigate('/proyects/'+organizationId+'/');
                    }
                }>
                    Proyectos
                </a>
                {selection != 3 && <div className="thinBlueLine"/>}
                {selection == 3 && <div className="thinGreyLine"/>}
            </div>}
        </div>
    )
}