// import './DeleteOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { DashboardContext } from '../Dashboard'
import axios from 'axios'

export default function DeleteOrg(){
    const { organizationId } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [orgName, setOrgName] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [orgNameInput, setOrgNameInput] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleSubmit = async () => {
        if (orgNameInput !== orgName) {
            return;
        }
        await axios.delete(import.meta.env.VITE_API_ADDRESS+'/organizations/delete/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/dashboard');
        }).catch((error) => {
            //console.log(error);
        })
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
        })
    }
    const getUser = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/users/?email='+email, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setUserId(response.data.userId);
        }).catch((error) => {
            if (currentTry < 3) {
                getUser(token, currentTry + 1);
            }
        })
    }
    const getOrg = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getOrg(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const getAccessLevel = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/auth/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setAccessLevel(response.data.permission);
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getAccessLevel(token, currentTry+1);
            }
        })
    }
    useEffect(() => {
        if (isAuthenticated) {
            const token = getToken();
            setToken(token);
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
        if (token !== '' && token !== undefined && token !== null ) { 
            getUser(token, 1);
        }
    }, [token]);
    useEffect(() => {
        if (userId !== 0){
            getAccessLevel(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (accessLevel !== '') {
            getOrg(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner') )?
                <div className="new-org">
                <NavBar selection={1} />
                    <div className='new-org-content'>
                        <h1>¿Eliminar {orgName}?</h1>
                        <div id='small-font'>IMPORTANTE: Esta acción eliminará todos los inventarios contenidos en {orgName}</div>
                        <div className='new-org-form'>
                            <label className='orgName' >Escribe el nombre de la organización para confirmar</label>
                            <input className="new-org-input" id="orgName" type='text' placeholder='Escribe el nombre aquí' value={orgNameInput} onChange={(e) => {setOrgNameInput(e.target.value);}}/>
                            <button type='submit' className='submit-button red' disabled={orgNameInput !== orgName || orgNameInput === ''} onClick={handleSubmit}>Eliminar</button>
                            <button type='submit' className='submit-button' onClick={
                                (e) => {
                                    e.preventDefault();
                                    navigate('/dashboard');
                                }
                            }>Cancelar</button>
                        </div>
                    </div>
                <Footer />
                </div>:
                <div className="dashboard">
                    <h1>
                        Autenticando...
                    </h1>
                </div>
            }
        </DashboardContext.Provider>
    )
}