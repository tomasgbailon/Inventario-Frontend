import './NavBar.css'
import PopOver from '../Tools/PopOver/PopOver'
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';

// Selections:
// 1: Panel de Control
// 2: Solicitudes
// 3: Documentación
// 4: Soporte
// 5: Cuenta

export default function NavBar({selection}) {
    const [userName, setUserName] = useState('');
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const userId = user?.sub.split('|')[1];
    const getUser = (token) => {
    axios.get('https://back.outer.cl/users/?authId='+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setUserName(response.data.username);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        if (isAuthenticated) {
            const token = getAccessTokenSilently();
            getUser(token);
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);
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
                <a href='/requests'>
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
                {JSON.stringify(user)}
                <PopOver Buttons={
                    [
                        {text: 'Cuenta', color: 'blue', link: '/myprofile'},
                        {text: 'Cerrar Sesión', color: 'red', link: '/'},
                    ]
                } mainText={userName} Id={0} />
                {selection == 5 && <div className="thinBlueLine"/>}
                {selection != 5 && <div className="thinGreyLine"/>}
            </div>
        </div>
    )
}