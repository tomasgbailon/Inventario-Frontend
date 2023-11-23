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
import { Navigate, useNavigate } from 'react-router-dom';

const getInventory = {
    name: 'Inventario 1',
}

const subproyects = [
    {
        name: 'Subproyecto 1',
        subproyectId: 1,
    },
    {
        name: 'Subproyecto 2',
        subproyectId: 2,
    },
    {
        name: 'Subproyecto 3',
        subproyectId: 3,
    },
]
const product = {
    name: 'Martillo Stanley',
    productId: 1,
    categoryId: 1,
    type: 'asset',
    model:'Model 1',
    brand:'Stanley',
    description:'Martillo de 16 oz',
    measurementUnit:'unidades',
    prefix:'MT',
    price:10000,
}

const getUnits = {
    "available":[
        {productId:1,
    unitId:1,
    subproyectId:null,
    subproyect:null,
    status:'available',
    price:10000,
    purchaseDate:'2021-05-01',
    provider:'Home Center',
    sku:'MT-001',
    responsible:'',
    description:'Martillo de 16 oz',
    },{
    productId:1,
    unitId:2,
    subproyectId:null,
    subproyect:null,
    status:'available',
    price:10000,
    purchaseDate:'2021-05-01',
    provider:'Home Center',
    sku:'MT-002',
    responsible:'',
    description:'Martillo de 16 oz',
    },{
    productId:1,
    unitId:3,
    subproyectId:null,
    subproyect:null,
    status:'available',
    price:10000,
    purchaseDate:'2021-05-01',
    provider:'Home Center',
    sku:'MT-003',
    responsible:'',
    description:'Martillo de 16 oz',
    }],
    "in use":[
        {productId:1,
        unitId:4,
        subproyectId:1,
        proyect:'Proyecto 1',
        subproyect:'Subproyecto 5',
        status:'in use',
        price:10000,
        purchaseDate:'2021-05-01',
        provider:'Home Center',
        sku:'MT-004',
        responsible:'Juan Perez',
        description:'Martillo de 16 oz',
        },{
        productId:1,
        unitId:5,
        subproyectId:1,
        proyect:'Proyecto 1',
        subproyect:'Subproyecto 5',
        status:'in use',
        price:10000,
        purchaseDate:'2021-05-01',
        provider:'Home Center',
        sku:'MT-005',
        responsible:'Juan Perez',
        description:'Martillo de 16 oz',
        },{
        productId:1,
        unitId:6,
        subproyectId:1,
        proyect:'Proyecto 1',
        subproyect:'Subproyecto 4',
        status:'in use',
        price:10000,
        purchaseDate:'2021-05-01',
        provider:'Home Center',
        sku:'MT-008',
        responsible:'Juan Perez',
        description:'Martillo de 16 oz',
        }
    ],
    "unavailable":[
        {
        productId:1,
        unitId:6,
        subproyectId:null,
        subproyect:null,
        status:'unavailable',
        price:10000,
        purchaseDate:'2021-05-01',
        provider:'Home Center',
        sku:'MT-006',
        responsible:'',
        description:'Martillo de 16 oz',
        },{
        productId:1,
        unitId:7,
        subproyectId:null,
        subproyect:null,
        status:'unavailable',
        price:10000,
        purchaseDate:'2021-05-01',
        provider:'Home Center',
        sku:'MT-007',
        responsible:'',
        description:'Martillo de 16 oz',
        }
    ],
}

const getUnits_ = {
    'available':[{
        price: 10000,
        sku: 'MT-001',
        responsible: '',
        description: 'Martillo de 16 oz',
        purchaseDate: '2021-05-01',
        provider: 'Home Center',
        subproyect: null,
        proyect: null,
        count: 1,
    },{
        price: 10000,
        sku: 'MT-002',
        responsible: '',
        description: 'Martillo de 16 oz',
        purchaseDate: '2021-05-01',
        provider: 'Home Center',
        subproyect: null,
        proyect: null,
        count: 1,
    },{
        price: 10000,
        sku: 'MT-003',
        responsible: '',
        description: 'Martillo de 16 oz',
        purchaseDate: '2021-05-01',
        provider: 'Home Center',
        subproyect: null,
        proyect: null,
        count: 1,
    }],
    'in use':[
        {subproyect: 'Subproyecto 1', proyect: 'Proyecto 1', count: 1},
        {subproyect: 'Subproyecto 2', proyect: 'Proyecto 1', count: 2},
        {subproyect: 'Subproyecto 3', proyect: 'Proyecto 1', count: 3},
        {subproyect: 'Subproyecto 4', proyect: 'Proyecto 1', count: 4},
        {subproyect: 'Subproyecto 5', proyect: 'Proyecto 1', count: 5},
    ],
    'unavailable':[],
}

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
export default function Product(){
    const {organizationId} = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(getInventory);
    const [units, setUnits] = useState(getUnits);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [orgName, setOrgName] = useState(product.name);
    const [orgModel, setOrgModel] = useState(product.model);
    const [orgBrand, setOrgBrand] = useState(product.brand);
    const [orgPrefix, setOrgPrefix] = useState(product.prefix);
    const [orgType, setOrgType] = useState(product.type);
    const [orgPrice, setOrgPrice] = useState(product.price);
    const [orgUnits, setOrgUnits] = useState(product.measurementUnit);
    const [orgSubproyect, setOrgSubproyect] = useState('');
    const [orgDescription, setOrgDescription] = useState(product.description);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [proyectSelectLock, setProyectSelectLock] = useState(0);
    const [unitDeleteLock, setUnitDeleteLock] = useState(-1);
    const [locks, setLocks] = useState([0,0,0]);
    const [unitLocks, setUnitLocks] = useState(['available','in use','unavailable'].map((status) => units[status].map(() => 0)));
    const [mainChecks, setMainChecks] = useState([0,0,0]);
    const [orderDirection, setOrderDirection] = useState(['available','in use','unavailable'].map((status) => [0,0,0,0,0,0,0,0,0]));
    const [count, setCount] = useState(0);
    const [returnLock, setReturnLock] = useState(0);
    const [addUnitsLock, setAddUnitsLock] = useState(0);
    const [amount, setAmount] = useState(0);
    const [amount2, setAmount2] = useState(0);
    const [amount3, setAmount3] = useState(0);
    const [amount4, setAmount4] = useState(0);
    const goToEditUnit = (statusIndex) => () => {
        const statuses = ['available','in use','unavailable'];
        const unitIndex = unitLocks[statusIndex].indexOf(1);
        const unit = units[statuses[statusIndex]][unitIndex];
        navigate('/edit/unit/'+organizationId+'/'+unit.productId+'/'+unit.unitId+'/');
    }
    const toggleEditFunc = () => {
        setToggleEdit(!toggleEdit);
    }
    const toggleProyectSelect = () => {
        setProyectSelectLock(proyectSelectLock === 0 ? 1 : 0);
    }
    const handleWriteName = (e) => {
        setOrgName(e.target.value);
    };
    const handleWritePrefix = (e) => {
        setOrgPrefix(e.target.value);
    }
    const handleWriteDesc = (e) => {
        setOrgDescription(e.target.value);
    };
    const handleWriteBrand = (e) => {
        setOrgBrand(e.target.value);
    }
    const handleWriteModel = (e) => {
        setOrgModel(e.target.value);
    }
    const handleWriteUnits = (e) => {
        setOrgUnits(e.target.value);
    }
    const handleWriteSubproyect = (e) => {
        setOrgSubproyect(e.target.value);
    }
    const handleWritePrice = (e) => {
        //Remove $ from string
        const price = e.target.value.substring(1);
        //Update price
        setOrgPrice(parseInt(price));
    }
    const handleAddUnits = () => {
        if(orgType === 'asset'){
            navigate('/create/unit/'+organizationId+'/'+product.productId+'/');
        }else{
            //toggle add units lock
            setAddUnitsLock(addUnitsLock === 0 ? 1 : 0);
        }
    }
    const toggleLock = (index) => () => {
        const newLocks = locks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setLocks(newLocks);
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
            'count':8,
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
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <SecondNavBar selection={1}/>
                    <div className="new-org-content">
                        <h1>{product.name}</h1>
                        { !toggleEdit && 
                        <div className='new-org-form'>
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgName} disabled/>
                            <label className='orgType'>Tipo</label>
                            <input type="text" className='new-org-input' id='orgType' value={orgType === 'asset' ? 'No consumible' : 'Consumible'} disabled/>
                            <label className="orgPrefix">Prefijo</label>
                            <input type="text" className="new-org-input" id="orgPrefix" value={orgPrefix} disabled/>
                            {product.type === 'consumable' && <label className='orgPrice'>Precio de Referencia</label>}
                            {product.type === 'consumable' && <input type="text" className='new-org-input' id='orgPrice' value={'$'+orgPrice} disabled/>}
                            <label className='orgUnits'>Unidad de medida</label>
                            <input type="text" className='new-org-input' id='orgUnits' value={orgUnits} disabled/>
                            <label className="orgBrand">Marca (opcional)</label>
                            <input type="text" className="new-org-input" id="orgBrand" value={orgBrand} disabled/>
                            <label className="orgModel">Modelo (opcional)</label>
                            <input type="text" className="new-org-input" id="orgModel" value={orgModel} disabled/>
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescription} disabled/>
                            <div className="orgDownBar">
                                <button className='submit-button' id='edit-button' onClick={toggleEditFunc}>Editar</button>
                                <button className='submit-button' id='edit-button' onClick={handleAddUnits}>Agregar Unidades</button>
                                <button className='submit-button red' id='edit-button'>Eliminar Producto</button>
                            </div>
                        </div>}
                        { toggleEdit && 
                        <div className="new-org-form">
                            <label className="orgName">Nombre</label>
                            <input type="text" className="new-org-input" id="orgName" value={orgName} onChange={handleWriteName} />
                            <label className='orgType'>Tipo</label>
                            <label className="orgSearch" id='small-font'>*Este campo no es editable</label>
                            <input type="text" className='new-org-input' id='orgType' value={orgType === 'asset' ? 'No consumible' : 'Consumible'} disabled/>
                            <label className='orgPrefix'>Prefijo</label>
                            <input type="text" className='new-org-input' id='orgPrefix' value={orgPrefix} onChange={handleWritePrefix}/>
                            {product.type === 'consumable' && <label className='orgPrice'>Precio de Referencia</label>}
                            {product.type === 'consumable' && <input type="text" className='new-org-input' id='orgPrice' value={'$'+orgPrice} onChange={handleWritePrice}/>}
                            <label className='orgUnits'>Unidad de medida</label>
                            <input type="text" className='new-org-input' id='orgUnits' value={orgUnits} onChange={handleWriteUnits}/>
                            <label className='orgBrand'>Marca (opcional)</label>
                            <input type="text" className='new-org-input' id='orgBrand' value={orgBrand} onChange={handleWriteBrand}/>
                            <label className='orgModel'>Modelo (opcional)</label>
                            <input type="text" className='new-org-input' id='orgModel' value={orgModel} onChange={handleWriteModel}/>
                            <label className="orgDescription">Descripción (opcional)</label>
                            <textarea className="new-org-input" id="orgDescription" value={orgDescription} onChange={handleWriteDesc} />
                            <button type="submit" className='submit-button'>Confirmar</button>
                            <button className='submit-button' id='red-button' onClick={toggleEditFunc}>Cancelar</button>
                        </div>}
                        { addUnitsLock === 1 && orgType === 'consumable' &&
                        <>
                        <label className='orgName'>Cantidad</label>
                        <input type='number' className='new-org-input' min={0} id='orgUnits' value={amount3} onChange={(e)=>{
                            setAmount3(e.target.value);
                        }}/>
                        <button className='submit-button' id='edit-button-2'>Confirmar</button>
                        <h3></h3>
                        </>}
                        <h2>Detalle en {inventory.name}</h2>
                        <h3></h3>
                        {['available','in use','unavailable'].map((status, index) => {
                            if(product.type === 'asset')
                            return(
                                <div className='product3-entry'>
                                    <div className={`products3Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                        <div className='product3Info'>
                                            <p onClick={toggleLock(index)} id='ex-left'>{translate[status]}</p>
                                            <p onClick={toggleLock(index)}>Total: ${totalPrice(units[status])}</p>
                                            <p onClick={toggleLock(index)} id='ex-right'>{units[status].length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id={color[status]+'-circle'}></div>}</p>
                                            <div className='product3-lock'>
                                                <input type='checkbox' checked={sum(unitLocks[index])===unitLocks[index].length} className='main-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)}/>
                                            </div>
                                        </div>
                                        {locks[index] === 1 && units[status].length > 0 && <div className='blackLine'/>}
                                        {locks[index] === 1 && units[status].length > 0 && 
                                            <div className='products3-grid'>
                                                <div className='products3-grid-header' onClick={orderBy('sku',index)}> SKU </div>
                                                <div className='products3-grid-header' onClick={orderBy('price',index)}> Precio </div>
                                                <div className='products3-grid-header' onClick={orderBy('responsible',index)}> Responsable </div>
                                                <div className='products3-grid-header' onClick={orderBy('subproyect',index)}> Subproyecto </div>
                                                <div className='products3-grid-header' onClick={orderBy('provider',index)}> Proveedor </div>
                                                <div className='products3-grid-header' onClick={orderBy('description',index)}> Descripción </div>
                                                <div className='products3-grid-header' onClick={orderBy('purchaseDate',index)}> Fecha de compra </div>
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
                                                                <div className='products3-grid-item'> {unit.sku} </div>
                                                                <div className='products3-grid-item'> ${unit.price} </div>
                                                                <div className='products3-grid-item'> {unit.responsible} </div>
                                                                <div className='products3-grid-item'> {unit.subproyect} </div>
                                                                <div className='products3-grid-item'> {unit.provider} </div>
                                                                <div className='products3-grid-item'> {unit.description} </div>
                                                                <div className='products3-grid-item'> {unit.purchaseDate} </div>
                                                                <input type='checkbox' className='products3-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/>
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
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'available' && 
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button red'>En Uso</button>
                                            <button className='product3-button red'>No Disponible</button>
                                            <button className='product3-button red'>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'in use' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button>
                                            <button className='product3-button' >Disponible</button>
                                            <button className='product3-button red' >No Disponible</button>
                                            <button className='product3-button red'>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'asset' && status === 'unavailable' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' disabled={sum(unitLocks[index]) != 1} onClick={goToEditUnit(index)}>Editar</button> 
                                            <button className='product3-button' >Disponible</button>
                                            <button className='product3-button' >En Uso</button>
                                            <button className='product3-button red'>Eliminar</button>
                                        </div>
                                    
                                    }
                                </div>
                            )
                        })}
                        {['available','in use'].map((status, index) => {
                            if (product.type === 'consumable')
                            return(
                                <div className='product4-entry'>
                                    <div className={`products3Container ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                        <div className='product3Info'>
                                            <p onClick={toggleLock(index)} id='ex-left'>{translate[status]}</p>
                                            <p onClick={toggleLock(index)}>${orgPrice*units[status].length}</p>
                                            <p onClick={toggleLock(index)} id='ex-right'>{units[status].length} unidades &nbsp;&nbsp;&nbsp;&nbsp;{<div className='little-circle' id={color[status]+'-circle'}></div>}</p>
                                            {status === 'in use' ? <div className='product3-lock'>
                                                <input type='checkbox' className='main-check t4-check' id={'checkbox-'+index} onClick={toggleAllUnitOptions(index)}/>
                                            </div> : <div onClick={toggleLock(index)}  className='product3-lock'></div>}
                                        </div>
                                        {locks[index] === 1 && units[status].length > 0 && status === 'in use' && <div className='blackLine'/>}
                                        {locks[index] === 1 && units[status].length > 0 && status === 'in use' &&
                                            <div className='products4-grid'>
                                                <div className='products3-grid-header' onClick={orderBy('proyect',index)}> Proyecto </div>
                                                <div className='products3-grid-header' onClick={orderBy('subproyect',index)}> Subproyecto </div>
                                                <div className='products3-grid-header' onClick={orderBy('count',index)}> Cantidad </div>
                                                <div></div>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                <div className='blackLine'/>
                                                {
                                                    units[status].map((unit, unitIndex) => {
                                                        return(
                                                            <>
                                                                <div className='products3-grid-item'> {unit.proyect} </div>
                                                                <div className='products3-grid-item'> {unit.subproyect} </div>
                                                                <div className='products3-grid-item'> {unit.count} </div>
                                                                <input type='checkbox' className='products3-grid-item unit-check' id={'checkbox-'+index+'-'+unitIndex} onClick={toggleUnitOptions(unitIndex, index)}/>
                                                                {unitIndex+1 < units[status].length &&  <>
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
                                        locks[index] === 1 && orgType === 'consumable' && status === 'available' && 
                                        <div className='product3-options'>
                                            <button className='product3-button' onClick={toggleProyectSelect} >Asignar a Proyecto</button>
                                            <button className='product3-button red' onClick={()=>{
                                                if(unitDeleteLock !== index){
                                                    setUnitDeleteLock(index);
                                                }else{
                                                    setUnitDeleteLock(-1);
                                                }
                                            }}>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && orgType === 'consumable' && status === 'available' && proyectSelectLock === 1  &&
                                        <>
                                        <label className='orgName'>Proyecto</label>
                                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                                            {subproyects.map((subproyect) => {
                                                return <option value={subproyect.name}>{subproyect.name}</option>
                                            })}
                                            <option value=''>Ninguno</option>
                                        </select>
                                        <label className='orgName'>Cantidad</label>
                                        <input type='number' className='new-org-input' min={0} id='orgUnits' value={amount} onChange={(e) => {
                                            setAmount(e.target.value);
                                        }}/>
                                        <button className='submit-button' onClick={toggleProyectSelect} >Confirmar</button>
                                        <h3></h3>
                                        </>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) > 0 && orgType === 'consumable' && status === 'in use' &&
                                        <div className='product3-options'>
                                            <button className='product3-button' onClick={()=>setReturnLock(returnLock === 1 ? 0 : 1)} disabled={sum(unitLocks[index]) != 1}>Retornar a stock</button>
                                            <button className='product3-button red' disabled={sum(unitLocks[index]) != 1} onClick={()=>{
                                                if(unitDeleteLock !== index){
                                                    setUnitDeleteLock(index);
                                                }else{
                                                    setUnitDeleteLock(-1);
                                                }
                                            }}>Eliminar</button>
                                        </div>
                                    }
                                    {
                                        locks[index] === 1 && sum(unitLocks[index]) === 1 && orgType === 'consumable' && status === 'in use' && returnLock === 1 &&
                                        <>
                                        <label className='orgName'>Cantidad</label>
                                        <input type='number' className='new-org-input' min={0} id='orgUnits' value={amount2} onChange={(e)=>{
                                            setAmount2(e.target.value);
                                        }}/>
                                        <button className='submit-button'>Confirmar</button>
                                        <h3></h3>
                                        </>
                                    
                                    }
                                    {
                                        locks[index] === 1 && (sum(unitLocks[index]) === 1 || status === 'available') && orgType === 'consumable' && unitDeleteLock === index &&
                                        <>
                                        <label className='orgName'>Cantidad</label>
                                        <input type='number' className='new-org-input' min={0} id='orgUnits' value={amount4} onChange={(e)=>{
                                            setAmount4(e.target.value);
                                        }}/>
                                        <button className='submit-button red'>Eliminar</button>
                                        <h3></h3>
                                        </>
                                    }
                                </div>
                            )
                        })}
                    </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}