import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const proyect = {
    name: 'Proyecto 1',
    description: 'Descripción de proyecto 1',
    status: 'active',
    organizationId: 1,
    proyectId: 1,
    budget: 100000,
}

export default function EditProyect(){
    const navigate = useNavigate();
    const {organizationId, proyectId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [orgName, setOrgName] = useState();
    const [orgStatus, setOrgStatus] = useState();
    const [orgDescription, setOrgDescription] = useState();
    const [orgBudget, setOrgBudget] = useState();
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgStatusModified, setOrgStatusModified] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [orgBudgetModified, setOrgBudgetModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [orgBudgetError, setOrgBudgetError] = useState('');
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [userId, setUserId] = useState(0);
    const [token, setToken] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const name = e.target.value;
        if (name.length > 30) {
            setOrgNameError('El nombre es demasiado largo');
        } else if (name.length < 5) {
            setOrgNameError('El nombre es demasiado corto');
        } else if (!name.match(/^[a-zA-Z0-9 ]*$/)) {
            setOrgNameError('El nombre solo puede contener letras y números');
        } else {
            setOrgNameError('');
        }
        setOrgNameModified(name);
    };
    const handleWriteStatus = (e) => {
        setOrgStatusModified(e.target.value);
    };
    const handleWriteDesc = (e) => {
        const value = e.target.value;
        if (value.length > 300) {
            setOrgDescriptionError('La descripción es demasiado larga');
        } else if (!value.match(/^[a-zA-Z0-9 ]*$/)) {
            setOrgDescriptionError('La descripción solo puede contener letras y números');
        } else {
            setOrgDescriptionError('');
        }
        setOrgDescriptionModified(value);
    };
    const handleWriteBudget = (e) => {
        const value = e.target.value.substring(1);
        if (value.length > 15) {
            setOrgBudgetError('El presupuesto es demasiado largo');
        } else if (isNaN(value)) {
            setOrgBudgetError('El presupuesto solo puede contener números');
        } else {
            setOrgBudgetError('');
        }
        setOrgBudgetModified(value);
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
                console.log(error);
            }
        })
    }
    const getProy = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/proyects/'+organizationId+'/'+proyectId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
            setOrgNameModified(response.data.name);
            setOrgDescription(response.data.description === null ? '' : response.data.description);
            setOrgDescriptionModified(response.data.description === null ? '' : response.data.description);
            setOrgStatus(response.data.status);
            setOrgStatusModified(response.data.status);
            setOrgBudget(response.data.budget);
            setOrgBudgetModified(response.data.budget);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    
    }
    const editInv = async (token, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/proyects/'+organizationId+'/'+proyectId, {
            name: orgNameModified,
            status: orgStatusModified,
            description: orgDescriptionModified === '' ? null : orgDescriptionModified,
            budget: parseInt(orgBudgetModified),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/proyects/'+organizationId+'/');
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                editInv(token, currentTry+1);
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
            getProy(token, 1);
        }
    }, [accessLevel]);
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { (userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'edit' || accessLevel === 'owner') ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{orgName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} />
                        {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                        <label className="orgStatus">Estado</label>
                        <select className="new-org-input" id="orgStatus" value={orgStatusModified} onChange={handleWriteStatus}>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                        <label className="orgBudget">Presupuesto Objetivo</label>
                        <input className="new-org-input" id="orgBudget" value={'$'+orgBudgetModified} onChange={handleWriteBudget} />
                        {orgBudgetError !== '' && <div id='red-small-font'>{orgBudgetError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} />
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        <button type="submit" className='submit-button' disabled={
                            orgNameError !== '' ||
                            orgDescriptionError !== '' ||
                            orgBudgetError !== '' ||
                            orgNameModified === '' ||
                            orgBudgetModified === '' ||
                            (orgNameModified === orgName &&
                            orgDescriptionModified === orgDescription &&
                            orgBudgetModified == orgBudget &&
                            orgStatusModified === orgStatus)
                        } onClick={
                            (e) => {
                                e.preventDefault();
                                editInv(token, 1);
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