import './Edit/EditOrg.css'
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import { useState, useEffect } from 'react';
import {DashboardContext} from './Dashboard.jsx';
import Circle from '../Tools/Circle.jsx';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// const user = {
//     'sub': 'auth0|6571495dfe17052e1a796138',
//     'email': 'tomyignacio.bailon@gmail.com',
// }

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
    const authId = user?.sub.split('|')[1];
    const email = user?.email;
    const handleWriteName = (e) => {
        const name = e.target.value;
        if (name.length > 15){
            setNameError('El nombre de usuario no puede tener más de 15 caracteres');
        } else if (name.length < 5){
            setNameError('El nombre de usuario no puede tener menos de 3 caracteres');
            //check alphanum
        } else if (!name.match(/^[0-9a-zA-Z]+$/)){
            setNameError('El nombre de usuario solo puede contener letras y números');
        }
        else{

            setNameError('');
        }
        setModified(e.target.value);
    }
    const getUser = (token) => {
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
            console.log(error);
        })

    }
    const handleSubmit = (e) => {
        const token = getAccessTokenSilently(); //comment for testing
        //const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1lbjZIcEk5QnFnUXFRZm1YRmhIRiJ9.eyJpc3MiOiJodHRwczovL2Rldi15Y3hqMWtzaXd2bnE4d3QwLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTcxNDk1ZGZlMTcwNTJlMWE3OTYxMzgiLCJhdWQiOlsiaHR0cHM6Ly9kZXYteWN4ajFrc2l3dm5xOHd0MC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vZGV2LXljeGoxa3Npd3ZucTh3dDAudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMjE1MTIyNywiZXhwIjoxNzAyMjM3NjI3LCJhenAiOiJyQ2ZSRzlZRktoMzdMVDNqTmdDTDNURUVSNlNuOUQ3QyIsInNjb3BlIjoib3BlbmlkIn0.dVSr8WGRjXU4DR9R9bT6AHZCD12Y4d_qKMhWmVqc64MIgz9AliL6CmWQgQO6L96rqPMms-0JYW1HQ9OR3g3Ox7kKhJ61ZGxZGr4kbz21ijVQKU1RlT5sio3ogfOVH2u03SpqI3ZdGQ4tFAMlGKMOoxUwoLFHALcWk8zoAb_qCICOb3MkjDYPx55s7oOFgn9kGCBInew2-J4PqsEoJ6nMqI2xEVYV3Qh3DzKptH18ho3U6xy46pcaDHzIaTqs4PIP-yDzByFiirzXpywZo-rWJi16p84QVCvGkI_emAGeyNuXSl6z6EhUcq_UnD-_mDr0hN6-QIxMmjxlwQjGTQchGA';
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
                getUser(token);
            }).catch((error) => {
                alert('Error al actualizar el nombre de usuario');
            })
        }
    }
    useEffect(() => {
        if (isAuthenticated 
            //|| true // TODO: Cambiar el true por isAuthenticated
            ) { 
            const token = getAccessTokenSilently(); //comment for testing
            getUser(token); //comment for testing
            //getUser('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1lbjZIcEk5QnFnUXFRZm1YRmhIRiJ9.eyJpc3MiOiJodHRwczovL2Rldi15Y3hqMWtzaXd2bnE4d3QwLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTcxNDk1ZGZlMTcwNTJlMWE3OTYxMzgiLCJhdWQiOlsiaHR0cHM6Ly9kZXYteWN4ajFrc2l3dm5xOHd0MC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vZGV2LXljeGoxa3Npd3ZucTh3dDAudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwMjE1MTIyNywiZXhwIjoxNzAyMjM3NjI3LCJhenAiOiJyQ2ZSRzlZRktoMzdMVDNqTmdDTDNURUVSNlNuOUQ3QyIsInNjb3BlIjoib3BlbmlkIn0.dVSr8WGRjXU4DR9R9bT6AHZCD12Y4d_qKMhWmVqc64MIgz9AliL6CmWQgQO6L96rqPMms-0JYW1HQ9OR3g3Ox7kKhJ61ZGxZGr4kbz21ijVQKU1RlT5sio3ogfOVH2u03SpqI3ZdGQ4tFAMlGKMOoxUwoLFHALcWk8zoAb_qCICOb3MkjDYPx55s7oOFgn9kGCBInew2-J4PqsEoJ6nMqI2xEVYV3Qh3DzKptH18ho3U6xy46pcaDHzIaTqs4PIP-yDzByFiirzXpywZo-rWJi16p84QVCvGkI_emAGeyNuXSl6z6EhUcq_UnD-_mDr0hN6-QIxMmjxlwQjGTQchGA');
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);
    if(isLoading){
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { isAuthenticated 
            //|| true // TODO: Cambiar el true por isAuthenticated
            && 
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