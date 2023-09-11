import './NavBar.css'
import Popover from '../Tools/PopOver'

// Selections:
// 1: Panel de Control
// 2: Solicitudes
// 3: Documentación
// 4: Soporte
// 5: Cuenta

export default function NavBar({selection}) {
    return (
        <div className="navbar">
            <div className="navbarItem" id='logoContainer'>
                <img src="/logo.png" className='NavBarLogo'></img>
                <a href="/">Inventario</a>
            </div>
            <div className="navbarItem">
                <a href='/dashboard'>
                    Panel de Control
                </a>
                {selection == 1 && <div className="thinBlueLine"/>}
                {selection != 1 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a href='/dashboard'>
                    Solicitudes
                </a>
                {selection == 2 && <div className="thinBlueLine"/>}
                {selection != 2 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a href='/'>
                    Documentación
                </a>
                {selection == 3 && <div className="thinBlueLine"/>}
                {selection != 3 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a href='/'>
                    Soporte
                </a>
                {selection == 4 && <div className="thinBlueLine"/>}
                {selection != 4 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                {/* <a href='/'>
                    Cuenta
                </a> */}
                <Popover/>
                {selection == 5 && <div className="thinBlueLine"/>}
                {selection != 5 && <div className="thinGreyLine"/>}
            </div>
        </div>
    )
}