import './Landing.css'
import '../App.css'
import LandingNavBar from './LandingNavBar'
import LandingFooter from './LandingFooter'
import Signup from '../Account/SignupButton'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Landing() {
    const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [authId, setAuthId] = useState('');
    const getToken = async () => {
        await getAccessTokenSilently().then((token) => {
            setToken(token);
        })
    }
    useEffect(() => {
        //save authId and email to localStorage
        if (!isAuthenticated) {
            return;
        }
        setEmail(user?.email);
        setAuthId(user?.sub.split('|')[1]);
        getToken();
    }, [isAuthenticated])
    useEffect(() => {
        //send authId and email to backend
        if (!isAuthenticated) {
            return;
        }
        //set localstorage
        localStorage.setItem('authId', authId);
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
    }, [token])
    if (isLoading) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <div className='mainContainer'>
            <LandingNavBar/>
            <div className="landingContainer">
                <div className="leftLandingContainer">
                    <h1> Maneja tu <span className='bold-word'>bodega</span> fácilmente</h1>
                    <p>
                        Las empresas pequeñas tienen la emergente necesidad
                        de manejar su inventario de la forma más simple e
                        intuitiva posible. Con Kipin maneja tu empresa
                        y decide quienes pueden administrar el negocio junto
                        a ti.
                    </p>
                    <div className='signupButtonContainer'>
                        <Signup/>
                    </div>
                </div>
                <div className="rightLandingContainer">
                    <img src="/Landing.jpg" className='landingImage'></img>
                </div>
            </div>
            <LandingFooter/>
        </div>
    )
}