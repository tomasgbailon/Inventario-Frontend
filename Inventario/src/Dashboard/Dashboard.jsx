import './Dashboard.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import { useState,createContext,useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const DashboardContext = createContext();
export const SearchContext = createContext();

export default function Dashboard() {
    const navigate = useNavigate();
    const { 
        user, // comment for testing
        isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [createdOrgsList, setCreatedOrgsList] = useState([]);
    const [backUpCreatedOrgsList, setBackUpCreatedOrgsList] = useState([]);
    const [administredOrgsList, setAdministredOrgsList] = useState([]);
    const [backUpAdministredOrgsList, setBackUpAdministredOrgsList] = useState([]);
    const [editedOrgs, setEditedOrgs] = useState([]);
    const [backUpEditedOrgs, setBackUpEditedOrgs] = useState([]);
    const [visOrgs, setVisOrgs] = useState([]);
    const [backUpVisOrgs, setBackUpVisOrgs] = useState([]);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [userId, setUserId] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]); // comment for testing
    const [email, setEmail] = useState(user?.email); // comment for testing
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
    }
    const getCreatedOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/created/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setCreatedOrgsList(response.data);
            setBackUpCreatedOrgsList(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getCreatedOrgs(token, currentTry + 1);
            } else {
                //console.log(error);
            }
        })
    }
    const getAdministredOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/admin/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setAdministredOrgsList(response.data);
            setBackUpAdministredOrgsList(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getAdministredOrgs(token, currentTry + 1);
            } else {
                //console.log(error);
            }
        })
    }
    const getEditedOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/edit/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setEditedOrgs(response.data);
            setBackUpEditedOrgs(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getEditedOrgs(token, currentTry + 1);
            } else {
                //console.log(error);
            }
        })
    }
    const getVisOrgs = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/view/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setVisOrgs(response.data);
            setBackUpVisOrgs(response.data);
        }).catch((error) => {
            if (currentTry < 3) {
                getVisOrgs(token, currentTry + 1);
            } else {
                //console.log(error);
            }
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
            } else {
                //console.log(error);
            }
        })
    }
    const getToken = async () => {
        await getAccessTokenSilently().then((response) => {
            setToken(response);
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
            getCreatedOrgs(token, 1);
            getAdministredOrgs(token, 1);
            getEditedOrgs(token, 1);
            getVisOrgs(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (searchTerm != '') {
            // filter createdOrgsList, administredOrgsList, editedOrgs, visOrgs
            const filteredCreatedOrgsList = createdOrgsList.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            const filteredAdministredOrgsList = administredOrgsList.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            const filteredEditedOrgs = editedOrgs.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            const filteredVisOrgs = visOrgs.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setCreatedOrgsList(filteredCreatedOrgsList);
            setAdministredOrgsList(filteredAdministredOrgsList);
            setEditedOrgs(filteredEditedOrgs);
            setVisOrgs(filteredVisOrgs);
        } else {
            setCreatedOrgsList(backUpCreatedOrgsList);
            setAdministredOrgsList(backUpAdministredOrgsList);
            setEditedOrgs(backUpEditedOrgs);
            setVisOrgs(backUpVisOrgs);
        }
    }, [searchTerm]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
        {((userId !== 0 || isAuthenticated) || isAuthenticated)  
         ? <div className="dashboard">
            <NavBar selection={1}/>
            <div className="dashboardContent">
                <div className='dash-titleContainer'>
                    <h1>Organizaciones</h1>
                    <button className='plusButton'><a onClick={
                        (e) => {
                            e.preventDefault();
                            navigate('/create/org/');
                        }
                    }>+</a></button>
                </div>
                <SearchContext.Provider value ={{searchTerm, setSearchTerm}}>
                    <SearchBar defaultText='Buscar organización...'/>
                </SearchContext.Provider>
                <div className='orgsContainer'>
                    <h2>Creadas por ti</h2>
                    { createdOrgsList.length > 0 ? <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {createdOrgsList.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a onClick={
                                        (e) => {
                                            e.preventDefault();
                                            navigate('/organization/'+org.organizationId+'/');
                                        }
                                    }>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{transformDate(org.createdAt)}</div>
                                    <SidePopOver Buttons={
                                        [
                                            {text: 'Editar', color: 'blue', link: '/edit/org/'+org.organizationId+'/'},
                                            {text: 'Eliminar', color: 'red', link: '/delete/org/'+org.organizationId+'/'},
                                        ]
                                    } mainText="⋮" Id={index + 1} contentStyle={1}/>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>: 
                    <h3>
                        No has creado organizaciones
                    </h3>}
                </div>
                <div className='orgsContainer'>
                    <h2>Administradas por ti</h2>
                    { administredOrgsList.length > 0 ? <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {administredOrgsList.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a onClick={
                                        (e) => {
                                            e.preventDefault();
                                            navigate('/organization/'+org.organizationId+'/');
                                        }
                                    }>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{transformDate(org.createdAt)}</div>
                                    <SidePopOver Buttons={
                                        [
                                            {text: 'Editar', color: 'blue', link: '/edit/org/'+org.organizationId+'/'},
                                            {text: 'Renunciar', color: 'red', link: '/quit/org/'+org.organizationId+'/'},
                                        ]
                                    } mainText="⋮" Id={index + createdOrgsList.length + 1} contentStyle={1}/>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div> :
                    <h3>
                        No administras ninguna organización
                    </h3>}
                </div>
                <div className='orgsContainer'>
                    <h2>Editadas por ti</h2>
                    { editedOrgs.length > 0 ? <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {editedOrgs.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a onClick={
                                        (e) => {
                                            e.preventDefault();
                                            navigate('/organization/'+org.organizationId+'/');
                                        }
                                    }>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{transformDate(org.createdAt)}</div>
                                    <div className='orgs-grid-item'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>:
                    <h3>
                        No editas ninguna organización
                    </h3>}
                </div>
                <div className='orgsContainer'>
                    <h2>Visualizadas por ti</h2>
                    { visOrgs.length > 0 ? <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {visOrgs.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a onClick={
                                        (e) => {
                                            e.preventDefault();
                                            navigate('/organization/'+org.organizationId+'/');
                                        }
                                    }>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{transformDate(org.createdAt)}</div>
                                    <div className='orgs-grid-item'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>:
                    <h3>
                        No visualizas ninguna organización
                    </h3>}
                </div>
            </div>
            <Footer/>
        </div> : <div className="dashboard">
            <h1>
                Autenticando...
            </h1>
        </div>}
        </DashboardContext.Provider>
    )
}