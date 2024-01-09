import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function NewInv(){
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const [inventoryId, setInventoryId] = useState(0);
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [invName, setInvName] = useState('');
    const [invPrefix, setInvPrefix] = useState('');
    const [invLocation, setInvLocation] = useState('');
    const [invDescription, setInvDescription] = useState('');
    const [invPrefixError, setInvPrefixError] = useState('');
    const [invNameError, setInvNameError] = useState('');
    const [invLocationError, setInvLocationError] = useState('');
    const [invDescriptionError, setInvDescriptionError] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [count, setCount] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (event) => {
        const name = event.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (name.length > 20){
            setInvNameError('El nombre no puede exceder los 20 caracteres');
        } else if (name.length < 5) {
            setInvNameError('El nombre debe tener al menos 5 caracteres');
        } else if (!validNameRegex.test(name)) {
            setInvNameError('El nombre solo puede contener letras, números y espacios');
        } else {
            setInvNameError('');
        }
        setInvName(name);
    }
    const handleWritePrefix = (event) => {
        const prefix = event.target.value;
        if (prefix.length > 6){
            setInvPrefixError('El prefijo no puede exceder los 6 caracteres');
        } else if (prefix.length < 2) {
            setInvPrefixError('El prefijo debe tener al menos 2 caracteres');
        } else if (!/^[a-zA-Z0-9]*$/.test(prefix)) {
            setInvPrefixError('El prefijo solo puede contener letras y números');
        } else {
            setInvPrefixError('');
        }
        setInvPrefix(prefix);
    }
    const handleWriteLocation = (event) => {
        const location = event.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (location.length > 30){
            setInvLocationError('La ubicación no puede exceder los 30 caracteres');
        } else if (!validNameRegex.test(location)) {
            setInvLocationError('La ubicación solo puede contener letras, números y espacios');
        } else {
            setInvLocationError('');
        }
        setInvLocation(location);
    }
    const handleWriteDescription = (event) => {
        const description = event.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (description.length > 200){
            setInvDescriptionError('La descripción no puede exceder los 200 caracteres');
        } else if (!validNameRegex.test(description)) {
            setInvDescriptionError('La descripción solo puede contener letras, números y espacios');
        } else {
            setInvDescriptionError('');
        }
        setInvDescription(description);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (invNameError === '' && invPrefixError === '' && invLocationError === '' && invDescriptionError === '') {
            createInv(token, 0);
        }
    }
    const createInv = async (token, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/inventories/create', {
            organizationId: organizationId,
            name: invName,
            prefix: invPrefix.toUpperCase(),
            location: invLocation === '' ? null : invLocation,
            description: invDescription === '' ? null : invDescription,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setInventoryId(response.data.inventoryId);
        }).catch((error) => {
            if (currentTry < 3) {
                createInv(token, currentTry+1);
            } else {
                alert('Error al crear el inventario');
                setInvName('');
                setInvPrefix('');
                setInvLocation('');
                setInvDescription('');
                setInvNameError('');
                setInvPrefixError('');
                setInvLocationError('');
                setInvDescriptionError('');
                setSelectedUsers([]);
            }
        });
    }
    const sendInvitations = async (token, receptorName, receptorEmail, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/invitations/create', {
            inviterId: userId,
            organizationId: organizationId,
            receptorName: receptorName,
            receptorEmail: receptorEmail,
            type: 'edit',
            inventoryId: inventoryId,
            proyectId: null,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                sendInvitations(token, receptorName, receptorEmail, currentTry+1);
            } else {
                console.log(error);
                setSelectedUsers([]);
            }
        });
    }
    const deleteResult = (userId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.userId !== userId;
            });
            setSelectedUsers(newSelectedUsers);
        }
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
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
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
                console.log(error);
            }
        });
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
    useEffect(() => {
        if (userId !== 0) {
            getAccessLevel(token, 0)
        }
    }, [userId]);
    useEffect(() => {
        if (inventoryId !== 0) {
            selectedUsers.forEach((user) => {
                sendInvitations(token, user.username, user.email, 0);
            });
        navigate('/organization/'+organizationId+'/');
        }
    }, [inventoryId]);
    if (isLoading) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { ((userId !== 0 || isAuthenticated) && (accessLevel === 'owner' || accessLevel === 'admin') ) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nuevo Inventario</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre del inventario" value={invName} onChange={handleWriteName}/>
                        {invNameError !== '' && <label id='red-small-font'>{invNameError}</label>}
                        <label className="orgName">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Prefijo del inventario" value={invPrefix} onChange={handleWritePrefix}/>
                        {invPrefixError !== '' && <label id='red-small-font'>{invPrefixError}</label>}
                        <label className="orgName">Ubicación (opcional)</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Ubicación del inventario" value={invLocation} onChange={handleWriteLocation}/>
                        {invLocationError !== '' && <label id='red-small-font'>{invLocationError}</label>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" placeholder="Describe tu inventario" value={invDescription} onChange={handleWriteDescription}/>
                        {invDescriptionError !== '' && <label id='red-small-font'>{invDescriptionError}</label>}
                        <label className="orgSearch">Agrega editores (opcional)</label>
                        <label className="orgSearch" id='small-font'>*Los administradores ya cuentan con permisos de edición</label>
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
                            invNameError !== '' || 
                            invPrefixError !== '' || 
                            invLocationError !== '' || 
                            invDescriptionError !== '' || 
                            invName === '' || 
                            invPrefix === ''
                        }>Crear</button>
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