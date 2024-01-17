import './Edit/EditOrg.css'
import './SubProyect.css'
import NavBar from './NavBar'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from './Dashboard'
import SecondNavBar from './SecondNavBar'
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}

export default function SubProyect(){
    const {organizationId, proyectId, subproyectId} = useParams();
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [orgName, setOrgName] = useState();
    const [orgStatus, setOrgStatus] = useState();
    const [orgBudget, setOrgBudget] = useState();
    const [orgDescription, setOrgDescription] = useState();
    const [orgNameModified, setOrgNameModified] = useState('');
    const [orgStatusModified, setOrgStatusModified] = useState('');
    const [orgBudgetModified, setOrgBudgetModified] = useState('');
    const [orgDescriptionModified, setOrgDescriptionModified] = useState('');
    const [orgNameError, setOrgNameError] = useState('');
    const [orgBudgetError, setOrgBudgetError] = useState('');
    const [orgDescriptionError, setOrgDescriptionError] = useState('');
    const [toggleEdit, setToggleEdit] = useState(false);
    const [responsibleLock, setResponsibleLock] = useState(-1);
    const [newResponsible, setNewResponsible] = useState('');
    const [returnLock, setReturnLock] = useState(-1);
    const [amount, setAmount] = useState(0);
    const [accessLevel, setAccessLevel] = useState('');
    const [consumables, setConsumables] = useState([]);
    const [assets, setAssets] = useState([]);
    const [consLocks, setConsLocks] = useState(consumables.map(() => 0));
    const [assetLocks, setAssetLocks] = useState(assets.map(() => 0));
    const [consUnitLocks, setConsUnitLocks] = useState(consumables.map((product) => product.units.map(() => 0)));
    const [assetUnitLocks, setAssetUnitLocks] = useState(assets.map((product) => product.units.map(() => 0)));
    const [consMainChecks, setConsMainChecks] = useState(consumables.map(() => 0));
    const [assetMainChecks, setAssetMainChecks] = useState(assets.map(() => 0));
    const [consOrderDirection, setConsOrderDirection] = useState(consumables.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const [assetOrderDirection, setAssetOrderDirection] = useState(assets.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const [changeSubproyectLock, setChangeSubproyectLock] = useState(-1);
    const [changeSubproyectType, setChangeSubproyectType] = useState('');
    const [subproyects, setSubproyects] = useState([]);
    const [showContent, setShowContent] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [display, setDisplay] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const [orgSubproyect, setOrgSubproyect] = useState(0);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
    }
    const toggleEditFunc = () => {
        setToggleEdit(!toggleEdit);
    }
    const handleWriteSubproyect = (e) => {
        setOrgSubproyect(e.target.value);
    }
    const handleWriteName = (e) => {
        const value = e.target.value;
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
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
        const validNameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,-\/]*$/
;
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
    const handleWriteResponsible = (e) => {
        setNewResponsible(e.target.value);
    };
    const toggleConsLock = (index) => () => {
        const newLocks = consLocks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setConsLocks(newLocks);
        toggleConsUnitsBool(index, consLocks[index] === 1 ? true : false)();
    }
    const toggleAssetLock = (index) => () => {
        const newLocks = assetLocks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setAssetLocks(newLocks);
        toggleAssetUnitsBool(index, assetLocks[index] === 1 ? true : false)();
    }
    const toggleConsOrderDirection = (index, key) => () => {
        const newOrderDirection = consOrderDirection.map((direction, i) => {
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
        setConsOrderDirection(newOrderDirection);
    }
    const toggleAssetOrderDirection = (index, key) => () => {
        const newOrderDirection = assetOrderDirection.map((direction, i) => {
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
        setAssetOrderDirection(newOrderDirection);
    }
    const toggleConsUnitsBool = (productIndex, boolean) => () => {
        const newUnitLocks = consUnitLocks.map((product, i) => {
            if (i === productIndex) {
                const newProduct = product.map((unit, j) => {
                    return boolean === true ? 1 : 0;
                });
                return newProduct;
            }
            return product;
        });
        setConsUnitLocks(newUnitLocks);
    }
    const toggleAssetUnitsBool = (productIndex, boolean) => () => {
        const newUnitLocks = assetUnitLocks.map((product, i) => {
            if (i === productIndex) {
                const newProduct = product.map((unit, j) => {
                    return boolean === true ? 1 : 0;
                });
                return newProduct;
            }
            return product;
        });
        setAssetUnitLocks(newUnitLocks);
    }
    const toggleConsUnitOptions = (unitIndex, productIndex) => () => {
        const newUnitLocks = consUnitLocks.map((product, i) => {
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
        setConsUnitLocks(newUnitLocks);
        //If new value is false, set the main to false
        if(consUnitLocks[productIndex][unitIndex]===0){
            const newMainChecks = consMainChecks.map((check,i) => {
                if (i === productIndex){
                    return 0;
                }
            })
            setConsMainChecks(newMainChecks);
            const checkbox = document.getElementById('c-checkbox-'+productIndex);
            checkbox.checked = false;
        }
    }
    const toggleAssetUnitOptions = (unitIndex, productIndex) => () => {
        const newUnitLocks = assetUnitLocks.map((product, i) => {
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
        setAssetUnitLocks(newUnitLocks);
        //If new value is false, set the main to false
        if(assetUnitLocks[productIndex][unitIndex]===0){
            const newMainChecks = assetMainChecks.map((check,i) => {
                if (i === productIndex){
                    return 0;
                }
            })
            setAssetMainChecks(newMainChecks);
            const checkbox = document.getElementById('a-checkbox-'+productIndex);
            checkbox.checked = false;
        }
    }
    const toggleAllConsUnitOptions = (productIndex) => () => {
        const newMainChecks = consMainChecks.map((check,i) => {
            if (i === productIndex){
                return check === 0 ? 1 : 0;
            }
            return check;
        })
        setConsMainChecks(newMainChecks);
        //get checkbox from id checkbock-productIndex-unitIndex and toggle
        for(let i = 0; i < consumables[productIndex].units.length; i++){
            const checkbox = document.getElementById('c-checkbox-'+productIndex+'-'+i);
            if(checkbox.checked !== consMainChecks[productIndex]){
                checkbox.checked = consMainChecks[productIndex] === 0 ? true : false;
            }
        }
        toggleConsUnitsBool(productIndex, consMainChecks[productIndex] === 0 ? true : false)();
    }
    const toggleAllAssetUnitOptions = (productIndex) => () => {
        const newMainChecks = assetMainChecks.map((check,i) => {
            if (i === productIndex){
                return check === 0 ? 1 : 0;
            }
            return check;
        })
        setAssetMainChecks(newMainChecks);
        //get checkbox from id checkbock-productIndex-unitIndex and toggle
        for(let i = 0; i < assets[productIndex].units.length; i++){
            const checkbox = document.getElementById('a-checkbox-'+productIndex+'-'+i);
            if(checkbox.checked !== assetMainChecks[productIndex]){
                checkbox.checked = assetMainChecks[productIndex] === 0 ? true : false;
            }
        }
        toggleAssetUnitsBool(productIndex, assetMainChecks[productIndex] === 0 ? true : false)();
    }
    const toggleShowContent = () => {
        setShowContent(!showContent);
    }
    const consOrderBy = (key, index) => () => {
        let newUnits = [...consumables[index].units];
        const func = {
            'sku':0,
            'price':1,
            'responsible':2,
            'purchaseDate':3,
            'deprecatedValue':4,
        }
        if (consOrderDirection[index][func[key]] === 0) {
            toggleConsOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleConsOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newCategories = [...consumables];
        newCategories[index].units = newUnits;
        setConsumables(newCategories);
    }
    const assetOrderBy = (key, index) => () => {
        let newUnits = [...assets[index].units];
        const func = {
            'sku':0,
            'price':1,
            'responsible':2,
            'purchaseDate':3,
            'deprecatedValue':4,
        }
        if (assetOrderDirection[index][func[key]] === 0) {
            toggleAssetOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleAssetOrderDirection(index, func[key])();
            newUnits = newUnits.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newCategories = [...assets];
        newCategories[index].units = newUnits;
        setAssets(newCategories);
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
    const getSubproyect = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/subproyects/'+proyectId+'/'+subproyectId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.subproyect.name);
            setOrgStatus(response.data.subproyect.status);
            setOrgBudget(response.data.subproyect.budget);
            setOrgDescription(response.data.subproyect.description === null ? '' : response.data.subproyect.description);
            setOrgNameModified(response.data.subproyect.name);
            setOrgStatusModified(response.data.subproyect.status);
            setOrgBudgetModified(response.data.subproyect.budget);
            setOrgDescriptionModified(response.data.subproyect.description === null ? '' : response.data.subproyect.description);
            setAssets(response.data.assets);
            setConsumables(response.data.consumables);
            setConsLocks(response.data.consumables.map(() => 1));
            setAssetLocks(response.data.assets.map(() => 1));
            setConsUnitLocks(response.data.consumables.map((product) => product.units.map(() => 0)));
            setAssetUnitLocks(response.data.assets.map((product) => product.units.map(() => 0)));
            setConsMainChecks(response.data.consumables.map(() => 0));
            setAssetMainChecks(response.data.assets.map(() => 0));
            setConsOrderDirection(response.data.consumables.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
            setAssetOrderDirection(response.data.assets.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getSubproyect(token, currentTry+1);
            }
        })
    }
    const handleEdit = async (e) => {
        e.preventDefault();
        const data = {
            name: orgNameModified,
            status: orgStatusModified,
            budget: orgBudgetModified,
            description: orgDescriptionModified === '' ? null : orgDescriptionModified,
        };
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/subproyects/'+proyectId+'/'+subproyectId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getSubproyect(token, 1);
            toggleEditFunc();
        }).catch((error) => {
            alert('Error al editar la organización');
        })
    }
    const returnToStock = async (unit) => {
        const data = {
            subproyectId: null,
            status: 'available',
            price: unit.price,
            purchaseDate: unit.purchaseDate,
            provider: unit.provider,
            responsible: null,
            description: unit.description,
            providerName: unit.providerName,
            providerRUT: unit.providerRUT,
            providerContact: unit.providerContact,
        };
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+unit.categoryId+'/'+unit.productId+'/'+unit.unitId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getSubproyect(token, 1);
            setReturnLock(-1);
        }).catch((error) => {
            alert('Error al retornar a stock');
        })
    }
    const handleReturn = async (type, index) => {
        //for every checked unit if asset or consumable, return to stock
        if(type === 'asset'){
            assets[index].units.forEach((unit, j) => {
                if(assetUnitLocks[index][j] === 1){
                    const check = document.getElementById('a-checkbox-'+index+'-'+j);
                    check.checked = false;
                    returnToStock(unit);
                }
            })
        } else {
            consumables[index].units.forEach((unit, j) => {
                if(consUnitLocks[index][j] === 1){
                    const check = document.getElementById('c-checkbox-'+index+'-'+j);
                    check.checked = false;
                    returnToStock(unit);
                }
            })
        }
        getSubproyect(token, 1);
    }
    const modifyResponsible = async (unit, responsible) => {
        const data = {
            subproyectId: subproyectId,
            status: unit.status,
            price: unit.price,
            purchaseDate: unit.purchaseDate,
            provider: unit.provider,
            responsible: responsible === '' ? null : responsible,
            description: unit.description,
            providerName: unit.providerName,
            providerRUT: unit.providerRUT,
            providerContact: unit.providerContact,
        };
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/units/'+unit.categoryId+'/'+unit.productId+'/'+unit.unitId, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getSubproyect(token, 1);
            setResponsibleLock(-1);
        }).catch((error) => {
            alert('Error al modificar el responsable');
        })
    }
    const handleModifyResponsible = async (responsible, type, index) => {
        //for every checked unit if asset or consumable, return to stock
        if(type === 'asset'){
            assets[index].units.forEach((unit, j) => {
                if(assetUnitLocks[index][j] === 1){
                    const check = document.getElementById('a-checkbox-'+index+'-'+j);
                    check.checked = false;
                    modifyResponsible(unit, responsible);
                }
            })
        } else {
            assets[index].units.forEach((unit, j) => {
                if(consUnitLocks[index][j] === 1){
                    const check = document.getElementById('c-checkbox-'+index+'-'+j);
                    check.checked = false;
                    modifyResponsible(unit, responsible);
                }
            })
        }
        getSubproyect(token, 1);
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
            } 
        })
    }
    const handleAssign = (e, type, index) => {
        e.preventDefault();
        //for every checked unit if asset or consumable, assign to subproyect
        if(type === 'asset'){
            assets[index].units.forEach((unit, j) => {
                if(assetUnitLocks[index][j] === 1){
                    const check = document.getElementById('a-checkbox-'+index+'-'+j);
                    check.checked = false;
                    assign(token, 1, unit);
                }
            })
        } else {
            consumables[index].units.forEach((unit, j) => {
                if(consUnitLocks[index][j] === 1){
                    const check = document.getElementById('c-checkbox-'+index+'-'+j);
                    check.checked = false;
                    assign(token, 1, unit);
                }
            })
        }
        setOrgSubproyect(0);
        setChangeSubproyectLock(-1);
        getSubproyect(token, 1);
    }
    const affectAllLocks = (boolean) => {
        const newLocks = assetLocks.map((lock, i) => {
            return boolean === true ? 1 : 0;
        });
        setAssetLocks(newLocks);
        const _newLocks = consLocks.map((lock, i) => {
            return boolean === true ? 1 : 0;
        });
        setConsLocks(_newLocks);
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
            getSubproyect(token, 1);
            getSubproyects(token, 1);
            //console.log(accessLevel)
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            {   token !== '' && (accessLevel !== '') ?
                <div className="new-org">
                <NavBar selection={1} />
                <SecondNavBar selection={3} accessLevel={accessLevel}/>
                <div className="new-org-content">
                    <div className='window-tool-bar'>
                        <FontAwesomeIcon icon={faArrowLeft} className='back-arrow' onClick={() => navigate('/proyects/'+organizationId+'/')}/>
                    </div>
                    <h1>{orgName}</h1>
                    <div className='tool-bar-adapter-subp'>
                        <div className='tool-bar'>
                            <button disabled={!(accessLevel === 'owner' || accessLevel === 'admin' || accessLevel === 'edit')}
                                className='tool-bar-button' id='blue-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setDisplay(display === 'edit' ? null : 'edit');
                                    }
                                }>
                                    Editar
                            </button>
                            <button disabled={!(accessLevel === 'owner' || accessLevel === 'admin')}
                                className='tool-bar-button' id='blue-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        const date = new Date();
                                        const start = date.getFullYear()+'-'+(date.getMonth()+1 <= 9 ? ''+date.getMonth()+1 : date.getMonth()+1)+'-'+date.getDate();
                                        navigate('/history/proy/'+organizationId+'/'+proyectId+'?start='+start+'&range=1&page=1&group=daily');
                                    }
                                }>
                                    Historial
                            </button>
                            <button disabled={!(accessLevel === 'owner' || accessLevel === 'admin' || accessLevel === 'edit')}
                                className='tool-bar-button' id='red-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        navigate('/delete/subproy/'+organizationId+'/'+proyectId+'/'+subproyectId+'/');
                                    }
                                }>
                                    Eliminar Subproyecto
                            </button>
                            <button className='tool-bar-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setDisplay(display === 'display' ? null : 'display');
                                    }
                                }>
                                    {display ? "Ocultar Ficha":"Mostrar Ficha"}
                            </button>
                            <button className='tool-bar-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setShowMetrics(!showMetrics);
                                        affectAllLocks(!showMetrics);
                                    }
                                }>
                                    {!showMetrics ? 'Mostrar Métricas' : 'Ocultar Métricas'}
                            </button>
                            <button className='tool-bar-button' onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setShowAll(!showAll);
                                        affectAllLocks(showAll);
                                    }
                                }>
                                    {showAll ? 'Mostrar Contenido' : 'Ocultar Contenido'}
                            </button>
                        </div>
                        <div className='thinBlackLine'></div>
                    </div>
                    { display === 'display' && 
                    <div className='product-fields-grid'>
                        <div className='new-org-form' id='product-fields-grid-item'>
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgName} disabled/>
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescription} disabled/>
                        </div>
                        <div className='new-org-form' id='product-fields-grid-item'>
                            <div id='small-margin'/>
                            <label className='orgStatus'>Estado</label>
                            <input type="text" className='new-org-input' id='orgStatus' value={orgStatus === 'active' ? 'Activo' : 'Inactivo'} disabled/>
                            <label className="orgBudget">Presupuesto Objetivo</label>
                            <input type="text" className="new-org-input" id="orgBudget" value={"$"+orgBudget} disabled/>
                        </div>
                    </div>}
                    { display === 'edit' && 
                    <div className='product-fields-grid'>
                        <div className="new-org-form" id='product-fields-grid-item'>
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgNameModified} onChange={handleWriteName} />
                            {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescriptionModified} onChange={handleWriteDesc} />
                            {orgDescriptionError !== '' && <div id='red-small-font'>{orgDescriptionError}</div>}
                        </div>
                        <div className="new-org-form" id='product-fields-grid-item'>
                            <div id='small-margin'/>
                            {orgNameError !== '' && <div id='red-small-font'>{orgNameError}</div>}
                            <label className='orgStatus'>Estado</label>
                            <select className='new-org-input' id='orgStatus' value={orgStatusModified} onChange={(e) => setOrgStatusModified(e.target.value)}>
                                <option value='active'>Activo</option>
                                <option value='inactive'>Inactivo</option>
                            </select>
                            <label className="orgBudget">Presupuesto Objetivo</label>
                            <input className="new-org-input" id="orgBudget" value={'$'+orgBudgetModified} onChange={handleWriteBudget} />
                            {orgBudgetError !== '' && <div id='red-small-font'>{orgBudgetError}</div>}
                            <button type="submit" className='submit-button' disabled={
                                orgNameError !== '' || orgBudgetError !== '' || orgDescriptionError !== ''
                                || orgNameModified === '' || orgBudgetModified === '' || (orgName === orgNameModified && orgStatus === orgStatusModified && orgBudget === orgBudgetModified && orgDescription === orgDescriptionModified)
                            } onClick={
                                handleEdit
                            }>Confirmar</button>
                            <button className='submit-button' id='red-button' onClick={
                                (e) => {
                                    e.preventDefault();
                                    setDisplay(display === 'edit' ? null : 'edit');
                                    setOrgNameModified(orgName);
                                    setOrgStatusModified(orgStatus);
                                    setOrgBudgetModified(orgBudget);
                                    setOrgDescriptionModified(orgDescription);
                                }
                            }>Cancelar</button>
                        </div>
                    </div>}
                    { showMetrics && 
                    <>
                        <h2 id='detail-title'>Métricas de {orgName}</h2>
                        <div className='tool-bar-adapter-subp'>
                            <div className='thinBlackLine'/>
                        </div>
                        <div className='metricsGrid'>
                            <h2 id='total-unit'>Total en {orgName}: ${
                                //sum all the values of the products assets and consumables
                                sum(assets.map((product) => {
                                    return product.value;
                                }
                                )) + sum(consumables.map((product) => {
                                    return product.value;
                                })) 
                            }</h2>
                            <h2 id='total-unit'>Valor con depreciación: ${
                                sum(assets.map((product) => {
                                    return product.actualValue;
                                }
                                )) + sum(consumables.map((product) => {
                                    return product.actualValue;
                            })) 
                            }</h2>
                        </div>
                    </>}
                    {showMetrics && <div className='tool-bar-adapter-subp'>
                            <div className='thinBlackLine'/>
                        </div>}
                    {<>   
                    <h2 id='detail-title'>Productos Activos</h2>
                    {assets.length > 0 ? assets.map((product, index) => {
                        return(
                            <div className='product2-entry'>
                                <div className={`products2Container ${assetLocks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='product2Info'>
                                        <p onClick={toggleAssetLock(index)} id='ex-left'>{product.prefix}-{product.name}</p>
                                        <p onClick={toggleAssetLock(index)} >Valor: ${product.value}</p>
                                        <p onClick={toggleAssetLock(index)} >Valor Estimado: ${product.actualValue}</p>
                                        <p onClick={toggleAssetLock(index)} id='ex-right'>{product.units.length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id='yellow-circle'></div>}</p>
                                        <div className='product2-lock'>
                                            <input type='checkbox' className='main-check' id={'a-checkbox-'+index} onClick={toggleAllAssetUnitOptions(index)} disabled={
                                                assetLocks[index] === 0
                                            }/>
                                        </div>
                                    </div>
                                    { assetLocks[index] === 1 && product.units.length > 0 && <div className='blackLine'/>}
                                    { assetLocks[index] === 1 && product.units.length > 0 && product.type === 'asset' &&
                                        <div className='products2-grid'>
                                            <div className='products2-grid-header' onClick={assetOrderBy('sku',index)}> SKU </div>
                                            <div className='products2-grid-header' onClick={assetOrderBy('price',index)}> Precio </div>
                                            <div className='products2-grid-header' onClick={assetOrderBy('deprecatedValue', index)}> Valor Estimado </div>
                                            <div className='products2-grid-header' onClick={assetOrderBy('purchaseDate', index)}> Fecha de compra </div>
                                            <div className='products2-grid-header' onClick={assetOrderBy('responsible', index)}> Responsable </div>
                                            <div className='products2-grid-header'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                        {
                                            product.units.map((unit, i) => {
                                                return(
                                                    <>
                                                        <div className='products2-grid-item'> {unit.sku} </div>
                                                        <div className='products2-grid-item'> ${unit.price} </div>
                                                        <div className='products2-grid-item'> ${unit.deprecatedValue} </div>
                                                        <div className='products2-grid-item'> {transformDate(unit.purchaseDate)} </div>
                                                        <div className='products2-grid-item'> {unit.responsible} </div>
                                                        <input type='checkbox' className='products2-grid-item unit-check' id={'a-checkbox-'+index+'-'+i} onClick={toggleAssetUnitOptions(i, index)}/>
                                                        {i+1 < product.units.length &&  <>
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
                                {assetLocks[index]===1 && sum(assetUnitLocks[index]) > 0 && product.type === 'asset' && accessLevel !== 'view' && <div className='product2-options'>
                                    <button className='product2-button' onClick={()=>{
                                        setChangeSubproyectLock((index === changeSubproyectLock && 'asset' === changeSubproyectType) ? -1 : index);
                                        setChangeSubproyectType('asset');
                                    }}>
                                        Modificar Subproyecto
                                    </button>
                                    <button className='product2-button' onClick={() => {
                                    if(index !== responsibleLock){
                                        setNewResponsible('');
                                        setResponsibleLock(index);
                                    }else{setResponsibleLock(-1)}
                                }}>Modificar Responsable</button>
                                    <button className='product2-button' id='red' onClick={
                                        (e) => {
                                            e.preventDefault();
                                            handleReturn('asset', index);
                                        }
                                    }>Retornar a Stock</button>
                                    <button className='product2-button' id='red' onClick={
                                        (e) => {
                                            e.preventDefault();
                                            handleModifyResponsible('', 'asset', index);
                                        }
                                    } >Quitar Responsable</button>
                                </div>}
                                {
                                    assetLocks[index]===1 && sum(assetUnitLocks[index]) > 0 && product.type === 'asset' && responsibleLock === index && 
                                    <>
                                        <label className='orgName'>Responsable</label>
                                        <input type='text' className='new-org-input' id='orgName' placeholder='Escribe un nuevo responsable' value={newResponsible} onChange={handleWriteResponsible}/>
                                        <button className='submit-button' onClick={
                                            (e) => {
                                                e.preventDefault();
                                                handleModifyResponsible(newResponsible, 'asset', index);
                                            }
                                        }>Confirmar</button>
                                        <h3></h3>
                                    </>
                                }
                                {
                                    assetLocks[index] === 1 && product.type === 'asset'  && changeSubproyectLock === index && changeSubproyectType === 'asset' &&
                                    <>
                                    <label className='orgName'>Proyecto</label>
                                    <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                                        <option value={0} disabled>Seleccionar</option>
                                        {subproyects.map((subproyect) => {
                                            return <option value={subproyect.subproyectId}>{subproyect.name} ({subproyect.proyectName})</option>
                                        })}
                                    </select>
                                    <button className='submit-button' onClick={
                                        (e)=>{handleAssign(e, 'asset', index);toggleProyectSelect();}
                                    } >Confirmar</button>
                                    <h3></h3>
                                    </>
                                }
                            </div>
                    )}):
                    <h3>
                        No hay productos activos
                    </h3>
                    }
                    <h2 id='detail-title'>Productos Consumibles</h2>
                    {consumables.length > 0 ?
                    consumables.map((product, index) => {          
                        return(
                            <div className='product2-entry'>
                                <div className={`products2Container ${consLocks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='product2Info'>
                                        <p onClick={toggleConsLock(index)}id='ex-left'>{product.prefix}-{product.name}</p>
                                        <p onClick={toggleConsLock(index)}>Valor: ${product.value}</p>
                                        <p onClick={toggleConsLock(index)}>Valor Estimado: ${product.actualValue}</p>
                                        <p onClick={toggleConsLock(index)}id='ex-right'>{product.units.length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id='yellow-circle'></div>}</p>
                                        <div className='product2-lock'>
                                            <input type='checkbox' className='main-check' id={'c-checkbox-'+index} onClick={toggleAllConsUnitOptions(index)} disabled={
                                                consLocks[index] === 0
                                            }/>
                                        </div>
                                    </div>
                                    { consLocks[index] === 1 && product.units.length > 0 && <div className='blackLine'/>}
                                    { consLocks[index] === 1 && product.units.length > 0 && product.type === 'consumable' &&
                                        <div className='products2-grid'>
                                            <div className='products2-grid-header' onClick={consOrderBy('sku',index)}> SKU </div>
                                            <div className='products2-grid-header' onClick={consOrderBy('price',index)}> Precio </div>
                                            <div className='products2-grid-header' onClick={consOrderBy('deprecatedValue', index)}> Valor Estimado </div>
                                            <div className='products2-grid-header' onClick={consOrderBy('purchaseDate', index)}> Fecha de compra </div>
                                            <div className='products2-grid-header' onClick={consOrderBy('responsible', index)}> Descripción </div>
                                            <div className='products2-grid-header'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                            <div className='blackLine'/>
                                        {
                                            product.units.map((unit, i) => {
                                                return(
                                                    <>
                                                        <div className='products2-grid-item'> {unit.sku} </div>
                                                        <div className='products2-grid-item'> ${unit.price} </div>
                                                        <div className='products2-grid-item'> ${unit.deprecatedValue} </div>
                                                        <div className='products2-grid-item'> {transformDate(unit.purchaseDate)} </div>
                                                        <div className='products2-grid-item'> {unit.description} </div>
                                                        <input type='checkbox' className='products2-grid-item unit-check' id={'c-checkbox-'+index+'-'+i} onClick={toggleConsUnitOptions(i, index)}/>
                                                        {i+1 < product.units.length &&  <>
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
                                {consLocks[index] === 1 && sum(consUnitLocks[index]) > 0 && product.type === 'consumable' && accessLevel !== 'view' && <div className='product2-options'>
                                    <button className='product2-button' onClick={()=>{
                                        setChangeSubproyectLock((index === changeSubproyectLock && 'consumable' === changeSubproyectType) ? -1 : index);
                                        setChangeSubproyectType('consumable');
                                    }}>
                                        Modificar Subproyecto
                                    </button>
                                    <button className='product2-button' id='red' onClick={
                                        (e) => {
                                            e.preventDefault();
                                            handleReturn('consumable', index);
                                        }
                                    }>Retornar a Stock</button>
                                </div>}
                                {
                                    returnLock === index && consMainChecks[index] === 1 && product.type === 'consumable' && 
                                    <>
                                        <label className='orgName'>Cantidad a retornar</label>
                                        <input type='number' className='new-org-input' id='orgName' placeholder='Escribe la cantidad a retornar' value={amount} onChange={(e) => setAmount(e.target.value)}/>
                                        <button className='submit-button'>Confirmar</button>
                                        <h3></h3>
                                    </>
                                
                                }
                                {
                                        consLocks[index] === 1 && product.type === 'consumable'  && changeSubproyectLock === index && changeSubproyectType === 'consumable' &&
                                        <>
                                        <label className='orgName'>Proyecto</label>
                                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                                            <option value={0} disabled>Seleccionar</option>
                                            {subproyects.map((subproyect) => {
                                                return <option value={subproyect.subproyectId}>{subproyect.name} ({subproyect.proyectName})</option>
                                            })}
                                        </select>
                                        <button className='submit-button' onClick={
                                            (e)=>{handleAssign(e, 'consumable', index);toggleProyectSelect();}
                                        } >Confirmar</button>
                                        <h3></h3>
                                        </>
                                    }
                            </div>
                    )}):
                    <h3>
                        No hay productos activos
                    </h3>
                    }
                    </>}
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