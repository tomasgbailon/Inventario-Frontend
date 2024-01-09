import './Edit/EditOrg.css'
import './SubProyect.css'
import './Product.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from './Dashboard'
import { SearchContext } from './Dashboard'
import SecondNavBar from './SecondNavBar'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'

const translate = {
    'available': 'Disponible',
    'in use': 'En uso',
    'unavailable': 'No disponible',
}
const color = {
    'available': 'green',
    'in use': 'yellow',
    'unavailable': 'red',
}
function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}
function totalPrice(array) {
    return array.reduce((a, b) => a + b.price, 0);
}
function totalDeprecatedValue(array) {
    return array.reduce((a, b) => a + b.deprecatedValue, 0);
}
export default function Product(){
    const {organizationId, inventoryId, categoryId, productId} = useParams();
    const navigate = useNavigate();
    const { user, isLoading, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [units, setUnits] = useState({"available":[],"in use":[],"unavailable":[]});
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [orgName, setOrgName] = useState('');
    const [invName, setInvName] = useState('');
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgModel, setOrgModel] = useState('');
    const [orgModelModified, setOrgModelModified] = useState('');
    const [orgModelError, setOrgModelError] = useState('');
    const [orgBrand, setOrgBrand] = useState('');
    const [orgBrandModified, setOrgBrandModified] = useState('');
    const [orgBrandError, setOrgBrandError] = useState('');
    const [orgPrefix, setOrgPrefix] = useState('');
    const [orgType, setOrgType] = useState('');
    const [orgUnits, setOrgUnits] = useState('');
    const [orgUnitsModified, setOrgUnitsModified] = useState('');
    const [orgUnitsError, setOrgUnitsError] = useState('');
    const [orgSubproyect, setOrgSubproyect] = useState(0);
    const [orgDescription, setOrgDescription] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [toggleEdit, setToggleEdit] = useState(false);
    const [proyectSelectLock, setProyectSelectLock] = useState(0);
    const [locks, setLocks] = useState([1,1,1]);
    const [unitLocks, setUnitLocks] = useState(['available','in use','unavailable'].map((status) => units[status].map(() => 0)));
    const [mainChecks, setMainChecks] = useState([0,0,0]);
    const [orderDirection, setOrderDirection] = useState(['available','in use','unavailable'].map((status) => [0,0,0,0,0,0,0,0,0]));
    const [count, setCount] = useState(0);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [subproyects, setSubproyects] = useState([]);
    const [accessLevel, setAccessLevel] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [display, setDisplay] = useState(false);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    }
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        editProduct(token, 1);
    }
    const handleDelete = (e, status) => {
        e.preventDefault();
        const statuses = ['available','in use','unavailable'];
        const selectedUnits = units[status].filter((unit, index) => {
            return unitLocks[statuses.indexOf(status)][index] === 1;
        });
        selectedUnits.forEach((unit) => {
            deleteUnit(token, 1, unit.unitId);
        });
        setLocks([1,1,1]);
        getUnits(token, 1);
        const currentLocks = [...locks];
        setTimeout(() => {
            setLocks(currentLocks);
        }, 100);
    }
    const handleMark = (e, status, destinyStatus) => {
        e.preventDefault();
        //Get the units that are selected from the units array in units[status]
        const statuses = ['available','in use','unavailable'];
        const selectedUnits = units[status].filter((unit, index) => {
            return unitLocks[statuses.indexOf(status)][index] === 1;
        });
        //Mark the units as in use
        selectedUnits.forEach((unit) => {
            mark(token, 1, unit, destinyStatus);
        });
        //Refresh the units
        getUnits(token, 1);
        //Close and open the locks
        setLocks([1,1,1]);
        const currentLocks = [...locks];
        setTimeout(() => {
            setLocks(currentLocks);
        }, 100);
    }
    const handleAssign = (e, status) => {
        e.preventDefault();
        if (orgSubproyect === 0) {
            alert('Seleccione un subproyecto');
            return;
        }
        const statuses = ['available','in use','unavailable'];
        const selectedUnits = units[status].filter((unit, index) => {
            return unitLocks[statuses.indexOf(status)][index] === 1;
        });
        selectedUnits.forEach((unit) => {
            assign(token, 1, unit);
        });
        setLocks([1,1,1]);
        getUnits(token, 1);
        const currentLocks = [...locks];
        setTimeout(() => {
            setLocks(currentLocks);
        }, 100);
    }
    const mark = async (token, currentTry, unit, mark) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId+'/'+unit.unitId, {
            status: mark,
            subproyectId: unit.subproyectId,
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
                markInUse(token, currentTry+1);
            } else {
               alert('Error al editar el producto'); 
            }
    })};
    const assign = async (token, currentTry, unit) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId+'/'+unit.unitId, {
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
            }
        })
    }
    const deleteUnit = async (token, currentTry, unitId) => { 
        await axios.delete(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId+'/'+unitId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            }
        }).then((response) => {
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                deleteUnit(token, currentTry+1);
            } else {
                alert('Error al eliminar la unidad');
            }
        })
    }
    const goToEditUnit = (statusIndex) => () => {
        const statuses = ['available','in use','unavailable'];
        const unitIndex = unitLocks[statusIndex].indexOf(1);
        const unit = units[statuses[statusIndex]][unitIndex];
        navigate('/edit/unit/'+organizationId+'/'+inventoryId+'/'+categoryId+'/'+unit.productId+'/'+unit.unitId+'/');
    }
    const toggleEditFunc = () => {
        setToggleEdit(!toggleEdit);
    }
    const toggleProyectSelect = () => {
        setProyectSelectLock(proyectSelectLock === 0 ? 1 : 0);
    }
    const handleWriteName = (e) => {
        const name = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if(name.length > 30){
            setOrgNameError('El nombre no puede tener más de 30 caracteres');
        } else if (name.length < 5){
            setOrgNameError('El nombre no puede tener menos de 5 caracteres');
        } else if (!validNameRegex.test(name)) {
            setOrgNameError('El nombre solo puede contener letras y números');
        } else {
            setOrgNameError('');
        }
        setOrgNameModified(e.target.value);
    };
    const handleWriteDesc = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if(value.length > 200){
            setOrgDescriptionError('La descripción no puede tener más de 200 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgDescriptionError('La descripción solo puede contener letras y números');
        } else {
            setOrgDescriptionError('');
        }
        setOrgDescriptionModified(e.target.value);
    };
    const handleWriteBrand = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 20) {
            setOrgBrandError('La marca no puede tener más de 20 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgBrandError('La marca solo puede contener letras y números');
        } else {
            setOrgBrandError('');
        }
        setOrgBrandModified(e.target.value);
    }
    const handleWriteModel = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 30) {
            setOrgModelError('El modelo no puede tener más de 30 caracteres');
        } else if (!validNameRegex.test(value)) {
            setOrgModelError('El modelo solo puede contener letras y números');
        } else {
            setOrgModelError('');
        }
        setOrgModelModified(value);
    }
    const handleWriteUnits = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-]*$/;
        if (value.length > 10) {
            setOrgUnitsError('La unidad de medida no puede tener más de 10 caracteres');
        } else if (value.length < 1) {
            setOrgUnitsError('La unidad de medida no puede estar vacía');
        } else if (!validNameRegex.test(value)) {
            setOrgUnitsError('La unidad de medida solo puede contener letras y números');
        } else {
            setOrgUnitsError('');
        }
        setOrgUnitsModified(value);
    }
    const handleWriteSubproyect = (e) => {
        setOrgSubproyect(e.target.value);
    }
    const handleAddUnits = () => {
        navigate('/create/unit/'+organizationId+'/'+inventoryId+'/'+categoryId+'/'+productId+'/');
    }
    const toggleLock = (index) => () => {
        const newLocks = locks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setLocks(newLocks);
        toggleUnitsBool(index, locks[index] === 1 ? true : false)();
    }
    const toggleUnitsBool = (productIndex, boolean) => () => {
        const newUnitLocks = unitLocks.map((product, i) => {
            if (i === productIndex) {
                const newProduct = product.map((unit, j) => {
                    return boolean === true ? 1 : 0;
                });
                return newProduct;
            }
            return product;
        });
        setUnitLocks(newUnitLocks);
    }
    const toggleAllUnitOptions = (productIndex) => () => {
        const newMainChecks = mainChecks.map((check,i) => {
            if (i === productIndex){
                return check === 0 ? 1 : 0;
            }
            return check;
        })
        setMainChecks(newMainChecks);
        const statuses = ['available','in use','unavailable'];
        //get checkbox from id checkbock-productIndex-unitIndex and toggle
        for(let i = 0; i < units[statuses[productIndex]].length; i++){
            const checkbox = document.getElementById('checkbox-'+productIndex+'-'+i);
            if(checkbox.checked !== mainChecks[productIndex]){
                checkbox.checked = mainChecks[productIndex] === 0 ? true : false;
            }
        }
        toggleUnitsBool(productIndex, mainChecks[productIndex] === 0 ? true : false)();
    }
    const toggleOrderDirection = (index, key) => () => {
        const newOrderDirection = orderDirection.map((direction, i) => {
            if (i === index) {
                const newDirection = direction.map((dir, j) => {
                    if (j === key) {
                        return dir === 0 ? 1 : 0;
                    }
                    return dir;
                });
                return newDirection;
            }
            return direction;
        });
        setOrderDirection(newOrderDirection);
    }
    const orderBy = (key, index) => () => {
        const statuses = ['available','in use','unavailable'];
        let newUnits = [...units[statuses[index]]];
        const func = {
            'sku':0,
            'price':1,
            'responsible':2,
            'subproyect':3,
            'provider':4,
            'description':5,
            'purchaseDate':6,
            'proyect':7,
            'deprecatedValue':8,
        }
        if (orderDirection[index][func[key]] === 0) {
            toggleOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newUnits_ = {...units};
        newUnits_[statuses[index]] = newUnits;
        setUnits(newUnits_);
    }
    const toggleUnitOptions = (unitIndex, productIndex) => () => {
        const newUnitLocks = unitLocks.map((product, i) => {
            if (i === productIndex) {
                const newProduct = product.map((unit, j) => {
                    if (j === unitIndex) {
                        return unit === 0 ? 1 : 0;
                    }
                    return unit;
                });
                return newProduct;
            }
            return product;
        });
        setUnitLocks(newUnitLocks);
        //If new value is false, set the main to false
        if(unitLocks[productIndex][unitIndex]===0){
            const newMainChecks = mainChecks.map((check,i) => {
                if (i === productIndex){
                    return 0;
                }
            })
            setMainChecks(newMainChecks);
            const checkbox = document.getElementById('checkbox-'+productIndex);
            checkbox.checked = false;
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
    const getProduct = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/products/'+categoryId+'/'+productId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
            setOrgNameModified(response.data.name);
            setOrgModel(response.data.model);
            setOrgModelModified(response.data.model);
            setOrgBrand(response.data.brand);
            setOrgBrandModified(response.data.brand);
            setOrgPrefix(response.data.prefix);
            setOrgType(response.data.type);
            setOrgUnits(response.data.measurementUnit);
            setOrgUnitsModified(response.data.measurementUnit);
            setOrgDescription(response.data.description);
            setOrgDescriptionModified(response.data.description);
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getProduct(token, currentTry+1);
            }
        })
    }
    const editProduct = async (token, currentTry) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/products/'+categoryId+'/'+productId, {
            name: orgNameModified,
            model: orgModelModified,
            brand: orgBrandModified,
            measurementUnit: orgUnitsModified,
            description: orgDescriptionModified,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            }
        }).then((response) => {
            toggleEditFunc();
            getProduct(token, 1);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                editProduct(token, currentTry+1);
            } else {
               alert('Error al editar el producto'); 
            }
    })};
    const getInv = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId+'/'+inventoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setInvName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    
    }
    const cleanCheckBoxes = () => {
        for(let i = 0; i < units['available'].length; i++){
            const checkbox = document.getElementById('checkbox-0-'+i);
            checkbox.checked = false;
        }
        for(let i = 0; i < units['in use'].length; i++){
            const checkbox = document.getElementById('checkbox-1-'+i);
            checkbox.checked = false;
        }
        for(let i = 0; i < units['unavailable'].length; i++){
            const checkbox = document.getElementById('checkbox-2-'+i);
            checkbox.checked = false;
        }
    }
    const getUnits = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/units/'+categoryId+'/'+productId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setUnits(response.data);
            setUnitLocks(['available','in use','unavailable'].map((status) => response.data[status].map(() => 0)));
            cleanCheckBoxes();
        }).catch((error) => {
            if (currentTry < 3) {
                getUnits(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    };
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
            getProduct(token, 1);
            getInv(token, 1);
            getUnits(token, 1);
            getSubproyects(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            {   (userId !== 0 || isAuthenticated) && (accessLevel !== '') ?
                <div className="new-org">
                <NavBar selection={1} />
                <SecondNavBar selection={1} accessLevel={accessLevel}/>
                    <div className="new-org-content">
                        <h3></h3>
                        <h1>{orgName}</h1>
                        <div className='unit-options'>
                        <button className='submit-button' id='inspect' onClick={
                            (e) => {
                                e.preventDefault();
                                setDisplay(!display);
                            }
                        }>{display ? "Esconder":"Inspeccionar"}</button>
                        <button className='submit-button' id='refresh' onClick={
                                (e) => {
                                    e.preventDefault();
                                    getUnits(token, 1);
                                    setUnitLocks(['available','in use','unavailable'].map((status) => units[status].map(() => 0)));
                                }
                            }>Recargar</button>
                        </div>
                        { !toggleEdit && display &&
                        <div className='new-org-form'>
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgName} disabled/>
                            <label className='orgType'>Tipo</label>
                            <input type="text" className='new-org-input' id='orgType' value={orgType === 'asset' ? 'Activo' : 'Consumible'} disabled/>
                            <label className="orgPrefix">Prefijo</label>
                            <input type="text" className="new-org-input" id="orgPrefix" value={orgPrefix} disabled/>
                            <label className='orgUnits'>Unidad de medida</label>
                            <input type="text" className='new-org-input' id='orgUnits' value={orgUnits} disabled/>
                            <label className="orgBrand">Marca (opcional)</label>
                            <input type="text" className="new-org-input" id="orgBrand" value={orgBrand} disabled/>
                            <label className="orgModel">Modelo (opcional)</label>
                            <input type="text" className="new-org-input" id="orgModel" value={orgModel} disabled/>
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescription} disabled/>
                            { (accessLevel === 'owner' || accessLevel === 'admin' || accessLevel === 'edit') &&
                            <div className="orgDownBar">
                                <button className='submit-button' id='edit-button' onClick={toggleEditFunc}>Editar</button>
                                <button className='submit-button' id='edit-button' onClick={handleAddUnits}>Agregar Unidades</button>
                                <button className='submit-button red' id='edit-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        navigate('/delete/prod/'+organizationId+'/'+inventoryId+'/'+categoryId+'/'+productId+'/');
                                    }
                                }>Eliminar Producto</button>
                            </div>}
                        </div>}
                        { toggleEdit && display &&
                        <div className="new-org-form">
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} />
                            {orgNameError !== '' && <label id='red-small-font'>{orgNameError}</label>}
                            <label className='orgType'>Tipo</label>
                            <label className="orgSearch" id='small-font'>*Este campo no es editable</label>
                            <input type="text" className='new-org-input' id='orgType' value={orgType === 'asset' ? 'Activo' : 'Consumible'} disabled/>
                            <label className='orgPrefix'>Prefijo</label>
                            <label className="orgSearch" id='small-font'>*Este campo no es editable</label>
                            <input type="text" className='new-org-input' id='orgPrefix' value={orgPrefix} disabled/>
                            <label className='orgUnits'>Unidad de medida</label>
                            <input type="text" className='new-org-input' id='orgUnits' value={orgUnitsModified} onChange={handleWriteUnits}/>
                            {orgUnitsError !== '' && <label id='red-small-font'>{orgUnitsError}</label>}
                            <label className='orgBrand'>Marca (opcional)</label>
                            <input type="text" className='new-org-input' id='orgBrand' value={orgBrandModified} onChange={handleWriteBrand}/>
                            {orgBrandError !== '' && <label id='red-small-font'>{orgBrandError}</label>}
                            <label className='orgModel'>Modelo (opcional)</label>
                            <input type="text" className='new-org-input' id='orgModel' value={orgModelModified} onChange={handleWriteModel}/>
                            {orgModelError !== '' && <label id='red-small-font'>{orgModelError}</label>}
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} />
                            {orgDescriptionError !== '' && <label id='red-small-font'>{orgDescriptionError}</label>}
                            <button type="submit" className='submit-button' disabled={
                                orgNameError !== '' || orgUnitsError !== '' || orgBrandError !== '' || orgModelError !== '' || orgDescriptionError !== ''
                                || orgNameModified === '' || orgUnitsModified === '' || orgModelModified === '' || 
                                (orgNameModified === orgName && orgUnitsModified === orgUnits && orgModelModified === orgModel && orgBrandModified === orgBrand && orgDescriptionModified === orgDescription)
                            } onClick={(e) => {handleSubmit(e);}}>Confirmar</button>
                            <button className='submit-button' id='red-button' onClick={toggleEditFunc}>Cancelar</button>
                        </div>}
                        <h2 id='total-unit'>Total en {invName}: ${
                            totalPrice(units['available']) + totalPrice(units['in use']) + totalPrice(units['unavailable'])    
                        }</h2>
                        <h2 id='total-unit'>Valor con depreciación: ${
                            totalDeprecatedValue(units['available']) + totalDeprecatedValue(units['in use']) + totalDeprecatedValue(units['unavailable'])
                        }</h2>
                        <h3></h3>
                        {['available','in use','unavailable'].map((status, index) => {
                            if(orgType === 'asset')
                            return(
                                <div className='product3-entry'>
                                    <div className={`products3Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                        <div className='product3Info'>
                                            <p onClick={toggleLock(index)} id='ex-left'>{translate[status]}</p>
                                            <p onClick={toggleLock(index)}>Total: ${totalPrice(units[status])}</p>
                                            <p onClick={toggleLock(index)}>Valor estimado: ${totalDeprecatedValue(units[status])}</p>
                                            <p onClick={toggleLock(index)} id='ex-right'>{units[status].length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id={color[status]+'-circle'}></div>}</p>
                                            <div className='product3-lock'>
                                                <input type='checkbox' checked={sum(unitLocks[index])===unitLocks[index].length && units[status].length > 0} className='main-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)} disabled={
                                                    locks[index] === 0
                                                }/>
                                            </div>
                                        </div>
                                        {locks[index] === 1 && units[status].length > 0 && <div className='blackLine'/>}
                                        {locks[index] === 1 && units[status].length > 0 &&  status !== 'available' &&
                                            <div className='products3-grid'>
                                                <div className='products3-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                                <div className='products3-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                                <div className='products3-grid-header' onClick={orderBy('deprecatedValue',index)}> Valor Estimado </div>
                                                <div className='products3-grid-header' onClick={orderBy('provider',index)}> Proveedor </div>
                                                <div className='products3-grid-header' onClick={orderBy('purchaseDate',index)}> Fecha de compra </div>
                                                <div className='products3-grid-header' onClick={orderBy('description',index)}> Descripción </div>
                                                <div className='products3-grid-header' onClick={orderBy('responsible',index)}> Responsable </div>
                                                <div className='products3-grid-header' onClick={orderBy('subproyect',index)}> Subproyecto </div>
                                                <div></div>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                {
                                                    units[status].map((unit, unitIndex) => {
                                                        return(
                                                            <>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.sku} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.price} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.deprecatedValue} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.provider} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {transformDate(unit.purchaseDate)} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.description} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.responsible} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.subproyectName} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}><input type='checkbox' className='products3-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/></div>
                                                                {unitIndex+1 < units[status].length &&  <>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                </>}
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        } 
                                        {locks[index] === 1 && units[status].length > 0 && status === 'available' && 
                                            <div className='products3-2-grid'>
                                            <div className='products3-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                            <div className='products3-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                            <div className='products3-grid-header' onClick={orderBy('deprecatedValue',index)}> Valor Estimado </div>
                                            <div className='products3-grid-header' onClick={orderBy('provider',index)}> Proveedor </div>
                                            <div className='products3-grid-header' onClick={orderBy('purchaseDate',index)}> Fecha de compra </div>
                                            <div className='products3-grid-header' onClick={orderBy('description',index)}> Descripción </div>
                                            <div></div>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            {
                                                units[status].map((unit, unitIndex) => {
                                                    return(
                                                        <>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.sku} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.price} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.deprecatedValue} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.provider} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {transformDate(unit.purchaseDate)} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.description} </div>
                                                            <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}><input type='checkbox' className='products3-1-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/></div>
                                                            {unitIndex+1 < units[status].length &&  <>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            <div className='blackLine'/>
                                                            </>}
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                        }  
                                    </div>
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'available' && accessLevel !== 'view' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button' onClick={toggleProyectSelect} >Asignar a Proyecto</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleMark(e, status, 'in use')}
                                            }>En Uso</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleDelete(e, status)}
                                            }>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'in use' && accessLevel !== 'view' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button' onClick={
                                                (e)=>{handleMark(e, status, 'available')}
                                            } >Disponible</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleMark(e, status, 'unavailable')}
                                            }>No Disponible</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleDelete(e, status)}
                                            }>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'unavailable' && accessLevel !== 'view' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button> 
                                            <button className='product3-button' onClick={
                                                (e)=>{handleMark(e, status, 'available')}
                                            }>Disponible</button>
                                            <button className='product3-button' onClick={
                                                (e)=>{handleMark(e, status, 'in use')}
                                            }>En Uso</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleDelete(e, status)}
                                            }>Eliminar</button>
                                        </div>
                                    
                                    }
                                    {
                                        locks[index] === 1 && orgType === 'asset' && status === 'available' && proyectSelectLock === 1  && accessLevel !== 'view' &&
                                        <>
                                        <label className='orgName'>Subroyecto activo</label>
                                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                                            <option value={0} disabled>Seleccionar</option>
                                            {subproyects.map((subproyect) => {
                                                return <option value={subproyect.subproyectId}>{subproyect.name} ({subproyect.proyectName})</option>
                                            })}
                                        </select>
                                        <button className='submit-button' onClick={
                                            (e)=>{handleAssign(e, status);toggleProyectSelect();}
                                        } >Confirmar</button>
                                        <h3></h3>
                                        </>
                                    }
                                </div>
                            )
                        })}
                        {['available','in use'].map((status, index) => {
                            if (orgType === 'consumable')
                            return(
                                <div className='product4-entry'>
                                    <div className={`products3Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                        <div className='product3Info'>
                                            <p onClick={toggleLock(index)} id='ex-left'>{translate[status]}</p>
                                            <p onClick={toggleLock(index)}>Total: ${totalPrice(units[status])}</p>
                                            <p onClick={toggleLock(index)}>Valor estimado: ${totalDeprecatedValue(units[status])}</p>
                                            <p onClick={toggleLock(index)} id='ex-right'>{units[status].length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id={color[status]+'-circle'}></div>}</p>
                                            <div className='product3-lock'>
                                                <input type='checkbox' className='main-check t4-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)} disabled={
                                                    locks[index] === 0
                                                }/>
                                            </div>
                                        </div>
                                        {locks[index] === 1 && units[status].length > 0 && <div className='blackLine'/>}
                                        {locks[index] === 1 && units[status].length > 0 && status === 'available' &&
                                            <div className='products3-1-grid'>
                                                <div className='products3-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                                <div className='products3-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                                <div className='products3-grid-header' onClick={orderBy('deprecatedValue',index)}> Valor Estimado </div>
                                                <div className='products3-grid-header' onClick={orderBy('provider',index)}> Proveedor </div>
                                                <div className='products3-grid-header' onClick={orderBy('purchaseDate',index)}> Fecha de compra </div>
                                                <div className='products3-grid-header' onClick={orderBy('description',index)}> Descripción </div>
                                                <div></div>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                {
                                                    units[status].map((unit, unitIndex) => {
                                                        return(
                                                            <>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.sku} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.price} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.deprecatedValue} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.provider} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {transformDate(unit.purchaseDate)} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.description} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}><input type='checkbox' className='products3-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/></div>
                                                                {unitIndex+1 < units[status].length &&  <>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                </>}
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }
                                        {locks[index] === 1 && units[status].length > 0 && status === 'in use' &&
                                            <div className='products4-grid'>
                                                <div className='products3-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                                <div className='products3-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                                <div className='products3-grid-header' onClick={orderBy('deprecatedValue',index)}> Valor Estimado </div>
                                                <div className='products3-grid-header' onClick={orderBy('provider',index)}> Proveedor </div>
                                                <div className='products3-grid-header' onClick={orderBy('purchaseDate',index)}> Fecha de compra </div>
                                                <div className='products3-grid-header' onClick={orderBy('description',index)}> Descripción </div>
                                                <div className='products3-grid-header' onClick={orderBy('responsible',index)}> Subproyecto </div> 
                                                <div></div>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                {
                                                    units[status].map((unit, unitIndex) => {
                                                        return(
                                                            <>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.sku} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.price} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> ${unit.deprecatedValue} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.provider} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {transformDate(unit.purchaseDate)} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.description} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}> {unit.subproyectName} </div>
                                                                <div className={'products3-grid-item'+(unitLocks[index][unitIndex] === 1 ? ' selected' : '')}><input type='checkbox' className='products3-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/></div>
                                                                {unitIndex+1 < units[status].length &&  <>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                <div className='blackLine'/>
                                                                </>}
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }   
                                    </div>
                                    {
                                        locks[index] === 1 && orgType === 'consumable' && status === 'available' && sum(unitLocks[index]) > 0 && accessLevel !== 'view' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button' onClick={toggleProyectSelect} >Asignar a Proyecto</button>
                                            <button className='product3-button red' onClick={
                                                (e)=>{handleDelete(e, status)}
                                            }>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && orgType === 'consumable' && status === 'available' && proyectSelectLock === 1  && accessLevel !== 'view' &&
                                        <>
                                        <label className='orgName'>Subproyecto activo</label>
                                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                                            <option value={0} disabled>Seleccionar</option>
                                            {subproyects.map((subproyect) => {
                                                return <option value={subproyect.subproyectId}>{subproyect.name} ({subproyect.proyectName})</option>
                                            })}
                                        </select>
                                        <button className='submit-button' onClick={
                                            (e)=>{handleAssign(e, status);toggleProyectSelect();}
                                        } >Confirmar</button>
                                        <h3></h3>
                                        </>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'consumable' && status === 'in use' && accessLevel !== 'view' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button' onClick={
                                                (e)=>{handleMark(e, status, 'available')}
                                            }>Retornar a stock</button>
                                            <button className='product3-button red' onClick={(e)=>{
                                                handleDelete(e, status);
                                            }}>Eliminar</button>
                                        </div>
                                    }
                                </div>
                            )
                        })}
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