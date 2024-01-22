import './Proyects.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SecondNavBar from './SecondNavBar';
import { DashboardContext } from './Dashboard';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidePopOver from '../Tools/PopOver/SidePopOver';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { SearchContext } from './Dashboard.jsx';

export default function Proyects() {
    const navigate = useNavigate();
    const { organizationId } = useParams();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [proyects, setProyects] = useState([]);
    const [backUpProyects, setBackUpProyects] = useState([]); // [0] = proyects, [1] = viewProyects, [2] = locks, [3] = locksView, [4] = orderDirection, [5] = orderDirectionView
    const [viewProyects, setViewProyects] = useState([]);
    const [backUpViewProyects, setBackUpViewProyects] = useState([]);
    const [locks, setLocks] = useState(proyects.map(() => 0));
    const [locksView, setLocksView] = useState(viewProyects.map(() => 0));
    const [orderDirection, setOrderDirection] = useState(proyects.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const [orderDirectionView, setOrderDirectionView] = useState(viewProyects.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const [hideEmpty, setHideEmpty] = useState(false);
    const [showAll, setShowAll] = useState(true);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [accessLevel, setAccessLevel] = useState('');
    const [orgName, setOrgName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
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
    const toggleLockView = (index) => () => {
        const newLocks = locksView.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setLocksView(newLocks);
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
    const toggleOrderDirectionView = (index, key) => () => {
        const newOrderDirection = orderDirectionView.map((direction, i) => {
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
        setOrderDirectionView(newOrderDirection);
    }
    const orderBy = (key, index) => () => {
        let newProducts = [...proyects[index].subproyects];
        const func = {
            'name':0,
            'status':1,
            'budget':2,
            'updatedAt':3,
            'value':4,
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
        const newCategories = [...proyects];
        newCategories[index].subproyects = newProducts;
        setProyects(newCategories);
    }
    const viewOrderBy = (key, index) => () => {
        let newProducts = [...viewProyects[index].subproyects];
        const func = {
            'name':0,
            'status':1,
            'budget':2,
            'updatedAt':3,
        }
        if (orderDirectionView[index][func[key]] === 0) {
            toggleOrderDirectionView(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleOrderDirectionView(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newCategories = [...viewProyects];
        newCategories[index].subproyects = newProducts;
        setViewProyects(newCategories);
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
    const getOrg = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getOrg(token, currentTry+1);
            } else {
                //console.log(error);
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
            setBackUpProyects(response.data.edit);
            setLocks(response.data.edit.map(() => 0));
            setOrderDirection(response.data.edit.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
            setViewProyects(response.data.view);
            setBackUpViewProyects(response.data.view);
            setLocksView(response.data.view.map(() => 0));
            setOrderDirectionView(response.data.view.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        }).catch((error) => {
            if (currentTry < 3) {
                getProyects(token, currentTry+1);
            } else {
                //console.log(error);
            }
        })
    }
    const getBalance = (proyect) => {
        return proyect.budget - proyect.subproyects.reduce((acc, subproyect) => {
            return acc + subproyect.budget;
        }, 0);
    }
    const getRealBalance = (proyect) => {
        return proyect.budget - proyect.subproyects.reduce((acc, subproyect) => {
            return acc + subproyect.value;
        }, 0);
    }
    const getPercentage = (proyect) => {
        const sum = proyect.subproyects.reduce((acc, subproyect) => {
            return acc + subproyect.value;
        }, 0);
        //round to 1 decimal
        return Math.round((sum/proyect.budget)*1000)/10;
    }
    const getBalanceView = (proyect) => {
        if (getBalance(proyect) >= 0){
            return 'positive'
        }
        return 'negative'
    }
    const affectAllLocks = async (open) => {
        if (open){
            setLocks(proyects.map(() => 1));
            setLocksView(viewProyects.map(() => 1));
        } else {
            setLocks(proyects.map(() => 0));
            setLocksView(viewProyects.map(() => 0));
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
            getOrg(token, 1);
            getProyects(token, 1);
        }
    }, [accessLevel]);
    useEffect(() => {
        if (searchTerm !== '') {
            const newProyects = proyects.map((proyect) => {
                const newSubproyects = proyect.subproyects.filter((subproyect) => {
                    return subproyect.name.toLowerCase().includes(searchTerm.toLowerCase());
                });
                const newProyect = {...proyect};
                newProyect.subproyects = newSubproyects;
                return newProyect;
            });
            setProyects(newProyects);
            const newViewProyects = viewProyects.map((proyect) => {
                const newSubproyects = proyect.subproyects.filter((subproyect) => {
                    return subproyect.name.toLowerCase().includes(searchTerm.toLowerCase());
                });
                const newProyect = {...proyect};
                newProyect.subproyects = newSubproyects;
                return newProyect;
            });
            setViewProyects(newViewProyects);
        } else {
            setProyects(backUpProyects);
            setViewProyects(backUpViewProyects);
        }
    }, [searchTerm]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            { (userId !== 0 || isAuthenticated) && (accessLevel !== '') ?
                <div className='proyects'>
                <NavBar selection={1}/>
                <SecondNavBar selection={3} accessLevel={accessLevel}/>
                <div className='proyects-body'>
                    <div className='titleContainer'>
                        <h1>{orgName} Proyectos</h1>
                    </div>
                    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
                        <SearchBar defaultText={'buscar subproyectos...'}/>
                    </SearchContext.Provider>
                    <div className='tool-bar'>
                        <button disabled={accessLevel !== 'admin' && accessLevel !== 'owner'} 
                            className='tool-bar-button' id='blue-button' onClick={
                            (e) => {
                                e.preventDefault();
                                navigate('/create/proy/'+organizationId+'/');
                            }
                        }>Nuevo Proyecto</button>
                        <button disabled={accessLevel !== 'admin' && accessLevel !== 'owner' && accessLevel !== 'edit'} 
                            className='tool-bar-button' id='blue-button' onClick={
                        (e) => {
                            e.preventDefault();
                            navigate('/create/subproy/'+organizationId+'/');
                        }
                        }>Nuevo Subproyecto</button>
                        <select className='tool-bar-button' value={0} id='blue-button'>
                            <option value={0} disabled>Historial</option>
                            {proyects.concat(viewProyects).map((proyect, index) => {
                                return (
                                    <option value={proyect.proyectId} onClick={
                                        (e) => {
                                            e.preventDefault();
                                            const date = new Date();
                                            const start = date.getFullYear()+'-'+(date.getMonth()+1 <= 9 ? ''+date.getMonth()+1 : date.getMonth()+1)+'-'+date.getDate();
                                            navigate('/history/proy/'+organizationId+'/'+proyect.proyectId+'?start='+start+'&range=1&page=1&group=daily');
                                        }
                                    }>{proyect.name}</option>
                                )
                            })}
                        </select>
                        <button className='tool-bar-button' onClick={(e) => {
                            e.preventDefault();
                            setHideEmpty(!hideEmpty);
                        }}>
                            {hideEmpty ? 'Mostrar Vacíos':'Ocultar Vacíos'}
                        </button>
                        <button  className='tool-bar-button' onClick={(e) => {
                            e.preventDefault();
                            setShowAll(!showAll);
                            affectAllLocks(showAll);
                        }}>
                            {showAll ? 'Abrir todos':'Cerrar todos'}
                        </button>
                    </div>
                    <div className='thinBlackLine'></div>
                    <h2>Puedes editar</h2>
                    {
                        proyects.length > 0 ? proyects.map((proyect, index) => {
                            if(!hideEmpty || proyect.subproyects.length > 0)
                            return (
                                <div className='entry'>
                                <div className={`proyectsContainer ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='proyectInfo'  onClick={toggleLock(index)}>
                                        <p id='big-font' className='flex-start'>{proyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>} {proyect.name} </p>
                                        <p>Presupuesto utilizado:
                                            <span id={'balance-'+(getPercentage(proyect)<=100?'positive':'negative')}>{getPercentage(proyect)+'%'}</span>
                                        </p>
                                        <p>Presupuesto: <span id='balance-positive'>${proyect.budget}</span></p>
                                        <p>Balance Presupuestos:
                                            <span id={'balance-'+getBalanceView(proyect)}> ${getBalance(proyect)}</span>
                                        </p>
                                        <p> Balance Real: <span id={'balance-'+(getRealBalance(proyect)>=0?'positive':'negative')}>${getRealBalance(proyect)}</span></p>
                                        <p>{proyect.subproyects.length} subproyectos</p>
                                    </div>
                                    { locks[index] === 1 && proyect.subproyects.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && proyect.subproyects.length > 0 && 
                                    <div className='subproyects-grid'>
                                        <div className='subproyects-grid-header' onClick={orderBy('name',index)}>Nombre</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('status',index)}>Estado</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('budget',index)}>Presupuesto</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('value',index)}>Valor Real</div>
                                        <div className='subproyects-grid-header'>Balance</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('updatedAt',index)}>Última modificación</div>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        {
                                            proyect.subproyects.map((subproyect, index) => {
                                                return (
                                                    <>
                                                        <div className='subproyects-grid-item'><a onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                navigate('/subproy/'+organizationId+"/"+proyect.proyectId+"/"+subproyect.subproyectId);
                                                            }
                                                        }>{subproyect.name}</a></div>
                                                        <div className='subproyects-grid-item'>{subproyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>}</div>
                                                        <div className='subproyects-grid-item'>${subproyect.budget}</div>
                                                        <div className='subproyects-grid-item'>${subproyect.value}</div>
                                                        <div className='subproyects-grid-item'><span 
                                                            id={subproyect.budget-subproyect.value>=0?'balance-positive':'balance-negative'}
                                                        >${subproyect.budget-subproyect.value}</span></div>
                                                        <div className='subproyects-grid-item'>{transformDate(subproyect.updatedAt)}</div>
                                                        {index < proyect.subproyects.length - 1&&<><div className='greyLine'/>
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
                                {   (accessLevel === 'admin' || accessLevel === 'owner') ?
                                    <SidePopOver Buttons={
                                    [
                                        {text: 'Editar', color: 'blue', link: '/edit/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                        {text: 'Editores', color: 'blue', link: '/editors/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                        {text: 'Visores', color: 'blue', link: '/viewers/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                        {text: 'Eliminar', color: 'red', link: '/delete/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>:
                                <SidePopOver Buttons={
                                    [
                                        {text: 'Editar', color: 'blue', link: '/edit/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                        {text: 'Renunciar', color: 'red', link: '/quit/proy/edit/'+organizationId+'/'+proyect.proyectId+'/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>}
                                </div>
                            )
                        }):
                        <h3>
                            No hay proyectos para editar
                        </h3>
                    }
                    <h2>Puedes visualizar</h2>
                    {
                        viewProyects.length > 0 ? viewProyects.map((proyect, index) => {
                            return (
                                <div className='entry'>
                                <div className={`proyectsContainer ${locksView[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='proyectInfo'  onClick={toggleLockView(index)}>
                                    <p id='big-font' className='flex-start'>{proyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>} {proyect.name}</p>
                                        <p>Presupuesto: <span id='balance-positive'>${proyect.budget}</span></p>
                                        <p>Balance Presupuestos:
                                            <span id={'balance-'+getBalanceView(proyect)}> ${getBalance(proyect)}</span>
                                        </p>
                                        <p> Balance Real: <span id={'balance-'+(getRealBalance(proyect)>=0?'positive':'negative')}>${getRealBalance(proyect)}</span></p>
                                        <p>{proyect.subproyects.length} subproyectos</p>
                                    </div>
                                    { locksView[index] === 1 && proyect.subproyects.length > 0 && <div className='blackLine'/>}
                                    { locksView[index] === 1 && proyect.subproyects.length > 0 && 
                                    <div className='subproyects-grid'>
                                        <div className='subproyects-grid-header' onClick={viewOrderBy('name',index)}>Nombre</div>
                                        <div className='subproyects-grid-header' onClick={viewOrderBy('status',index)}>Estado</div>
                                        <div className='subproyects-grid-header' onClick={viewOrderBy('budget',index)}>Presupuesto</div>
                                        <div className='subproyects-grid-header' onClick={viewOrderBy('value',index)}>Valor Real</div>
                                        <div className='subproyects-grid-header'>Balance</div>
                                        <div className='subproyects-grid-header' onClick={viewOrderBy('updatedAt',index)}>Última modificación</div>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        {
                                            proyect.subproyects.map((subproyect, index) => {
                                                return (
                                                    <>
                                                        <div className='subproyects-grid-item'><a onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                navigate('/subproy/'+organizationId+"/"+proyect.proyectId+"/"+subproyect.subproyectId);
                                                            }
                                                        }>{subproyect.name}</a></div>
                                                        <div className='subproyects-grid-item'>{subproyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>}</div>
                                                        <div className='subproyects-grid-item'>${subproyect.budget}</div>
                                                        <div className='subproyects-grid-item'>${subproyect.value}</div>
                                                        <div className='subproyects-grid-item'><span 
                                                            id={subproyect.budget-subproyect.value>=0?'balance-positive':'balance-negative'}
                                                        >${subproyect.budget-subproyect.value}</span></div>
                                                        <div className='subproyects-grid-item'>{transformDate(subproyect.updatedAt)}</div>
                                                        {index < proyect.subproyects.length - 1&&<><div className='greyLine'/>
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
                                <SidePopOver Buttons={
                                    [
                                        {text: 'Renunciar', color: 'red', link: '/quit/proy/view/'+organizationId+'/'+proyect.proyectId+'/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>
                            </div>
                            )
                        }):
                        <h3>
                            No hay proyectos para visualizar
                        </h3>                          
                    }
                    <Footer/>
                </div>
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