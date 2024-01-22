import NavBar from "./NavBar";
import Footer from "./Footer";
import SecondNavBar from "./SecondNavBar";
import './History.css';
import { useParams } from "react-router-dom"
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardContext } from "./Dashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";

function translateType(type) {
    switch (type) {
        case 'in':
            return 'Compras';
        case 'out':
            return 'Dadas de baja';
        case 'transfer':
            return 'Salidas';
        case 'return':
            return 'Devoluciones';
        default:
            return '';
    }
}

export default function History() {
    const { type, organizationId, targetId } = useParams();
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [orgName, setOrgName] = useState('');
    const [events, setEvents] = useState([]);
    const query = new URLSearchParams(window.location.search);
    const [range, setRange] = useState(query.get('range'));
    const [startDate, setStartDate] = useState(query.get('start'));
    const [page, setPage] = useState(query.get('page'));
    const [group, setGroup] = useState(query.get('group'));
    const [maxPage, setMaxPage] = useState(0);
    const [buttonUnlock, setButtonUnlock] = useState(false);
    const [accessLevel, setAccessLevel] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const getAccessLevel = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/auth/'+organizationId+'/'+type+'/'+targetId, {
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
    const getEvents = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/events/'+type+'/'+organizationId+'/'+targetId+'?start='+startDate+'&range='+range+'&page='+page+'&group='+group, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setEvents(response.data.events);
            setMaxPage(response.data.maxPage);
        }).catch((error) => {
            if (currentTry < 3) {
                getEvents(token, currentTry + 1);
            }
        })
    }
    const getInv = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId+'/'+targetId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getInv(token, currentTry+1);
            }
        })
    
    }
    const getProy = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/proyects/'+organizationId+'/'+targetId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setOrgName(response.data.name);
        }).catch((error) => {
            if (currentTry < 3) {
                getProy(token, currentTry+1);
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
            getEvents(token, 1);
            if (type === 'inv') {
                getInv(token, 1);
            } else if (type === 'proy') {
                getProy(token, 1);
            }
        }
    }, [accessLevel]);
    useEffect(() => {
        getEvents(token, 1);
    }, [startDate, range, page, group]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            { ((userId !== 0 || isAuthenticated) && accessLevel !== '') ? 
                <div className="history">
                    <NavBar />
                    <SecondNavBar selection={1} accessLevel={accessLevel}/>
                    <div className="history-content">
                        <h1>Historial de {orgName}</h1>
                        <div className="tool-bar">
                            <div className="tool-bar-label">Fecha de partida</div>
                            <input type="date" className='tool-bar-date' value={startDate} onChange={(e) => {
                                setStartDate(e.target.value);
                            }}/>
                            <div className="tool-bar-label">Rango</div>
                            <select className='tool-bar-range' value={range} onChange={(e) => {
                                setRange(e.target.value);
                            }}>
                                <option value="1">Último día</option>
                                <option value="7">Última semana</option>
                                <option value="30">Último mes</option>
                                <option value="90">Último trimestre</option>
                                <option value="180">Último semestre</option>
                                <option value="365">Último año</option>
                            </select>
                            <div className="tool-bar-label">Agrupar</div>
                            <select className='tool-bar-range' value={group} onChange={(e) => {
                                setGroup(e.target.value);
                            }}>
                                <option value="daily">Por día</option>
                                <option value="monthly">Por mes</option>
                                <option value="yearly">Por año</option>
                            </select>
                        </div>
                        {(type === 'inv' || type === 'proy') &&
                            (Object.keys(events)).sort((a, b) => {
                                return new Date(b) - new Date(a);
                            }).map((key) => {
                                return (
                                    <div className="align-left">
                                        <h2 className="history-key">{key}</h2>
                                        {['in','out','transfer','return'].map((type) => {
                                            return (
                                                <>
                                                    {   //If there are no events of this type, don't show the header
                                                        events[key].filter((event) => event.type === type).length > 0 &&
                                                        <>
                                                        <div className="history-inv-grid-top-label">{translateType(type)}: $ 
                                                        {
                                                            events[key].filter((event) => event.type === type).reduce((a, b) => {
                                                                return a + parseInt(b.value);
                                                            }, 0)
                                                        }
                                                        {type === 'in' && <FontAwesomeIcon className="history-icon" icon={faCartPlus} />}
                                                        {type === 'out' && <FontAwesomeIcon className="history-icon" icon={faTrash} />}
                                                        {type === 'transfer' && <FontAwesomeIcon className="history-icon" icon={faPersonDigging} />}
                                                        {type === 'return' && <FontAwesomeIcon className="history-icon" icon={faWarehouse} />}
                                                        </div>
                                                        <div className='greyLine'></div>
                                                        </>
                                                    }
                                                    <div className={"history-inv-grid-"+type}>
                                                        {type === 'in' &&
                                                        events[key].filter((event) => event.type === 'in').length > 0 &&
                                                        ['Producto','Unidades','Destino','Valor','Código Factura'].map((header) => {
                                                            return (
                                                                <div className="history-inv-grid-header">{header}</div>
                                                            )
                                                        })}
                                                        {type === 'out' &&
                                                        events[key].filter((event) => event.type === 'out').length > 0 &&
                                                        ['Producto','Unidades','Destino','Valor'].map((header) => {
                                                            return (
                                                                <div className="history-inv-grid-header">{header}</div>
                                                            )
                                                        })}
                                                        {type === 'transfer' &&
                                                        events[key].filter((event) => event.type === 'transfer').length > 0 &&
                                                        ['Producto','Unidades','Origen','Destino'].map((header) => {
                                                            return (
                                                                <div className="history-inv-grid-header">{header}</div>
                                                            )
                                                        })}
                                                        {type === 'return' &&
                                                        events[key].filter((event) => event.type === 'return').length > 0 &&
                                                        ['Producto','Unidades','Origen','Destino'].map((header) => {
                                                            return (
                                                                <div className="history-inv-grid-header">{header}</div>
                                                            )
                                                        })}
                                                        {events[key].map((event, index) => {
                                                            if (event.type === 'in' && type === 'in')
                                                            return (
                                                                <>
                                                                    {[1,2,3,4,5].map(() => {
                                                                        return(<div className='greyLine'></div>)
                                                                    })}
                                                                    <div className="history-inv-grid-item">{event.product} ({event.category})</div>
                                                                    <div className="history-inv-grid-item">{event.quantity}</div>
                                                                    <div className="history-inv-grid-item">{event.inventory}</div>
                                                                    <div className="history-inv-grid-item">${event.value}</div>
                                                                    <div className="history-inv-grid-item">{event.facturationCode}</div>
                                                                </>
                                                            )
                                                            else if (event.type === 'out' && type === 'out')
                                                            return (
                                                                <>
                                                                    {[1,2,3,4].map(() => {
                                                                        return(<div className='greyLine'></div>)
                                                                    })}
                                                                    <div className="history-inv-grid-item">{event.product} ({event.category})</div>
                                                                    <div className="history-inv-grid-item">{event.quantity}</div>
                                                                    <div className="history-inv-grid-item">{event.inventory}</div>
                                                                    <div className="history-inv-grid-item">${event.value}</div>
                                                                </>
                                                            )
                                                            else if (event.type === 'transfer' && type === 'transfer')
                                                            return (
                                                                <>
                                                                    {[1,2,3,4].map(() => {
                                                                        return(<div className='greyLine'></div>)
                                                                    })}
                                                                    <div className="history-inv-grid-item">{event.product} ({event.category})</div>
                                                                    <div className="history-inv-grid-item">{event.quantity}</div>
                                                                    <div className="history-inv-grid-item">{event.inventory}</div>
                                                                    <div className="history-inv-grid-item">{event.subproyect} ({event.proyect})</div>
                                                                </>
                                                            )
                                                            else if (event.type === 'return' && type === 'return')
                                                            return (
                                                                <>
                                                                    {[1,2,3,4].map(() => {
                                                                        return(<div className='greyLine'></div>)
                                                                    })}
                                                                    <div className="history-inv-grid-item">{event.product} ({event.category})</div>
                                                                    <div className="history-inv-grid-item">{event.quantity}</div>
                                                                    <div className="history-inv-grid-item">{event.subproyect} ({event.proyect})</div>
                                                                    <div className="history-inv-grid-item">{event.inventory}</div>
                                                                </>
                                                            )
                                                        })}
                                                        {type === 'in' &&
                                                        events[key].filter((event) => event.type === type).length > 0 &&
                                                        [1,2,3,4,5].map(() => {
                                                            return(<div className='greyLine'></div>)
                                                        })}
                                                        {(type === 'out' || type === 'transfer' || type === 'return') &&
                                                        events[key].filter((event) => event.type === type).length > 0 &&
                                                        [1,2,3,4].map(() => {
                                                            return(<div className='greyLine'></div>)
                                                        })}
                                                    </div>
                                                    {   //If there are no events of this type, don't show the header
                                                            events[key].filter((event) => event.type === type).length > 0 &&
                                                            <>
                                                                <div id="small-margin"/>
                                                            </>
                                                        }
                                                </>
                                            )
                                        })}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="page-bar">
                        <div className="page-bar-label">Páginas</div>
                        <div className="page-bar-pages">
                            {
                                maxPage > 5 &&
                                <>
                                    {page > 1 && 
                                    <div className="page-bar-page" onClick={() => {
                                        setPage(page-1);
                                    }}><FontAwesomeIcon icon={faChevronLeft} /></div>
                                    }
                                    <div className="page-bar-page" id={page === 1 ? 'currentPage':''} onClick={() => {
                                        setPage(1);
                                    }}>1</div>
                                    <div className="page-bar-page" id={page === 2 ? 'currentPage':''} onClick={() => {
                                        setPage(2);
                                    }}>2</div>
                                    <div className="page-bar-page">...</div>
                                    {page > 2 && page < maxPage-1 &&
                                    <>
                                    <div className="page-bar-page" id={'currentPage'} onClick={() => {
                                        setPage(page);
                                    }}>{page}</div>
                                    <div className="page-bar-page">...</div>
                                    </>
                                    }
                                    <div className="page-bar-page" id={page === maxPage - 1 ? 'currentPage':''} onClick={() => {
                                        setPage(maxPage-1);
                                    }}>{maxPage-1}</div>
                                    <div className="page-bar-page" id={page === maxPage ? 'currentPage':''} onClick={() => {
                                        setPage(maxPage);
                                    }}>{maxPage}</div>
                                    {page < maxPage && 
                                    <div className="page-bar-page" onClick={() => {
                                        setPage(page+1);
                                    }}><FontAwesomeIcon icon={faChevronRight} /></div>
                                    }
                                </>
                            }
                            {   //If there are less than 5 pages, show every page
                                maxPage <= 5 &&
                                <>
                                    {[...Array(maxPage).keys()].map((i) => {
                                        return (
                                            <div className="page-bar-page" id={page === i+1 ? 'currentPage':''} onClick={() => {
                                                setPage(i+1);
                                            }}>{i+1}</div>
                                        )
                                    })}
                                </>
                            }
                        </div>
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