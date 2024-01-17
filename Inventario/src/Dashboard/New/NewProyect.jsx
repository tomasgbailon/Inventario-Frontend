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

export default function NewProy(){
    const {organizationId} = useParams();
    const navigate = useNavigate();
    const [proyectId, setProyectId] = useState(0);
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [accessLevel, setAccessLevel] = useState('');
    const [proyName, setProyName] = useState('');
    const [proyStatus, setProyStatus] = useState('');
    const [proyBudget, setProyBudget] = useState(0);
    const [proyDescription, setProyDescription] = useState('');
    const [proyNameError, setProyNameError] = useState('');
    const [proyBudgetError, setProyBudgetError] = useState('');
    const [proyDescriptionError, setProyDescriptionError] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [count, setCount] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteProyName = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 20){
            setProyNameError('El nombre del proyecto no puede ser mayor a 20 caracteres');
        } else if (value.length < 5){
            setProyNameError('El nombre del proyecto no puede ser menor a 5 caracteres');
        } else if (!validNameRegex.test(value)){
            setProyNameError('El nombre del proyecto solo puede contener letras y números');
        } else {
            setProyNameError('');
        }
        setProyName(value);
    }
    const handleWriteProyStatus = (e) => {
        const value = e.target.value;
        setProyStatus(value);
    }
    const handleWriteProyBudget = (e) => {
        const value = e.target.value.substring(1);
        // if not a number 
        if (isNaN(value)) {
            setProyBudgetError('El presupuesto debe ser un número');
        } else if (value.length > 15) {
            setProyBudgetError('El presupuesto no puede ser mayor a 15 dígitos');
        } else if (value.length === 0) {
            setProyBudgetError('El presupuesto no puede estar vacío');
        } else {
            setProyBudgetError('');
        }
        setProyBudget(value);
    }
    const handleWriteDescription = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 200){
            setProyDescriptionError('La descripción no puede ser mayor a 200 caracteres');
        } else if(!validNameRegex.test(value)){
            setProyDescriptionError('La descripción solo puede contener letras y números');
        } else {
            setProyDescriptionError('');
        }
        setProyDescription(value);
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
                //console.log(error);
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
                //console.log(error);
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
    const handleSubmit = (event) => {
        event.preventDefault();
        if (proyNameError === '' && proyBudgetError === '' && proyDescriptionError === '') {
            createProy(token, 0);
        }
    }
    const createProy = async (token, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/proyects/create', {
            name: proyName,
            status: proyStatus,
            budget: proyBudget,
            description: proyDescription === '' ? null : proyDescription,
            organizationId: parseInt(organizationId),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setProyectId(response.data.proyectId);
        }).catch((error) => {
            if (currentTry < 3) {
                createProy(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const sendInvitations = async (token, receptorName, receptorEmail, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/invitations/create', {
            inviterId: userId,
            organizationId: organizationId,
            receptorName: receptorName,
            receptorEmail: receptorEmail,
            type: 'edit',
            inventoryId: null,
            proyectId: proyectId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                sendInvitations(token, receptorName, receptorEmail, currentTry+1);
            } else {
                //console.log(error);
                setSelectedUsers([]);
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
        if (proyectId !== 0) {
            selectedUsers.forEach((user) => {
                sendInvitations(token, user.username, user.email, 0);
            });
            navigate('/proyects/'+organizationId+'/');
        }
    }, [proyectId]);
    if (isLoading) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {   ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner')) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nuevo Proyecto</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre del proyecto" value={proyName} onChange={handleWriteProyName}/>
                        {proyNameError !== '' && <div id='red-small-font'>{proyNameError}</div>}
                        <label className='orgStatus'>Estado</label>
                        <select className='new-org-input' id='orgStatus' value={proyStatus} onChange={handleWriteProyStatus}>
                            <option value='' id='option' disabled>Selecciona una opción</option>
                            <option value='active'>Activo</option>
                            <option value='inactive'>Inactivo</option>
                        </select>
                        <label className='orgBudget'>Presupuesto</label>
                        <input className="new-org-input" id="orgBudget" placeholder="Presupuesto" value={'$'+proyBudget} onChange={handleWriteProyBudget}/>
                        {proyBudgetError !== '' && <div id='red-small-font'>{proyBudgetError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" placeholder="Describe tu proyecto" value={proyDescription} onChange={handleWriteDescription} />
                        {proyDescriptionError !== '' && <div id='red-small-font'>{proyDescriptionError}</div>}
                        <label className="orgSearch">Agrega Editores (opcional)</label>
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
                        <button type="submit" className='submit-button' disabled={
                            proyNameError !== '' ||
                            proyBudgetError !== '' ||
                            proyDescriptionError !== '' ||
                            proyName === '' ||
                            proyBudget === '' ||
                            proyStatus === ''
                        } onClick={
                            (e) => {
                                handleSubmit(e);
                            }
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