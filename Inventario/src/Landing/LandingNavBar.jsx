import './LandingNavBar.css'
import LoginButton from '../Account/LoginButton'
import { useAuth0 } from '@auth0/auth0-react'

export default function LandingNavBar() {
    const { isAuthenticated, user, isLoading } = useAuth0();
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
                {isAuthenticated ? <a href="/dashboard">Panel de Control</a>:
                <a href="/">Panel de Control</a>}
            </div>
            <div className="landingNavBarItem">
                <LoginButton/>
            </div>
        </div>
    )
}