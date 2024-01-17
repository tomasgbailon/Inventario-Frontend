import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EditInv(){
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const {organizationId, inventoryId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [orgName, setOrgName] = useState('');
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgPrefix, setOrgPrefix] = useState('');
    const [orgLocation, setOrgLocation] = useState('');
    const [orgLocationError, setOrgLocationError] = useState('');
    const [orgLocationModified, setOrgLocationModified] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [userId, setUserId] = useState(0);
    const [token, setToken] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const name = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (name.length > 20){
            setOrgNameError('El nombre no puede tener más de 20 caracteres');
        } else if (name.length < 5){
            setOrgNameError('El nombre no puede tener menos de 5 caracteres');
        } else if (!validNameRegex.test(name)){
            setOrgNameError('El nombre solo puede contener letras y números');
        }
        else {
            setOrgNameError('');
        }
        setOrgNameModified(e.target.value);
    };
    const handleWriteLocation = (e) => {
        const location = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (location.length > 30){
            setOrgLocationError('La ubicación no puede tener más de 30 caracteres');
        } else if (!validNameRegex.test(location)){
            setOrgLocationError('La ubicación solo puede contener letras y números');
        } else {
            setOrgLocationError('');
        }
        setOrgLocationModified(e.target.value);
    }
    const handleWriteDesc = (e) => {
        const description = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (description.length > 200){
            setOrgDescriptionError('La descripción no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(description)){
            setOrgDescriptionError('La descripción solo puede contener letras y números');
        } else {
            setOrgDescriptionError('');
        } 
        setOrgDescriptionModified(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (orgNameError === '' && orgLocationError === '' && orgDescriptionError === '') {
            editInv(token, 1);
        }
    };
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
    const getInv = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId+'/'+inventoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
            setOrgNameModified(response.data.name);
            setOrgPrefix(response.data.prefix);
            setOrgLocation(response.data.location);
            setOrgLocationModified(response.data.location);
            setOrgDescription(response.data.description);
            setOrgDescriptionModified(response.data.description);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    
    }
    const editInv = async (token, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId+'/'+inventoryId, {
            name: orgNameModified,
            location: orgLocationModified,
            description: orgDescriptionModified,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getInv(token, 1);
            navigate('/organization/'+organizationId+'/');
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                editInv(token, currentTry+1);
            } else {
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
            getInv(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { ((userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner' || accessLevel === 'edit') ) ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{orgName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} />
                        {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                        <label className="orgPrefix">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgPrefix" value={orgPrefix} disabled={true} />
                        <label className="orgLocation">Ubicación</label>
                        <input type="text" className="new-org-input" id="orgLocation" value={orgLocationModified} onChange={handleWriteLocation} />
                        {orgLocationError !== '' && <div id='red-small-font'>{orgLocationError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} />
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        <button type="submit" className='submit-button' onClick={handleSubmit} disabled={
                            (orgNameError !== '' || orgLocationError !== '' || orgDescriptionError !== '') ||
                            (orgNameModified === orgName && orgLocationModified === orgLocation && orgDescriptionModified === orgDescription)
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