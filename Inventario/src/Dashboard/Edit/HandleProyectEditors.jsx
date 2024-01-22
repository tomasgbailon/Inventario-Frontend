import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function HandleProyectEditors(){
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const {organizationId, proyectId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [orgName, setOrgName] = useState('');
    const [count, setCount] = useState(0);
    const [userId, setUserId] = useState(0);
    const [token, setToken] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [editorsModified, setEditorsModified] = useState(false);
    const [originalEditors, setOriginalEditors] = useState([]);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editorsModified) {
            for (let i = 0; i < selectedUsers.length; i++) {
                const included = originalEditors.filter((user) => {
                    return user.userId === selectedUsers[i].userId;
                });
                if (included.length === 0) {
                    sendInvitation(token, selectedUsers[i].username, selectedUsers[i].email, 0);
                }
            }
            for (let i = 0; i < originalEditors.length; i++) {
                const included = selectedUsers.filter((user) => {
                    return user.userId === originalEditors[i].userId;
                });
                if (included.length === 0) {
                    removePermission(token, originalEditors[i].userId, 0);
                }
            }
        }
        getEditors(token, 1);
        navigate('/proyects/'+organizationId+'/');
    };
    const deleteResult = (userId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.userId !== userId;
            });
            setSelectedUsers(newSelectedUsers);
        }
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
                getUser(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const getUsers = async (string, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/users/search?email='+string, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setSearchResults(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getUsers(string, currentTry+1);
            } else {
                //console.log(error);
            }
        });
    }  
    const getInv = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/proyects/'+organizationId+'/'+proyectId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    
    }
    const getEditors = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/editpermission/proy/'+organizationId+'/'+proyectId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            //console.log(response.data);
            setSelectedUsers(response.data);
            setOriginalEditors(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getEditors(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const sendInvitation = async (token, receptorName, receptorEmail, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/invitations/create', {
            inviterId: userId,
            organizationId: organizationId,
            receptorName: receptorName,
            receptorEmail: receptorEmail,
            type: "edit",
            inventoryId: null,
            proyectId: proyectId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
        } ).catch((error) => {
            if (currentTry < 3 && error.response.status === 500) {
                sendInvitation(token, receptorName, receptorEmail, currentTry+1);
            } else {
            }
        })
    }
    const removePermission = async (token, receptorId, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/editpermission/proy/'+organizationId+'/'+proyectId+'/'+receptorId, {
            status: 'inactive',
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                removePermission(token, receptorId, currentTry+1);
            } else {
            }
        })
    }
    const getAccessLevel = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/auth/'+organizationId+'/proy/'+proyectId, {
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
        setEditorsModified(false);
        for(let i = 0; i < selectedUsers.length; i++){
            const included = originalEditors.filter((user) => {
                return user.userId === selectedUsers[i].userId && 
                user.username === selectedUsers[i].username && 
                user.email === selectedUsers[i].email;
            });
            if (included.length === 0) {
                setEditorsModified(true);
                break;
            }    
        }
        for (let i = 0; i < originalEditors.length; i++){
            const included = selectedUsers.filter((user) => {
                return user.userId === originalEditors[i].userId && 
                user.username === originalEditors[i].username && 
                user.email === originalEditors[i].email;
            });
            if (included.length === 0) {
                setEditorsModified(true);
                break;
            }
        }
    }, [selectedUsers]);
    useEffect(() => {
        if (searchTerm !== '' && searchTerm.length > 2) {
            getUsers(searchTerm, 0);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);
    useEffect(() => {
        const included = selectedUsers.filter((user) => {
            return user.userId === clickedResult.userId && 
            user.username === clickedResult.username && 
            user.email === clickedResult.email;
        });
        if (clickedResult.username !== undefined && included.length === 0) {
            setSelectedUsers([...selectedUsers, clickedResult]);
        }
    }, [clickedResult, count]);
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
        if (token !== '' && token !== undefined && token !== null) {
            getUser(token,0);
        }
    }, [token])
    useEffect(() => {
        if (userId !== 0){
            getAccessLevel(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (accessLevel !== '') {
            getInv(token, 1);
            getEditors(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner') ) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Editores de {orgName}</h1>
                    <div className="new-org-form">
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 ?
                        <div className="orgSearch-frame">
                            <div className='org-searchEntry' id='greyHeader'> Seleccionados </div>
                            {
                                selectedUsers.map(
                                    (user, index) => {
                                        return (
                                            <div className='org-searchEntry'>
                                                <div className='org-searchResult' key={index}>
                                                    <div id='bold'>{user.name}</div>&nbsp;&nbsp;&nbsp;{user.email}
                                                </div>
                                                <FontAwesomeIcon className='trashIcon' onClick={deleteResult(user.userId)} icon={faTrash}/>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>:
                        <div className="orgSearch-frame">
                            <div className='org-searchEntry' id='greyHeader'> Seleccionados </div>
                            <div className='org-searchEntry'> No hay editores seleccionados </div>
                        </div>}
                        <button type="submit" className='submit-button' onClick={handleSubmit} disabled={
                            (editorsModified === false)
                        }>Confirmar</button>
                        <button type="submit" className='submit-button red' onClick={() => {navigate('/proyects/'+organizationId+'/')}}>Cancelar</button>
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
        </SearchContext.Provider>
    )
}