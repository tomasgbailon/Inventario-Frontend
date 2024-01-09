import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function NewOrg(){
    const navigate = useNavigate();
    const { isAuthenticated, 
        user,
        isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [orgName, setOrgName] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [organizationId, setOrganizationId] = useState(0);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [count, setCount] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleSubmit = (e) => {
        e.preventDefault();
        createOrg(token, 0);
    }
    const handleWriteName = (e) => {
        const name = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (name.length > 20){
            setOrgNameError('El nombre de la organización no puede tener más de 20 caracteres');
        } else if (name.length < 5){
            setOrgNameError('El nombre de la organización no puede tener menos de 5 caracteres');
            //check alphanum with spaces
        } else if (!validNameRegex.test(name)){
            setOrgNameError('El nombre de la organización solo puede contener letras y números');
        } else{
            setOrgNameError('');
        }
        setOrgName(e.target.value);
    };
    const handleWriteDesc = (e) => {
        const desc = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (desc.length > 200){
            setOrgDescriptionError('La descripción de la organización no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(desc)){
            setOrgDescriptionError('La descripción de la organización solo puede contener letras y números');
        }
        else{
            setOrgDescriptionError('');
        }
        setOrgDescription(e.target.value);
    };
    const createOrg = async (token, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/organizations/create', {
            name: orgName,
            description: orgDescription === '' ? null : orgDescription,
            userId: userId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrganizationId(response.data.organizationId);
        }).catch((error) => {
            if (currentTry < 3 && error.response.status === 500) {
                createOrg(token, currentTry+1);
            } else {
                alert('Hubo un error al crear la organización');
                setOrgName('');
                setOrgDescription('');
                setOrgNameError('');
                setOrgDescriptionError('');
                setSelectedUsers([]);
            }
        })
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
        })
    }
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
                console.log(error);
            }
        });
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
            console.log(response);
        } ).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                sendInvitation(token, receptorName, receptorEmail, currentTry+1);
            } else {
                console.log(error);
                setSelectedUsers([]);
            }
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
                console.log(error);
            }
        })
    }   
    useEffect(() => {
        if (organizationId !== 0) {
            selectedUsers.forEach((user) => {
                sendInvitation(token, user.username, user.email, 0);
            });
            navigate('/dashboard');
        }
    }
    , [organizationId]);
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
            getUser(token, 0);
        }
    }, [token]);
    if (isLoading) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { (userId !== 0 || isAuthenticated) 
            ?<div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nueva Organización</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre de la organización" value={orgName} onChange={handleWriteName} />
                        {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" placeholder="¿Qué hace tu organización?" value={orgDescription} onChange={handleWriteDesc}/>
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        <label className="orgSearch">Agrega Administradores (opcional)</label>
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
                        <button type="submit" className='submit-button' disabled={
                            orgNameError !== '' || orgDescriptionError !== '' || orgName === ''
                        } onClick={handleSubmit}>Crear</button>
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