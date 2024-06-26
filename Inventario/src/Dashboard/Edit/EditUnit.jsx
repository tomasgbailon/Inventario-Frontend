import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'


export default function EditUnit(){
    const {organizationId, inventoryId, categoryId, productId, unitId} = useParams();
    const navigate = useNavigate();
    const { getAccessTokenSilently, user, isLoading, isAuthenticated } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [subproyects, setSubproyects] = useState([]);
    const [orgDescription, setOrgDescription] = useState('');
    const [orgSku, setOrgSku] = useState('');
    const [orgStatus, setOrgStatus] = useState('');
    const [orgPrice, setOrgPrice] = useState('');
    const [orgResponsible, setOrgResponsible] = useState('');
    const [orgSubproyect, setOrgSubproyect] = useState(0);
    const [orgProvider, setOrgProvider] = useState('');
    const [orgPurchaseDate, setOrgPurchaseDate] = useState('');
    const [orgRUT, setOrgRUT] = useState('');
    const [orgSellerName, setOrgSellerName] = useState('');
    const [orgSellerContact, setOrgSellerContact] = useState('');
    const [orgFacturationCode, setOrgFacturationCode] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [accessLevel, setAccessLevel] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [orgPriceError, setOrgPriceError] = useState('');
    const [orgResponsibleError, setOrgResponsibleError] = useState('');
    const [orgProviderError, setOrgProviderError] = useState('');
    const [orgRUTError, setOrgRUTError] = useState('');
    const [orgSellerNameError, setOrgSellerNameError] = useState('');
    const [orgSellerContactError, setOrgSellerContactError] = useState('');
    const [orgStatusOriginal, setOrgStatusOriginal] = useState('');
    const [orgPriceOriginal, setOrgPriceOriginal] = useState('');
    const [orgResponsibleOriginal, setOrgResponsibleOriginal] = useState('');
    const [orgSubproyectOriginal, setOrgSubproyectOriginal] = useState('');
    const [orgProviderOriginal, setOrgProviderOriginal] = useState('');
    const [orgPurchaseDateOriginal, setOrgPurchaseDateOriginal] = useState('');
    const [orgDescriptionOriginal, setOrgDescriptionOriginal] = useState('');
    const [orgRUTOriginal, setOrgRUTOriginal] = useState('');
    const [orgSellerNameOriginal, setOrgSellerNameOriginal] = useState('');
    const [orgSellerContactOriginal, setOrgSellerContactOriginal] = useState('');
    const [orgFacturationCodeOriginal, setOrgFacturationCodeOriginal] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteDesc = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 100) {
            setOrgDescriptionError('La descripción no puede tener más de 100 caracteres');
        } else if(!validNameRegex.test(value)) {
            setOrgDescriptionError('La descripción solo puede tener letras y números');
        } else {
            setOrgDescriptionError('');
        }
        setOrgDescription(e.target.value);
    };
    const handleWriteResponsible = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 20) {
            setOrgResponsibleError('El responsable no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgResponsibleError('El responsable solo puede tener letras y números');
        } else {
            setOrgResponsibleError('');
        }
        setOrgResponsible(e.target.value);
    };
    const handleWriteProvider = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 20) {
            setOrgProviderError('El proveedor no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgProviderError('El proveedor solo puede tener letras y números');
        } else {
            setOrgProviderError('');
        }
        setOrgProvider(e.target.value);
    };
    const handleWriteRUT = (e) => {
        const value = e.target.value;
        //numbers and k or K
        const validNameRegex = /^[0-9kK]*$/;
        if (value.length > 9) {
            setOrgRUTError('El RUT no puede tener más de 9 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgRUTError('El RUT solo puede tener números');
        } else {
            setOrgRUTError('');
        }
        setOrgRUT(e.target.value);
    };
    const handleWriteSellerName = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
        if (value.length > 20) {
            setOrgSellerNameError('El nombre del vendedor no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgSellerNameError('El nombre del vendedor solo puede tener letras y números');
        } else {
            setOrgSellerNameError('');
        }
        setOrgSellerName(e.target.value);
    };
    const handleWriteSellerContact = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@_\s.,-]*$/;
        if (value.length > 20) {
            setOrgSellerContactError('El contacto del vendedor no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgSellerContactError('El contacto del vendedor solo puede tener letras y números');
        } else {
            setOrgSellerContactError('');
        }
        setOrgSellerContact(e.target.value);
    };
    const handleWriteStatus = (e) => {
        setOrgStatus(e.target.value);
    }
    const handleWritePrice = (e) => {
        const price = e.target.value.substring(1);
        //check if price is a number
        if (isNaN(price)) {
            setOrgPriceError('El precio debe ser un número');
        } else if (price.length > 15) {
            setOrgPriceError('El precio no puede tener más de 15 dígitos');
        } else if (price.length === 0) {
            setOrgPriceError('El precio no puede estar vacío');
        } else {
            setOrgPriceError('');
        }
        setOrgPrice(price);
    }
    const handleWriteDate = (e) => {
        setOrgPurchaseDate(e.target.value);
    }
    const handleWriteSubproyect = (e) => {
        setOrgSubproyect(e.target.value);
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
    const handleEditUnit = async (e, token, currentTry) => {
        e.preventDefault();
        let subproyect = null;
        if (orgStatus === 'in use') {
            subproyect = parseInt(orgSubproyect);
        }
        let responsible = null;
        if (orgStatus !== 'available') {
            responsible = orgResponsible;
        }
        const data = {
            subproyectId: subproyect,
            status: orgStatus,
            price: orgPrice,
            responsible: responsible,
            provider: orgProvider === '' ? null : orgProvider,
            purchaseDate: orgPurchaseDate === '' ? null : orgPurchaseDate,
            description: orgDescription === '' ? null : orgDescription,
            providerRUT: orgRUT === '' ? null : orgRUT,
            providerName: orgSellerName === '' ? null : orgSellerName,
            providerContact: orgSellerContact === '' ? null : orgSellerContact,
        }
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId+'/'+unitId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/product/'+organizationId+'/'+inventoryId+'/'+categoryId+'/'+productId+'/');
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                handleEditUnit(e, token, currentTry+1);
            }
        })
    }
    const getUnit = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId+'/'+unitId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgDescription(response.data.description);
            setOrgSku(response.data.sku);
            setOrgStatus(response.data.status);
            setOrgPrice(response.data.price);
            setOrgResponsible(response.data.responsible);
            setOrgSubproyect(response.data.subproyectId);
            setOrgProvider(response.data.provider);
            setOrgRUT(response.data.providerRUT);
            setOrgSellerName(response.data.providerName);
            setOrgSellerContact(response.data.providerContact);
            setOrgFacturationCode(response.data.facturationCode);
            setOrgDescriptionOriginal(response.data.description);
            setOrgStatusOriginal(response.data.status);
            setOrgPriceOriginal(response.data.price);
            setOrgResponsibleOriginal(response.data.responsible);
            setOrgSubproyectOriginal(response.data.subproyectId);
            setOrgProviderOriginal(response.data.provider);
            const date = response.data.purchaseDate.split('T')[0].split('-');
            const newDate = date[0]+'-'+date[1]+'-'+date[2];
            setOrgPurchaseDate(newDate);
            setOrgPurchaseDateOriginal(newDate);
            setOrgRUTOriginal(response.data.providerRUT);
            setOrgSellerNameOriginal(response.data.providerName);
            setOrgSellerContactOriginal(response.data.providerContact);
            setOrgFacturationCodeOriginal(response.data.facturationCode);
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getUnit(token, currentTry+1);
            }
        })
    }
    const getSubproyects = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/subproyects/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setSubproyects(response.data.edit);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getSubproyects(token, currentTry+1);
            } else {
                //console.log(error);
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
            getAccessLevel(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (accessLevel !== '') {
            getUnit(token, 1);
            getSubproyects(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { (userId !== 0 || isAuthenticated)
             && (accessLevel === 'admin' || accessLevel === 'owner' || accessLevel === 'edit') ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{orgSku}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Estado</label>
                        <select className="new-org-input" id="orgStatus" value={orgStatus} onChange={handleWriteStatus}>
                            <option value="available">Disponible</option>
                            <option value="in use">En uso</option>
                            <option value="unavailable">No disponible</option>
                        </select>
                        <label className="orgName">Precio</label>
                        <input className="new-org-input" id="orgPrice" value={'$'+orgPrice} onChange={handleWritePrice} />
                        {orgPriceError !== '' && <div id='red-small-font'>{orgPriceError}</div>}
                        {orgStatus !== 'available' && <label className="orgName">Responsable (Opcional)</label>}
                        {orgStatus !== 'available' && <input className="new-org-input" id="orgResponsible" value={orgResponsible} onChange={handleWriteResponsible} />}
                        {orgStatus !== 'available' && orgResponsibleError !== '' && <div id='red-small-font'>{orgResponsibleError}</div>}
                        <label className="orgName">Proveedor (Opcional)</label>
                        <input className="new-org-input" id="orgProvider" value={orgProvider} onChange={handleWriteProvider} />
                        {orgProviderError !== '' && <div id='red-small-font'>{orgProviderError}</div>}
                        <label className="orgName">RUT Proveedor (Opcional) (Sin puntos ni guión)</label>
                        <input className="new-org-input" id="orgRUT" value={orgRUT} onChange={handleWriteRUT} />
                        {orgRUTError !== '' && <div id='red-small-font'>{orgRUTError}</div>}
                        <label className="orgName">Nombre Vendedor (Opcional)</label>
                        <input className="new-org-input" id="orgSellerName" value={orgSellerName} onChange={handleWriteSellerName} />
                        {orgSellerNameError !== '' && <div id='red-small-font'>{orgSellerNameError}</div>}
                        <label className="orgName">Contacto Vendedor (Opcional)</label>
                        <input className="new-org-input" id="orgSellerContact" value={orgSellerContact} onChange={handleWriteSellerContact} />
                        {orgSellerContactError !== '' && <div id='red-small-font'>{orgSellerContactError}</div>}
                        <label className="orgName">Fecha de compra</label>
                        <input type='date' className="new-org-input" id="orgPurchaseDate" value={orgPurchaseDate} onChange={handleWriteDate} />
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescription} onChange={handleWriteDesc} />
                        {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        {orgStatus === 'in use' && <label className='orgName'>Subproyecto (opcional)</label>}
                        {orgStatus === 'in use' && 
                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                            <option value={0}>Ninguno</option>
                            {subproyects.map((subproyect) => {
                                return <option value={subproyect.subproyectId}>{subproyect.name} ({subproyect.proyectName})</option>
                            })}
                            
                        </select>}
                        <button type="submit" className='submit-button' disabled={
                            orgDescriptionError !== '' ||
                            orgPriceError !== '' ||
                            orgResponsibleError !== '' ||
                            orgProviderError !== '' ||
                            orgPrice === '' ||
                            orgPurchaseDate === '' ||
                            (orgDescription === orgDescriptionOriginal &&
                                orgStatus === orgStatusOriginal &&
                                orgPrice === orgPriceOriginal &&
                                orgResponsible === orgResponsibleOriginal &&
                                orgSubproyect === orgSubproyectOriginal &&
                                orgProvider === orgProviderOriginal &&
                                orgPurchaseDate === orgPurchaseDateOriginal &&
                                orgRUT === orgRUTOriginal &&
                                orgSellerName === orgSellerNameOriginal &&
                                orgSellerContact === orgSellerContactOriginal &&
                                orgFacturationCode === orgFacturationCodeOriginal
                            )
                        } onClick={
                            (e) => {
                                handleEditUnit(e, token, 1);
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