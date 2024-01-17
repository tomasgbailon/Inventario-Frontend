import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faGear } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EditOrg(){
    const navigate = useNavigate();
    const { isAuthenticated, 
        user, // comment for testing
        isLoading, getAccessTokenSilently } = useAuth0();
    const {organizationId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [originalAdmins, setOriginalAdmins] = useState([]);
    const [orgName, setOrgName] = useState('');
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [adminsModified, setAdminsModified] = useState(false);
    const [count, setCount] = useState(0);
    const [userId, setUserId] = useState(0);
    const [token, setToken] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const name = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (name.length > 15){
            setOrgNameError('El nombre de la organización no puede tener más de 20 caracteres');
        } else if (name.length < 5){
            setOrgNameError('El nombre de la organización no puede tener menos de 5 caracteres');
            //check alphanum with spaces
        } else if (!validNameRegex.test(name)){
            setOrgNameError('El nombre de la organización solo puede contener letras y números');
        } else{
            setOrgNameError('');
        }
        setOrgNameModified(e.target.value);
    };
    const handleWriteDesc = (e) => {
        const desc = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (desc.length > 200){
            setOrgDescriptionError('La descripción de la organización no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(desc)){
            setOrgDescriptionError('La descripción de la organización solo puede contener letras y números');
        }
        else{
            setOrgDescriptionError('');
        }
        setOrgDescriptionModified(e.target.value);
    };
    useEffect(() => {
        //if selectedUsers is different from originalAdmins, set adminsModified to true
        setAdminsModified(false);
        for (let i = 0; i < selectedUsers.length; i++) {
            const included = originalAdmins.filter((user) => {
                return user.userId === selectedUsers[i].userId;
            });
            if (included.length === 0) {
                setAdminsModified(true);
                break;
            }
        }
        for (let i = 0; i < originalAdmins.length; i++) {
            const included = selectedUsers.filter((user) => {
                return user.userId === originalAdmins[i].userId;
            });
            if (included.length === 0) {
                setAdminsModified(true);
                break;
            }
        }

    }, [selectedUsers]);
    const handleSubmit = (e) => {
        e.preventDefault();
        //for each user in selectedUsers but not in originalAdmins, send invite
        //for each user in originalAdmins but not in selectedUsers, remove admin permission
        if (adminsModified){
            for (let i = 0; i < selectedUsers.length; i++) {
                const included = originalAdmins.filter((user) => {
                    return user.userId === selectedUsers[i].userId;
                });
                if (included.length === 0) {
                    sendInvitation(token, selectedUsers[i].username, selectedUsers[i].email, 0);
                }
            }
            for (let i = 0; i < originalAdmins.length; i++) {
                const included = selectedUsers.filter((user) => {
                    return user.userId === originalAdmins[i].userId;
                });
                if (included.length === 0) {
                    removePermission(token, originalAdmins[i].userId, 0);
                }
            }
        }
        if (orgNameModified !== orgName || orgDescriptionModified !== orgDescription) {
            editOrg(token, 1);
        }
    };
    const deleteResult = (userId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.userId !== userId;
            });
            setSelectedUsers(newSelectedUsers);
        }
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
    const getOrg = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
            setOrgNameModified(response.data.name);
            setOrgDescription(response.data.description);
            setOrgDescriptionModified(response.data.description);
        }).catch((error) => {
            if (currentTry < 3) {
                getOrg(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const getAdmins = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/adminpermission/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setSelectedUsers(response.data);
            setOriginalAdmins(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getAdmins(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const editOrg = async (token, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/organizations/update/'+organizationId, {
            name: orgNameModified,
            description: orgDescriptionModified,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getOrg(token, 1);
            navigate('/dashboard');
        }).catch((error) => {
            if (currentTry < 3 && error.response.status === 500) {
                editOrg(token, currentTry+1);
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
            type: "admin",
            inventoryId: null,
            proyectId: null,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            //console.log(response);
        } ).catch((error) => {
            if (currentTry < 3 && error.response.status === 500) {
                sendInvitation(token, receptorName, receptorEmail, currentTry+1);
            } else {
                //console.log(error);
                getAdmins(token, 1);
            }
        })
    }
    const removePermission = async (token, receptorId, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/adminpermission/'+organizationId+'/'+receptorId, {
            status: 'inactive',
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            //console.log(response);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                removePermission(token, receptorId, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
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
            getToken();
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
            getOrg(token, 1);
            getAdmins(token, 1);
            setContentLoaded(true);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner') )
            ? <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{orgName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} />
                        {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} />
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        <label className="orgSearch">Maneja Administradores (opcional)</label>
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
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
                        </div>}
                        <button type="submit" className='submit-button' onClick={handleSubmit} disabled={
                            ((orgNameError !== '' || 
                            orgDescriptionError !== '') &&
                            adminsModified === false) ||
                            (orgNameModified === orgName &&
                            orgDescriptionModified === orgDescription &&
                            adminsModified === false)
                        }>Confirmar</button>
                    </div>
                </div>
                <Footer />
            </div>:
            <div className="dashboard">
                <h1>
                    Autenticando...
                </h1>
            </div>}
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}