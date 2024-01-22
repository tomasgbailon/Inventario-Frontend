import './LandingNavBar.css'
import LoginButton from '../Account/LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom';

export default function LandingNavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading } = useAuth0();
    return (
        <div id="landingNavBarContainer">
            <div className="landingNavBarItem" id='landingNavBarImageContainer'>
                <img src="/LogoInventario3.png" className='landingNavBarLogo'></img>
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/');
                    }
                }>Kipin</a>
            </div>
            <div className="landingNavBarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/howitworks');
                    }
                }>Cómo funciona</a>
            </div>
            <div className="landingNavBarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/');
                    }
                }>Documentación</a>
            </div>
            <div className="landingNavBarItem">
                {isAuthenticated ? <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/dashboard');
                    }
                }>Panel de Control</a>:
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/');
                    }
                }>Panel de Control</a>}
            </div>
            <div className="landingNavBarItem">
                <LoginButton/>
            </div>
        </div>
    )
}