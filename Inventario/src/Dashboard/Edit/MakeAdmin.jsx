import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { DashboardContext } from '../Dashboard'
import axios from 'axios'

export default function MakeAdmin(){
    const { organizationId, targetUserEmail } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [orgName, setOrgName] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [targetUserId, setTargetUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const cancelAction = () => {
        navigate('/administration/'+organizationId+'/');
    }
    const handleSubmit = async () => {
        await axios.post(import.meta.env.VITE_API_ADDRESS + '/adminpermission/makeadmin', {
            userId: targetUserId,
            organizationId: organizationId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/administration/'+organizationId+'/');
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
            } else {
                //console.log(error);
            }
        })
    }
    const getTargetUser = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/users/search?email='+targetUserEmail, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data[0].username);
            setTargetUserId(response.data[0].userId);
        }).catch((error) => {
            if (currentTry < 3) {
                getTargetUser(token, currentTry + 1);
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
            getTargetUser(token,0)
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner') )? <div className="new-org">
                <NavBar selection={1} />
                    <div className='new-org-content'>
                        <h1>¿Entregar administrador a {orgName}?</h1>
                        <div className='new-org-form'>
                            <button type='submit' className='submit-button' disabled={targetUserId === 0} onClick={
                                (e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }>Confirmar</button>
                            <button type='submit' className='submit-button red' onClick={cancelAction}>Cancelar</button>
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