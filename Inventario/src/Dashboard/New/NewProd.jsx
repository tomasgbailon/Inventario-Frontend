import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewProd(){
    const navigate = useNavigate();
    const { organizationId, inventoryId } = useParams();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [categories, setCategories] = useState([]);
    const [backUpCategories, setBackUpCategories] = useState([]);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [category, setCategory] = useState(0);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [model, setModel] = useState('');
    const [modelError, setModelError] = useState('');
    const [brand, setBrand] = useState('');
    const [brandError, setBrandError] = useState('');
    const [measure, setMeasure] = useState('');
    const [measureError, setMeasureError] = useState('');
    const [prefix, setPrefix] = useState('');
    const [prefixError, setPrefixError] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [accessLevel, setAccessLevel] = useState('');
    const [orgName, setOrgName] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const handleWriteName = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 30) {
            setNameError('El nombre no puede tener más de 30 caracteres');
        } else if (value.length < 5){
            setNameError('El nombre no puede tener menos de 5 caracteres');
        } else if (!validNameRegex.test(value)){
            setNameError('El nombre solo puede contener letras y números');
        } else {
            setNameError('');
        }
        setName(value);
    }
    const handleWritePrefix = (e) => {
        const value = e.target.value;
        if (value.length > 6) {
            setPrefixError('El prefijo no puede tener más de 6 caracteres');
        } else if (value.length < 2){
            setPrefixError('El prefijo no puede tener menos de 2 caracteres');
        } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
            setPrefixError('El prefijo solo puede contener letras y números');
        } else {
            setPrefixError('');
        }
        setPrefix(value);
    }
    const handleWriteMeasure = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 10) {
            setMeasureError('La unidad de medida no puede tener más de 10 caracteres');
        } else if (value.length < 1){
            setMeasureError('La unidad de medida no puede estar vacía');
        } else if (!validNameRegex.test(value)){
            setMeasureError('La unidad de medida solo puede contener letras y números');
        } else {
            setMeasureError('');
        }
        setMeasure(value);
    }
    const handleWriteBrand = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 20) {
            setBrandError('La marca no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)){
            setBrandError('La marca solo puede contener letras y números');
        } else {
            setBrandError('');
        }
        setBrand(value);
    }
    const handleWriteModel = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 30) {
            setModelError('El modelo no puede tener más de 30 caracteres');
        } else if (!validNameRegex.test(value)){
            setModelError('El modelo solo puede contener letras y números');
        } else {
            setModelError('');
        }
        setModel(value);
    }
    const handleWriteDescription = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 200) {
            setDescriptionError('La descripción no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(value)){
            setDescriptionError('La descripción solo puede contener letras y números');
        } else {
            setDescriptionError('');
        }
        setDescription(value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        createProduct(token, 1);
    }
    const createProduct = async (token, currentTry) => {
        const data = {
            name: name,
            description: description === '' ? null : description,
            model: model === '' ? null : model,
            brand: brand === '' ? null : brand,
            measure: measure,
            prefix: prefix,
            categoryId: category,
            inventoryId: inventoryId,
            type: type,
        }
        await axios.post(import.meta.env.VITE_API_ADDRESS+'/products/create', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            navigate('/inventory/'+organizationId+'/'+inventoryId+'/');
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                createProduct(token, currentTry+1);
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
    const getInv = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId+'/'+inventoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    
    }
    const getCategories = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/categories/'+inventoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setCategories(response.data);
            setBackUpCategories(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getCategories(token, currentTry+1);
            } else {
                console.log(error);
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
            getInv(token, 1);
            getCategories(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            {   (userId !== 0 || isAuthenticated) && (accessLevel === 'admin' || accessLevel === 'owner' || accessLevel === 'edit') ?
                <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nuevo Producto</h1>
                    <div className="new-org-form">
                        <label className="category">Categoría</label>
                        <select className="new-org-input" id="category" onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value={0} disabled={true}>Selecciona una categoría</option>
                            {categories.map((category) => {
                                return <option value={category.categoryId}>{category.name}</option>
                            })}
                        </select>
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre del producto" onChange={handleWriteName} />
                        {nameError !== '' && <div id='red-small-font'>{nameError}</div>}
                        <label className='type'>Tipo</label>
                        <label id='small-font'>*Activo: Admite responsables y espera retorno</label>
                        <label id='small-font'>*Consumible: No admite responsables ni espera retorno</label>
                        <select className="new-org-input" id="type" onChange={(e) => setType(e.target.value)} value={type}>
                            <option value="" disabled={true}>Selecciona un tipo</option>
                            <option value="asset">Activo</option>
                            <option value="consumable">Consumible</option>
                        </select>
                        <label className='prefix'>Prefijo</label>
                        <input type="text" className="new-org-input" id="prefix" placeholder="Prefijo" onChange={handleWritePrefix} />
                        {prefixError !== '' && <div id='red-small-font'>{prefixError}</div>}
                        <label className='measure'>Unidad de medida</label>
                        <input type="text" className="new-org-input" id="measure" placeholder="Unidad de medida (ej: Unidades, Kg, Ton)" onChange={handleWriteMeasure} />
                        {measureError !== '' && <div id='red-small-font'>{measureError}</div>}
                        <label className="brand">Marca (opcional)</label>
                        <input type="text" className="new-org-input" id="brand" placeholder="Marca del producto" onChange={handleWriteBrand} />
                        {brandError !== '' && <div id='red-small-font'>{brandError}</div>}
                        <label className="model">Modelo (opcional)</label>
                        <input type="text" className="new-org-input" id="model" placeholder="Modelo del producto" onChange={handleWriteModel} />
                        {modelError !== '' && <div id='red-small-font'>{modelError}</div>}
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" placeholder="Descripción del producto" onChange={handleWriteDescription} />
                        <button type="submit" className='submit-button' disabled={
                            name === '' ||
                            nameError !== '' ||
                            type === '' ||
                            category === 0 ||
                            prefix === '' ||
                            prefixError !== '' ||
                            measure === '' ||
                            measureError !== '' ||
                            brandError !== '' ||
                            modelError !== '' ||
                            descriptionError !== ''
                        } onClick={
                            (e) => handleSubmit(e)
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