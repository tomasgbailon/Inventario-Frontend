import './Edit/EditOrg.css'
import './SubProyect.css'
import NavBar from './NavBar'
import Footer from './Footer'
import UserSearch from '../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from './Dashboard'
import { SearchContext } from './Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import SecondNavBar from './SecondNavBar'

const subproy = {
    name: 'Subproyecto 1',
    description: 'Descripción de subproyecto 1',
    status: 'active',
    subproyectId: 1,
    budget: 100000,
}

const admins = [
    {
        name: 'aUsuario 1',
        email: 'aab@b.cl',
        userId: 1,
    },
    {
        name: 'aUsuario 2',
        email: 'abb@d.cl',
        userId: 2,
    }
]

const users = [
    {
        name: 'aUsuario 1',
        email: 'aab@b.cl',
        userId: 1,
    },
    {
        name: 'aUsuario 2',
        email: 'abb@d.cl',
        userId: 2,
    },
    {
        name: 'bUsuario 3',
        email: 'aba@f.cl',
        userId: 3,
    },
    {
        name: 'cUsuario 4',
        email: 'aaa@h.cl',
        userId: 4,
    },
    {
        name: 'aUsuario 5',
        email: 'baa@j.cl',
        userId: 5,
    },
    {
        name: 'cUsuario 6',
        email: 'bbb@l.cl',
        userId: 6,
    },
    {
        name: 'dUsuario 7',
        email: 'bab@n.cl',
        userId: 7,
    },
    {
        name: 'bUsuario 8',
        email: 'o@p.cl',
        userId: 8,
    },
]

const getProducts = [
    {
        name: 'Martillo Stanley',
        type: 'asset',
        measurementUnit: 'unidades',
        prefix: 'MRS',
        units: [
            {
                unitId: 1,
                status: 'active',
                price: 10000,
                sku: 'MRS-001',
                responsible: "Pedro Manque"
            },
            {
                unitId: 2,
                status: 'active',
                price: 10000,
                sku: 'MRS-002',
                responsible: "Daickel Chiang"
            },
            {
                unitId: 3,
                status: 'active',
                price: 15000,
                sku: 'MRS-003',
                responsible: "Isaac Jimenez"
            },
            {
                unitId: 4,
                status: 'active',
                price: 12000,
                sku: 'MRS-004',
                responsible: "Daickel Pérez"
            }
        ]
    },
    {
        name: 'Tornillos 1/2"',
        type: 'consumable',
        measurementUnit: 'kg',
        prefix: 'T12',
        units: [{unitId: 1},
        {unitId: 2},
        {unitId: 3},]
    },
    {
        name: 'Soldadora',
        type: 'asset',
        measurementUnit: 'unidades',
        prefix: 'SLD',
        units: [
            {
                unitId: 5,
                status: 'active',
                price: 100000,
                sku: 'SLD-001',
                responsible: "Pedro Manque"
            },
            {
                unitId: 6,
                status: 'active',
                price: 100000,
                sku: 'SLD-002',
                responsible: "Daickel Chiang"
            },
            {
                unitId: 7,
                status: 'active',
                price: 150000,
                sku: 'SLD-003',
                responsible: "Isaac Jimenez"
            },
            {
                unitId: 8,
                status: 'active',
                price: 120000,
                sku: 'SLD-004',
                responsible: "Daickel Pérez"
            }
        ]
    }
]

function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}

export default function SubProyect(){
    const {organizationId} = useParams();
    const [products, setProducts] = useState(getProducts);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState(admins);
    const [orgName, setOrgName] = useState(subproy.name);
    const [orgStatus, setOrgStatus] = useState(subproy.status);
    const [orgBudget, setOrgBudget] = useState(subproy.budget);
    const [orgDescription, setOrgDescription] = useState(subproy.description);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [responsibleLock, setResponsibleLock] = useState(-1);
    const [newResponsible, setNewResponsible] = useState('');
    const [locks, setLocks] = useState(products.map(() => 0));
    const [returnLock, setReturnLock] = useState(-1);
    const [amount, setAmount] = useState(0);
    const [unitLocks, setUnitLocks] = useState(products.map((product) => product.units.map(() => 0)));
    const [mainChecks, setMainChecks] = useState(products.map(() => 0));
    const [orderDirection, setOrderDirection] = useState(products.map(() => [0, 0, 0, 0, 0, 0, 0, 0]));
    const [count, setCount] = useState(0);
    const toggleEditFunc = () => {
        setToggleEdit(!toggleEdit);
    }
    const handleWriteName = (e) => {
        setOrgName(e.target.value);
    };
    const handleWriteDesc = (e) => {
        setOrgDescription(e.target.value);
    };
    const handleWriteBudget = (e) => {
        setOrgBudget(e.target.value);
    };
    const handleWriteResponsible = (e) => {
        setNewResponsible(e.target.value);
    };
    const toggleLock = (index) => () => {
        const newLocks = locks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setLocks(newLocks);
    }
    const deleteResult = (userId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.userId !== userId;
            });
            setSelectedUsers(newSelectedUsers);
        }
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
    const toggleAllUnitOptions = (productIndex) => () => {
        const newMainChecks = mainChecks.map((check,i) => {
            if (i === productIndex){
                return check === 0 ? 1 : 0;
            }
            return check;
        })
        setMainChecks(newMainChecks);
        //get checkbox from id checkbock-productIndex-unitIndex and toggle
        for(let i = 0; i < products[productIndex].units.length; i++){
            const checkbox = document.getElementById('checkbox-'+productIndex+'-'+i);
            if(checkbox.checked !== mainChecks[productIndex]){
                checkbox.checked = mainChecks[productIndex] === 0 ? true : false;
            }
        }
        toggleUnitsBool(productIndex, mainChecks[productIndex] === 0 ? true : false)();
    }
    const orderBy = (key, index) => () => {
        let newUnits = [...products[index].units];
        const func = {
            'sku':0,
            'price':1,
            'responsible':2,
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
        const newCategories = [...products];
        newCategories[index].units = newUnits;
        setProducts(newCategories);
    }
    useEffect(() => {
        if (searchTerm !== '') {
            // TODO: Implement search function in backend
            const results = users.filter((user) => {
                return user.email.toLowerCase().startsWith(searchTerm.toLowerCase());
            });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);
    useEffect(() => {
        const included = selectedUsers.filter((user) => {
            return user.userId === clickedResult.userId && 
            user.name === clickedResult.name && 
            user.email === clickedResult.email;
        });
        if (clickedResult.name !== undefined && included.length === 0) {
            setSelectedUsers([...selectedUsers, clickedResult]);
        }
        console.log(clickedResult);
    }, [clickedResult, count]);
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <SecondNavBar selection={3}/>
                <div className="new-org-content">
                    <h1>{subproy.name}</h1>
                    { !toggleEdit && <div className='new-org-form'>
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgName} disabled/>
                        <label className='orgStatus'>Estado</label>
                        <input type="text" className='new-org-input' id='orgStatus' value={orgStatus === 'active' ? 'Activo' : 'Inactivo'} disabled/>
                        <label className="orgBudget">Presupuesto Objetivo (opcional)</label>
                        <input type="text" className="new-org-input" id="orgBudget" value={"$"+orgBudget} disabled/>
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescription} disabled/>
                        <div className="orgDownBar">
                            <button className='submit-button' id='edit-button' onClick={toggleEditFunc}>Editar</button>
                        </div>
                    </div>}
                    { toggleEdit && <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgName} onChange={handleWriteName} />
                        <label className='orgStatus'>Estado</label>
                        <select className='new-org-input' id='orgStatus' value={orgStatus} onChange={(e) => setOrgStatus(e.target.value)}>
                            <option value='active'>Activo</option>
                            <option value='inactive'>Inactivo</option>
                        </select>
                        <label className="orgBudget">Presupuesto Objetivo (opcional)</label>
                        <input type="number" step={10000} min={0} className="new-org-input" id="orgBudget" value={orgBudget} onChange={handleWriteBudget} />
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescription} onChange={handleWriteDesc} />
                        <label className="orgSearch">Maneja Administradores (opcional)</label>
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
                            <div className='org-searchEntry' id='greyHeader'> Seleccionados </div>
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
                        <button type="submit" className='submit-button'>Confirmar</button>
                        <button className='submit-button' id='red-button' onClick={toggleEditFunc}>Cancelar</button>
                    </div>}
                    {<>   
                    <h2>Detalle</h2>
                    <h3>Productos no consumibles</h3>
                    {products.map((product, index) => {
                        if (product.type === 'asset')
                        return(
                            <div className='product2-entry'>
                                <div className={`products2Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='product2Info'>
                                        <p onClick={toggleLock(index)} id='ex-left'>{product.prefix}-{product.name}</p>
                                        <p onClick={toggleLock(index)} >$100000</p>
                                        <p onClick={toggleLock(index)} id='ex-right'>{product.units.length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id='yellow-circle'></div>}</p>
                                        <div className='product2-lock'>
                                            <input type='checkbox' className='main-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)}/>
                                        </div>
                                    </div>
                                    { locks[index] === 1 && product.units.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && product.units.length > 0 && product.type === 'asset' &&
                                        <div className='products2-grid'>
                                            <div className='products2-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                            <div className='products2-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                            <div className='products2-grid-header' onClick={orderBy('responsible', index)}> Responsable </div>
                                            <div></div>
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
                                                        <div className='products2-grid-item'> {unit.responsible} </div>
                                                        <input type='checkbox' className='products2-grid-item unit-check' id={'checkbox-'+index+'-'+i} onClick={toggleUnitOptions(i, index)}/>
                                                        {i+1 < product.units.length &&  <>
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
                                {locks[index]===1 && sum(unitLocks[index]) > 0 && product.type === 'asset' && <div className='product2-options'>
                                    <button className='product2-button' onClick={() => {if(index !== responsibleLock){setResponsibleLock(index);}else{setResponsibleLock(-1)}}} disabled={sum(unitLocks[index]) != 1}>Modificar Responsable</button>
                                    <button className='product2-button' >Retornar a Stock</button>
                                    <button className='product2-button' id='red' >Quitar Responsable</button>
                                    <button className='product2-button' id='red'>Eliminar </button>
                                </div>}
                                {
                                    locks[index]===1 && sum(unitLocks[index]) === 1 && product.type === 'asset' && responsibleLock === index && <>
                                        <label className='orgName'>Responsable</label>
                                        <input type='text' className='new-org-input' id='orgName' placeholder='Escribe un nuevo responsable' value={newResponsible} onChange={handleWriteResponsible}/>
                                        <button className='submit-button'>Confirmar</button>
                                        <h3></h3>
                                    </>
                                }
                            </div>
                    )})
                    }
                    <h3>Productos consumibles</h3>
                    {products.map((product, index) => { 
                        if (product.type === 'consumable')          
                        return(
                            <div className='product2-entry'>
                                <div className={`products2Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='product2Info'>
                                        <p id='ex-left'>{product.prefix}-{product.name}</p>
                                        <p >$100000</p>
                                        <p id='ex-right'>{product.units.length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id='yellow-circle'></div>}</p>
                                        <div className='product2-lock'>
                                            <input type='checkbox' className='main-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)}/>
                                        </div>
                                    </div>
                                    { locks[index] === 1 && product.units.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && product.units.length > 0 && product.type === 'asset' &&
                                        <div className='products2-grid'>
                                            <div className='products2-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                            <div className='products2-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                            <div className='products2-grid-header' onClick={orderBy('responsible', index)}> Responsable </div>
                                            <div></div>
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
                                                        <div className='products2-grid-item'> {unit.responsible} </div>
                                                        <input type='checkbox' className='products2-grid-item unit-check' id={'checkbox-'+index+'-'+i} onClick={toggleUnitOptions(i, index)}/>
                                                        {i+1 < product.units.length &&  <>
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
                                {mainChecks[index] === 1 && product.type === 'consumable' && <div className='product2-options'>
                                    <button className='product2-button' id='red' onClick={()=>{
                                        if(index !== returnLock){
                                            setReturnLock(index);
                                        } else {
                                            setReturnLock(-1);
                                        }
                                    }}>Retornar Unidades</button>
                                    <button className='product2-button' id='red'>Eliminar </button>
                                </div>}
                                {
                                    returnLock === index && mainChecks[index] === 1 && product.type === 'consumable' && 
                                    <>
                                        <label className='orgName'>Cantidad a retornar</label>
                                        <input type='number' className='new-org-input' id='orgName' placeholder='Escribe la cantidad a retornar' value={amount} onChange={(e) => setAmount(e.target.value)}/>
                                        <button className='submit-button'>Confirmar</button>
                                        <h3></h3>
                                    </>
                                
                                }
                            </div>
                    )})
                    }
                    </>}
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}