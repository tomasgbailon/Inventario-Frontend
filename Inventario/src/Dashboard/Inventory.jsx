import './Inventory.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SecondNavBar from './SecondNavBar';
import { DashboardContext } from './Dashboard';
import { SearchContext } from './Dashboard.jsx';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidePopOver from '../Tools/PopOver/SidePopOver';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Inventory() {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { organizationId, inventoryId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [categories, setCategories] = useState([]);
    const [hideEmpty, setHideEmpty] = useState(false);
    const [showAll, setShowAll] = useState(true);
    const [backUpCategories, setBackUpCategories] = useState([]);
    const [locks, setLocks] = useState(categories.map(() => 0));
    const [orderDirection, setOrderDirection] = useState(categories.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [accessLevel, setAccessLevel] = useState('');
    const [orgName, setOrgName] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
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
        let newProducts = [...categories[index].products];
        const func = {
            'name':0,
            'prefix':1,
            'totalValue':2,
            'units':3,
            'available':4,
            'inUse':5,
            'unavailable':6,
            'updatedAt':7,
            'actualValue': 8
        }
        if (orderDirection[index][func[key]] === 0) {
            toggleOrderDirection(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleOrderDirection(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newCategories = [...categories];
        newCategories[index].products = newProducts;
        setCategories(newCategories);
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
                //console.log(error);
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
            setLocks(response.data.map(() => 0));
            setOrderDirection(response.data.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        }).catch((error) => {
            if (currentTry < 3) {
                getCategories(token, currentTry+1);
            } else {
                console.log(error);
            }
        })
    }
    const affectAllLocks = async (open) => {
        if (open){
            setLocks(categories.map(() => 1));
        } else {
            setLocks(categories.map(() => 0));
        }
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
    useEffect(() => {
        if (searchTerm !== '') {
            const newCategories = backUpCategories.map((category) => {
                const newProducts = category.products.filter((product) => {
                    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.prefix.toLowerCase().includes(searchTerm.toLowerCase());
                });
                return {...category, products: newProducts};
            });
            setCategories(newCategories);
            // setLocks(newCategories.map(() => 1));
            setOrderDirection(newCategories.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        } else {
            setCategories(backUpCategories);
            // setLocks(backUpCategories.map(() => 0));
            setOrderDirection(backUpCategories.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        }
    }, [searchTerm]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            { ((userId !== 0 || isAuthenticated) && accessLevel !== '') ?
                <div className="inventory">
                <NavBar selection={1} />
                <SecondNavBar selection={1} accessLevel={accessLevel}/>
                <div className="inventory-body">
                    <h1 id='title'>{orgName}</h1>
                    <SearchContext.Provider value ={{searchTerm, setSearchTerm}}>
                        <SearchBar defaultText={'buscar productos...'}/>
                    </SearchContext.Provider>
                    <div className='tool-bar'>
                        <button disabled={accessLevel !== 'admin' && accessLevel !== 'owner' && accessLevel !== 'edit'} 
                            className='tool-bar-button' id='blue-button' onClick={
                            (e) => {
                                e.preventDefault();
                                navigate('/create/cat/'+organizationId+'/');
                            }
                        }>Nueva Categoría</button>
                        <button disabled={accessLevel !== 'admin' && accessLevel !== 'owner' && accessLevel !== 'edit'} 
                            className='tool-bar-button' id='blue-button' onClick={
                        (e) => {
                            e.preventDefault();
                            navigate('/create/prod/'+organizationId+'/'+inventoryId+'/');
                        }
                        }>Nuevo Producto</button>
                        <button
                            className='tool-bar-button' id='blue-button' onClick={
                        (e) => {
                            e.preventDefault();
                            const date = new Date();
                            const start = date.getFullYear()+'-'+(date.getMonth()+1 <= 9 ? ''+date.getMonth()+1 : date.getMonth()+1)+'-'+date.getDate();
                            navigate('/history/inv/'+organizationId+'/'+inventoryId+'?start='+start+'&range=1&page=1&group=daily');
                        }
                        }>Historial</button>
                        <button className='tool-bar-button' onClick={(e) => {
                            e.preventDefault();
                            setHideEmpty(!hideEmpty);
                        }}>
                            {hideEmpty ? 'Mostrar Vacías':'Ocultar Vacías'}
                        </button>
                        <button  className='tool-bar-button' onClick={(e) => {
                            e.preventDefault();
                            setShowAll(!showAll);
                            affectAllLocks(showAll);
                        }}>
                            {showAll ? 'Abrir todas':'Cerrar todas'}
                        </button>
                    </div>
                    <div className='thinBlackLine'></div>
                    <div className='titleContainer'>
                        <h1 id='categories-h1'> Categorías</h1>
                    </div>
                    {
                        categories.length > 0 ? categories.map((category, index) => {
                            if(!hideEmpty || category.products.length > 0)
                            return (
                                <div className='entry'>
                                <div className={`categoryContainer ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='categoryInfo'  onClick={toggleLock(index)}>
                                        <p id='big-font' className='flex-start'>{category.prefix} - {category.name}</p>
                                        <p>{category.products.length} productos</p>
                                    </div>
                                    { locks[index] === 1 && category.products.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && category.products.length > 0 && 
                                    <div className='products-grid'>
                                        <div className='products-grid-header' onClick={orderBy('name',index)}>Nombre</div>
                                        <div className='products-grid-header' onClick={orderBy('prefix',index)}>Prefijo</div>
                                        <div className='products-grid-header' onClick={orderBy('totalValue',index)}>Valor Compra</div>
                                        <div className='products-grid-header' onClick={orderBy('actualValue',index)}>Valor Estimado</div>
                                        <div className='products-grid-header' onClick={orderBy('units',index)}>Unidades</div>
                                        <div className='products-grid-header' onClick={orderBy('available',index)}><div className='little-circle' id='green-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('inUse',index)}><div className='little-circle' id='yellow-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('unavailable',index)}><div className='little-circle' id='red-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('updatedAt',index)}>Última modificación</div>
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
                                            category.products.map((product, index) => {
                                                return (
                                                    <>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.name}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.prefix}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>${product.totalValue}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>${product.actualValue}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.units}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.available}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.inUse}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{product.unavailable}</a></div>
                                                        <div className='products-grid-item'><a onClick={(e) => {e.preventDefault();navigate('/product/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'+product.productId+'/');}}>{transformDate(product.updatedAt)}</a></div>
                                                        {index < category.products.length - 1&&<><div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        </>}
                                                    </>
                                                )
                                            })
                                        }
                                    </div>}
                                </div>
                                { (accessLevel === 'admin' || accessLevel === 'owner' || accessLevel === 'edit') ?
                                    <SidePopOver Buttons={
                                    [
                                        {text: 'Editar', color: 'blue', link: '/edit/cat/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'},
                                        {text: 'Eliminar', color: 'red', link: '/delete/cat/'+organizationId+'/'+inventoryId+'/'+category.categoryId+'/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>:
                                <div></div>
                                }
                                </div>
                            )
                        }) :
                        <h3>
                            No hay categorías para mostrar
                        </h3>
                    }
                </div>
                <Footer />
            </div>:
            <div className="dashboard">
                <h1>
                    Autenticando...
                </h1>
            </div>}
        </DashboardContext.Provider>
    )
}