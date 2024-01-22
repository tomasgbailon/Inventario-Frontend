import { useEffect } from 'react';
import './LoginButton.css'
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

export default function Login() {
    const { loginWithRedirect, logout, isAuthenticated} = useAuth0();
    return(
        <>
        {isAuthenticated ? <button className='login-button' onClick={() => logout({ logoutParams: { returnTo: window.location.origin }}) }>
            <a className='white-a' href='/'>Cerrar Sesión</a>
        </button> : <button className='login-button' onClick={() => loginWithRedirect()}>
            Iniciar Sesión
        </button>}
        </>
    )
}