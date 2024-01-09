import '../SubProyect.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import SecondNavBar from '../SecondNavBar'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'

export default function NewSubProyect(){
    const {organizationId} = useParams();
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgStatusModified, setOrgStatusModified] = useState('');
    const [orgBudgetModified, setOrgBudgetModified] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgBudgetError, setOrgBudgetError] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [orgProyect, setOrgProyect] = useState(0);
    const [proyects, setProyects] = useState([]);
    const [orgSubproyect, setOrgSubproyect] = useState(0);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 25) {
            setOrgNameError('El nombre no puede tener más de 25 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgNameError('El nombre solo puede tener letras y números');
        } else if (value.length < 5) {
            setOrgNameError('El nombre debe tener al menos 5 caracteres');
        } else {
            setOrgNameError('');
        }
        setOrgNameModified(e.target.value);
    };
    const handleWriteDesc = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 200) {
            setOrgDescriptionError('La descripción no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgDescriptionError('La descripción solo puede tener letras y números');
        } else {
            setOrgDescriptionError('');
        }
        setOrgDescriptionModified(e.target.value);
    };
    const handleWriteBudget = (e) => {
        const value = e.target.value.substring(1);
        if (isNaN(value)) {
            setOrgBudgetError('El presupuesto solo puede tener números');
        } else if (value.length > 15) {
            setOrgBudgetError('El presupuesto no puede tener más de 15 dígitos');
        } else if (parseInt(value) < 0) {
            setOrgBudgetError('El presupuesto no puede ser negativo');
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
    const getProyects = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/proyects/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setProyects(response.data.edit);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getProyects(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    }
    const assign = async (token, currentTry, unit) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+unit.categoryId+'/'+unit.productId+'/'+unit.unitId, {
            status: 'in use',
            subproyectId: orgSubproyect,
            responsible: unit.responsible,
            price: unit.price,
            purchaseDate: unit.purchaseDate,
            provider: unit.provider,
            description: unit.description,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            }
        }).then((response) => {
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                assign(token, currentTry+1);
            } else {
                alert('Error al asignar la unidad');
            }
        })
    }
    const handleCreate = async (e) => {
        e.preventDefault();
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/subproyects/create', {
            proyectId: parseInt(orgProyect),
            name: orgNameModified,
            status: orgStatusModified,
            budget: parseInt(orgBudgetModified),
            description: orgDescriptionModified === '' ? null : orgDescriptionModified,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            }
        }).then((response) => {
            navigate('/proyects/'+organizationId+'/');
        }).catch((error) => {
            alert('Error al crear el subproyecto');
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
            getAccessLevel(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (accessLevel !== '') {
            getProyects(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            {   (userId !== 0 || isAuthenticated) && (accessLevel !== '') ?
                <div className="new-org">
                <NavBar selection={1} />
                <SecondNavBar selection={3} accessLevel={accessLevel}/>
                <div className="new-org-content">
                    <h3></h3>
                    <h1>Nuevo Subproyecto</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} placeholder='Escribe un nombre' />
                        {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                        <label className='orgStatus'>Estado</label>
                        <select className='new-org-input' id='orgStatus' value={orgStatusModified} onChange={(e) => setOrgStatusModified(e.target.value)}>
                            <option value='' disabled>Selecciona un estado</option>
                            <option value='active'>Activo</option>
                            <option value='inactive'>Inactivo</option>
                        </select>
                        <label className="orgProyect">Proyecto</label>
                        <select className="new-org-input" id="orgProyect" value={orgProyect} onChange={(e) => setOrgProyect(e.target.value)}>
                            <option value={0} disabled>Selecciona un proyecto</option>
                            {proyects.map((proyect) => {
                                return <option value={proyect.proyectId}>{proyect.name}</option>
                            }
                            )}
                        </select>
                        <label className="orgBudget">Presupuesto Objetivo</label>
                        <input className="new-org-input" id="orgBudget" value={'$'+orgBudgetModified} onChange={handleWriteBudget} />
                        {orgBudgetError !== '' && <div id='red-small-font'>{orgBudgetError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} placeholder='Describe tu subproyecto'/>
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                            <button type="submit" className='submit-button' disabled={
                                orgNameError !== '' || orgBudgetError !== '' || orgDescriptionError !== ''
                                || orgNameModified === '' || orgBudgetModified === '' || orgProyect === 0 || orgStatusModified === ''
                            } onClick={
                                (e) => handleCreate(e)
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