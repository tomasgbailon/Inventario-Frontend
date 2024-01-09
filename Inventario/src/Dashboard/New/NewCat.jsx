import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import Select from 'react-select';

export default function NewCat(){
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [catName, setCatName] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [catNameError, setCatNameError] = useState('');
    const [catPrefixError, setCatPrefixError] = useState('');
    const [inventories, setInventories] = useState([]);
    const [accessLevel, setAccessLevel] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (event) => {
        const name = event.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (name.length > 25){
            setCatNameError('El nombre no puede exceder los 25 caracteres');
        } else if (name.length < 5) {
            setCatNameError('El nombre debe tener al menos 5 caracteres');
        } else if (!validNameRegex.test(name)) {
            setCatNameError('El nombre solo puede contener letras, números y espacios');
        } else {
            setCatNameError('');
        }
        setCatName(name);
    }
    const handleWritePrefix = (event) => {
        const prefix = event.target.value;
        if (prefix.length > 6){
            setCatPrefixError('El prefijo no puede exceder los 6 caracteres');
        } else if (prefix.length < 2) {
            setCatPrefixError('El prefijo debe tener al menos 2 caracteres');
        } else if (!/^[a-zA-Z0-9]*$/.test(prefix)) {
            setCatPrefixError('El prefijo solo puede contener letras y números');
        } else {
            setCatPrefixError('');
        }
        setCatPrefix(prefix);
    }
    const handleSubmit = async () => {
        for (let i = 0; i < selectedUsers.length; i++) {
            await createCategory(selectedUsers[i].value, token, 0);
        }
        navigate('/organization/'+organizationId+'/');
    }
    const createCategory = async (inventoryId, token, currentTry) => {
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/categories/create', {
            name: catName,
            prefix: catPrefix,
            inventoryId: inventoryId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                createCategory(inventoryId, token, currentTry+1);
            } else {
                alert('Hubo un error al crear la categoría para' + inventories.find((inventory) => inventory.inventoryId === inventoryId).name);
            }
        })
    }
    const getInventories = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setInventories(response.data.edit);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getInventories(token, currentTry+1);
            }
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
        if (token !== '' && token !== undefined && token !== null) {
            getUser(token, 0);
        }
    }, [token])
    useEffect(() => {
        if (userId !== 0) {
            getAccessLevel(token, 0);
        }
    }, [userId])
    useEffect(() => {
        if (accessLevel !== '') {
            getInventories(token, 0);
        }
    }, [accessLevel])
    useEffect(() => {
        console.log(selectedUsers);
    }, [selectedUsers])
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {   ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner' || accessLevel === 'edit')) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nueva Categoría</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre de la categoría" value={catName} onChange={handleWriteName}/>
                        { catNameError !== '' && <label  id='red-small-font'>{catNameError}</label> }
                        <label className="orgName">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Prefijo de la categoría (debe ser único)" value={catPrefix} onChange={handleWritePrefix}/>
                        { catPrefixError !== '' && <label  id='red-small-font'>{catPrefixError}</label> }
                        <label className="orgSearch">Agrega Inventarios (opcional)</label>
                        <label className="orgSearch" id='small-font'>*Si se deja en blanco se agregará a todos los inventarios</label>
                        { inventories.length > 0  && 
                        <Select 
                            options={
                                inventories.map((inventory) => {
                                    return {
                                        value: inventory.inventoryId,
                                        label: inventory.name,
                                    }
                                })
                            }
                            isMulti
                            className="orgSearch"
                            classNamePrefix="orgSearch"
                            placeholder="Selecciona inventarios"
                            styles={
                                {
                                    control: (base, state) => ({
                                        ...base,
                                        fontFamily: 'Outfit Light',
                                        fontSize: '1.2em',
                                        borderRadius: '0.5em',
                                        border: 'solid 1.5px rgba(82, 82, 82, 0.729);',
                                        height: 'auto',
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        fontFamily: 'Outfit Light',
                                        fontSize: '1.2em',
                                        color: 'rgb(42, 42, 42)',
                                    }),
                                }
                            }
                            components={
                                //message for no options with font family Outfit Light
                                {
                                    NoOptionsMessage: ({ children, ...props }) => (
                                        <div
                                            {...props}
                                            style={{
                                                fontFamily: 'Outfit Light',
                                                fontSize: '1em',
                                                textAlign: 'center',
                                            }}
                                        >
                                            No hay inventarios disponibles
                                        </div>
                                    ),
                                }
                                
                            }
                            onChange={(e) => setSelectedUsers(e)}
                        />
                        }
                        <button type="submit" className='submit-button' disabled={
                            catNameError !== '' || catPrefixError !== '' || catName === '' || catPrefix === '' || selectedUsers.length === 0
                        } onClick={
                            (e) => {
                                e.preventDefault();
                                handleSubmit();
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
    )
}