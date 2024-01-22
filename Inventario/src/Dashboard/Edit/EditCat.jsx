import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import Select from 'react-select';


export default function EditCat(){
    const navigate = useNavigate();
    const {organizationId, inventoryId, categoryId} = useParams();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [catNameError, setCatNameError] = useState('');
    const [catName, setCatName] = useState('');
    const [catNameModified, setCatNameModified] = useState('');
    const [catPrefix, setCatPrefix] = useState('');
    const [inventories, setInventories] = useState([]);
    const [accessLevel, setAccessLevel] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (event) => {
        const name = event.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (name.length > 25){
            setCatNameError('El nombre no puede exceder los 25 caracteres');
        } else if (name.length < 5) {
            setCatNameError('El nombre debe tener al menos 5 caracteres');
        } else if (!validNameRegex.test(name)){
            setCatNameError('El nombre solo puede contener letras, números y espacios');
        } else {
            setCatNameError('');
        }
        setCatNameModified(name);
    }
    const handleSubmit = () => {
        if(accessLevel === 'owner' || accessLevel === 'admin'){
            for (let i = 0; i < selectedUsers.length; i++) {
                editCategory(token, selectedUsers[i].value[0], selectedUsers[i].value[1], 0);
            }
        } else {
            editCategory(token, inventoryId, categoryId, 0);
        }
        navigate('/inventory/'+organizationId+'/'+inventoryId+'/');
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
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/auth/'+organizationId+'/inv/'+inventoryId, {
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
    const getInventories = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/categories/inventories/'+organizationId+'/'+categoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setInventories(response.data);
            //console.log(response.data);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getInventories(token, currentTry+1);
            }
        })
    
    }
    const getCategory = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/categories/'+inventoryId+'/'+categoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setCatName(response.data.name);
            setCatNameModified(response.data.name);
            setCatPrefix(response.data.prefix);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getCategory(token, currentTry+1);
            }
        })
    }
    const editCategory = async (token, inventoryId, categoryId, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/categories/'+inventoryId+'/'+categoryId, {
            name: catNameModified,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                editCategory(token, currentTry+1);
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
        if (userId !== 0) {
            getAccessLevel(token, 0);
        }
    }, [userId])
    useEffect(() => {
        if (accessLevel !== '') {
            getCategory(token, 0);
            if (accessLevel === 'owner' || accessLevel === 'admin') {
                getInventories(token, 0);
            }
        }
    }, [accessLevel])
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {    ((userId !== 0 || isAuthenticated) && (accessLevel === 'edit' || accessLevel === 'admin' || accessLevel === 'owner')) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Editar {catName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={catNameModified} onChange={handleWriteName} />
                        { catNameError !== '' && <label  id='red-small-font'>{catNameError}</label> }
                        <label className="orgName">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgName" value={catPrefix} disabled/>
                        { (accessLevel === 'owner' || accessLevel === 'admin') && (inventories.length > 0) &&
                        <>
                            <label className="orgSearch">Maneja Inventarios Afectados </label>
                            <Select 
                                options={
                                    inventories.map((inventory) => {
                                        return {
                                            value: [inventory.inventoryId, inventory.categoryId],
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
                        </>}
                        <button type="submit" className='submit-button' disabled={
                            (catNameError !== '' || catNameModified === catName || catNameModified === ''
                            || (selectedUsers.length === 0 && (accessLevel === 'owner' || accessLevel === 'admin')))
                        } onClick={
                            (e) => {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }>Confirmar</button>
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