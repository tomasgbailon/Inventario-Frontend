import './NewRequest.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function NewRequest(){
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(0);
    const [selectedType, setSelectedType] = useState(0); // 1: Admin, 2: Editor, 3: Viewer
    const [selectedInv, setSelectedInv] = useState(0);
    const [selectedProyect, setSelectedProyect] = useState(0);
    const [createdOrgs, setCreatedOrgs] = useState([]);
    const [administredOrgs, setAdministredOrgs] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [proyects, setProyects] = useState([]);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const [count, setCount] = useState(0);
    const getType = (type) => {
        switch(type){
            case '1':
                return 'admin';
            case '2':
                return 'edit';
            case '3':
                return 'view';
            case '4':
                return 'edit';
            case '5':
                return 'view';
            default:
                return null;
        }
    }
    const handleSelectedType = (event) => {
        setSelectedType(event.target.value);
    }
    const handleSelectedOrg = (event) => {
        setSelectedOrg(event.target.value);
    }
    const handleSelectedInv = (event) => {
        setSelectedInv(event.target.value);
    }
    const handleSelectedProyect = (event) => {
        setSelectedProyect(event.target.value);
    }
    const handleSubmit = async () => {
        const data = {
            inviterId: userId,
            receptorName: selectedUsers[0].username,
            receptorEmail: selectedUsers[0].email,
            type: getType(selectedType),
            organizationId: selectedOrg,
            inventoryId: parseInt(selectedInv) === 0 ? null : parseInt(selectedInv),
            proyectId: parseInt(selectedProyect) === 0 ? null : parseInt(selectedProyect),

        }
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/invitations/create', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/dashboard');
        }).catch((error) => {
            alert(error);
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
    const getCreatedOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/created/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setCreatedOrgs(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getCreatedOrgs(token, currentTry + 1);
            }
        })
    }
    const getAdministredOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/admin/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setAdministredOrgs(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getAdministredOrgs(token, currentTry + 1);
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
    const getInventories = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+selectedOrg, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            if(response.data.edit.length === 0){
                setInventories([{inventoryId: 0, name: 'No hay inventarios disponibles'}])
            } else {
                setInventories(response.data.edit);
            }
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getInventories(token, currentTry+1);
            }
        })
    
    }
    const getProyects = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/proyects/'+selectedOrg, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            //console.log(response.data);
            if(response.data.edit.length === 0){
                setProyects([{proyectId: 0, name: 'No hay proyectos disponibles'}])
            } else {
                setProyects(response.data.edit);
            }
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getProyects(token, currentTry+1);
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
        if (clickedResult.userId!== undefined && selectedUsers.length === 0) {
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
            getCreatedOrgs(token, 0);
            getAdministredOrgs(token, 0);
        }
    }, [userId]);
    useEffect(() => {
        if (selectedOrg !== 0) {
            setSelectedUsers([]);
            setSelectedType(0);
        }
    }, [selectedOrg]);
    useEffect(() => {
        if (selectedOrg !== 0 && (selectedType === '2' || selectedType === '3')) {
            getInventories(token, 0);
        } else if (selectedOrg !== 0 && (selectedType === '4' || selectedType === '5')) {
            getProyects(token, 0);
        } else if (selectedOrg !== 0 && selectedType === '1') {
            setSelectedInv(0);
            setSelectedProyect(0);
        }
    }, [selectedType, selectedOrg]);
    useEffect(() => {
        if(selectedInv !== 0){
            setSelectedProyect(0);
        }
    }, [selectedInv]);
    useEffect(() => {
        if(selectedProyect !== 0){
            setSelectedInv(0);
        }
    }, [selectedProyect]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {(userId !== 0 || isAuthenticated) ? <div className='new-req'>
                <NavBar selection={2}/>
                <div className='new-req-content'>
                    <h1>Nueva Solicitud</h1>
                    <div className='new-req-form'>
                        <label htmlFor="org-select">Organización</label>
                        <select name="org-select" id="org-select" value={selectedOrg} onChange={handleSelectedOrg}>
                            <option value={0} disabled>Selecciona una organización</option>
                            {
                                [...createdOrgs, ...administredOrgs].map((org) => {
                                    return <option value={org.organizationId}>{org.name}</option>
                                })
                            }
                        </select>
                        <label htmlFor="perm-type">Tipo de permiso</label>
                        <select name="perm-type" id="perm-type" value={selectedType} onChange={handleSelectedType}>
                            <option value={0}>Selecciona un tipo de permiso</option>
                            <option value={1}>Administrador</option>
                            <option value={2}>Editor de inventario</option>
                            <option value={3}>Visualizador de inventario</option>
                            <option value={4}>Editor de proyecto</option>
                            <option value={5}>Visualizador de proyecto</option>
                        </select>
                        {(selectedType === '3' || selectedType === '2') && selectedOrg > 0 && <><label htmlFor="inv-select">Kipin</label>
                        <select name="inv-select" id="inv-select" value={selectedInv} onChange={handleSelectedInv}>
                            <option value={0} disabled>Selecciona un inventario</option>
                            {
                                inventories.map((inv) => {
                                    return <option value={inv.inventoryId}>{inv.name}</option>
                                })
                            }
                        </select></>}
                        {
                            (selectedType === '4' || selectedType === '5') && selectedOrg > 0 &&
                            <><label htmlFor="inv-select">Proyecto</label>
                            <select name="inv-select" id="inv-select" value={selectedProyect} onChange={handleSelectedProyect}>
                                <option value={0} disabled>Selecciona un proyecto</option>
                                {
                                    proyects.map((inv) => {
                                        return <option value={inv.proyectId}>{inv.name}</option>
                                    })
                                }
                            </select></>
                        }
                        <label htmlFor="perm-name">Correo del receptor</label>
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
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
                            selectedOrg === 0 || selectedType === 0 || selectedUsers.length === 0 || (inventories.length === 1 && inventories[0].inventoryId === 0) 
                            || (proyects.length === 1 && proyects[0].proyectId === 0) || (selectedType !== '1' && selectedInv === 0 && selectedProyect === 0)
                        }>Crear</button>
                    </div>
                </div>
                < Footer />
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