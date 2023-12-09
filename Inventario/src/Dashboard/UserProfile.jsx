import './Edit/EditOrg.css'
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import { useState, useEffect } from 'react';
import {DashboardContext} from './Dashboard.jsx';
import Circle from '../Tools/Circle.jsx';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';

function getRandColor(char){
    // Map a character from the alphabet to a random color
    const colors = [
        '#21c44d','#cf2017','#c9690e',
        '#e6a519','#98c904','#04c91e',
        '#0ccc69','#0cccaf','#0cb2cc',
        '#0c79cc','#0c39cc','#360ccc',
        '#730ccc','#b60ccc','#cc0ca6',
        '#cc0c5c','#cc0c1c', '#cc3a0c',
    ]
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (char){
        return colors[alphabet.indexOf(char)%colors.length];
    }
}

export default function UserProfile(){
    const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [userName, setUserName] = useState('');
    const [modified, setModified] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const userId = user?.sub.split('|')[1];
    const handleWriteName = (e) => {
        setModified(e.target.value);
    }
    const getUser = (token) => {
        axios.get('https://back.outer.cl/users/?authId='+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setUserName(response.data.username);
            setModified(response.data.username);
            setUserEmail(response.data.email);
        })

    }
    useEffect(() => {
        if (isAuthenticated) {
            const token = getAccessTokenSilently();
            getUser(token);
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);
    if(isLoading){
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { isAuthenticated &&
            <div className="new-org">
                <NavBar selection={5}/>
                <div className="new-org-content">
                    <div className='space'/>
                    {userName !== '' &&
                    <Circle color={getRandColor(userName[0])} size='big' text={userName[0]} />}
                    <h1>{userName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={modified} onChange={handleWriteName} />
                        <label className="orgDescription">Correo Electrónico</label>
                        <input type='text' className="new-org-input" id="orgName" value={userEmail} disabled />
                        <button type="submit" className='submit-button'>Confirmar</button>
                    </div>
                    <div className="final-buttons">
                        <button className="final-button">Cambiar Contraseña</button>
                        <button className="final-button">Cerrar Sesión</button>
                        <button className="final-button" id='delete'>Eliminar Cuenta</button>
                    </div>
                </div>
                <Footer/>
            </div>}
        </DashboardContext.Provider>

    )
}