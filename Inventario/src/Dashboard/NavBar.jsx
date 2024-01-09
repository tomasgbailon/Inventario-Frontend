import './NavBar.css'
import PopOver from '../Tools/PopOver/PopOver'
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Selections:
// 1: Panel de Control
// 2: Solicitudes
// 3: Documentación
// 4: Soporte
// 5: Cuenta

// const user = {
//     'sub': 'auth0|6571495dfe17052e1a796138',
//     'email': 'tomyignacio.bailon@gmail.com',
// }

export default function NavBar({selection}) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const { isAuthenticated, 
        user, //comment for testing
        getAccessTokenSilently } = useAuth0();
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const getUser = (token, currentTry) => {
        axios.get(import.meta.env.VITE_API_ADDRESS+'/users/?email='+email, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setUserName(response.data.username);
        }).catch((error) => {
            if (currentTry < 3) {
                getUser(token, currentTry + 1);
            }
        })
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
        })
    }
    useEffect(() => {
        if (isAuthenticated) { 
            getToken();
       }
    }, [isAuthenticated]);
    useEffect(() => {
        if (token !== '' && token !== undefined && token !== null){
            getUser(token, 0);
        }
    }, [token]);
    return (
        <div className="navbar">
            <div className="navbarItem" id='logoContainer'>
                <img src="/LogoInventario3.png" className='NavBarLogo'></img>
                <a href="/">Kipin</a>
            </div>
            <div className="navbarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/dashboard');
                    }
                }>
                    Panel de Control
                </a>
                {selection == 1 && <div className="thinBlueLine"/>}
                {selection != 1 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/requests');
                    }
                }>
                    Solicitudes
                </a>
                {selection == 2 && <div className="thinBlueLine"/>}
                {selection != 2 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/');
                    }
                
                }>
                    Documentación
                </a>
                {selection == 3 && <div className="thinBlueLine"/>}
                {selection != 3 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                <a onClick={
                    (e) => {
                        e.preventDefault();
                        navigate('/');
                    }
                }>
                    Soporte
                </a>
                {selection == 4 && <div className="thinBlueLine"/>}
                {selection != 4 && <div className="thinGreyLine"/>}
            </div>
            <div className="navbarItem">
                {userName !== '' && <PopOver Buttons={
                    [
                        {text: 'Cuenta', color: 'blue', link: '/myprofile'},
                    ]
                } mainText={userName} Id={0} />}
                {selection == 5 && <div className="thinBlueLine"/>}
                {selection != 5 && <div className="thinGreyLine"/>}
            </div>
        </div>
    )
}