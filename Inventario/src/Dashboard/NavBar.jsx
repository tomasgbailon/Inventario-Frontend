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

// const user = {
//     'sub': 'auth0|6571495dfe17052e1a796138',
//     'email': 'tomyignacio.bailon@gmail.com',
// }

export default function NavBar({selection}) {
    const [userName, setUserName] = useState('');
    const { isAuthenticated, 
        user, //comment for testing
        getAccessTokenSilently } = useAuth0();
    const userId = user?.sub.split('|')[1];
    const email = user?.email;
    const getUser = (token) => {
        axios.get(import.meta.env.VITE_BACK_ADDRESS+'/users/?email='+email, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: userId,
            },
        }).then((response) => {
            setUserName(response.data.username);
        })
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
                {userName !== '' && <PopOver Buttons={
                    [
                        {text: 'Cuenta', color: 'blue', link: '/myprofile'},
                        {text: 'Cerrar Sesión', color: 'red', link: '/'},
                    ]
                } mainText={userName} Id={0} />}
                {selection == 5 && <div className="thinBlueLine"/>}
                {selection != 5 && <div className="thinGreyLine"/>}
            </div>
        </div>
    )
}