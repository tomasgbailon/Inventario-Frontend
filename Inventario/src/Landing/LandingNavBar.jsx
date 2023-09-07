import './LandingNavBar.css'
import LoginButton from '../Account/LoginButton'

export default function LandingNavBar() {
    return (
        <div id="landingNavBarContainer">
            <div className="landingNavBarItem">
                <img src="/logo.png" className='landingNavBarLogo'></img>
                <a href="/">Inventario</a>
            </div>
            <div className="landingNavBarItem">
                <a href="/">Cómo funciona</a>
            </div>
            <div className="landingNavBarItem">
                <a href="/">Documentación</a>
            </div>
            <div className="landingNavBarItem">
                <a href="/">Panel de Control</a>
            </div>
            <div className="landingNavBarItem">
                <LoginButton/>
            </div>
        </div>
    )
}