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
    const { isAuthenticated, 
        user, //comment for testing
        isLoading, getAccessTokenSilently, logout } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [modified, setModified] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [nameError, setNameError] = useState('');
    const [token, setToken] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const name = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (name.length > 15){
            setNameError('El nombre de usuario no puede tener más de 15 caracteres');
        } else if (name.length < 3){
            setNameError('El nombre de usuario no puede tener menos de 3 caracteres');
            //check alphanum with spaces
        } else if (!validNameRegex.test(name)){
            setNameError('El nombre de usuario solo puede contener letras y números');
        }
        else{
            setNameError('');
        }
        setModified(e.target.value);
    }
    const getUser = (token,currentTry) => {
        axios.get(import.meta.env.VITE_API_ADDRESS+'/users/?email='+email, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setUserName(response.data.username);
            setModified(response.data.username);
            setUserEmail(response.data.email);
            setUserId(response.data.userId);
        }).catch((error) => {
            if (currentTry < 3){
                getUser(token, currentTry+1);
            } else {
                alert('Error al cargar el perfil de usuario');
            }
        })

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modified !== userName){
            const data = {
                'username': modified,
                'email': userEmail,
            }
            axios.put(import.meta.env.VITE_API_ADDRESS+'/users/update/'+userId, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Identity: authId,
                },
            }).then((response) => {
                getUser(token, 0);
            }).catch((error) => {
                alert('Error al actualizar el nombre de usuario');
            })
        }
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
        })
    }
    useEffect(() => {
        if (isAuthenticated) { 
            const token = getToken();
        } else {
            const authId = localStorage.getItem('authId');
            setAuthId(authId);
            const email = localStorage.getItem('email');
            setEmail(email);
            const token = localStorage.getItem('token');
            setToken(token);
        }
    }, [isAuthenticated]);
    useEffect(() => {
        if (token !== '' && token !== undefined && token !== null){
            getUser(token, 0);
        }
    }, [token])
    if(isLoading ){
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {(userId !== 0 || isAuthenticated) && 
            <div className="new-org">
                <NavBar selection={5}/>
                <div className="new-org-content">
                    <div className='space'/>
                    {userName !== '' &&
                    <>
                    <Circle color={getRandColor(userName[0])} size='big' text={userName[0]} />
                    <h1>{userName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={modified} onChange={handleWriteName} />
                        {nameError && <div id='red-small-font'>*{nameError}</div>}
                        <label className="orgDescription">Correo Electrónico</label>
                        <input type='text' className="new-org-input" id="orgName" value={userEmail} disabled />
                        <button type="submit" className='submit-button' onClick={handleSubmit} disabled={nameError !== '' || modified === userName}>Confirmar</button>
                    </div>
                    <div className="final-buttons">
                        {false && <button className="final-button">Cambiar Contraseña</button>}
                        <button className="final-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin }}) }>Cerrar Sesión</button>
                        {false && <button className="final-button" id='delete'>Eliminar Cuenta</button>}
                    </div>
                    </>}
                </div>
                <Footer/>
            </div>}
        </DashboardContext.Provider>

    )
}