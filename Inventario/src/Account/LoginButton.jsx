import './LoginButton.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';
import { useState } from 'react';

export default function Login() {
    const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const getToken = async () => {
        const token_ = await getAccessTokenSilently();
        setToken(token_);
        localStorage.setItem('token', token_);
    }
    useEffect(() => {
        if(isAuthenticated){
            getToken();
        }
    }, [isAuthenticated])
    return(
        <>
        {isAuthenticated ? <button className='login-button' onClick={() => logout({ returnTo: window.location.origin })}>
            <a className='white-a' href='/'>Cerrar Sesión</a>
        </button> : <button className='login-button' onClick={() => loginWithRedirect()}>
            Iniciar Sesión
        </button>}
        </>
    )
}