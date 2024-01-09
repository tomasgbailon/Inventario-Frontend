import './Organization.css'
import NavBar from './NavBar.jsx';
import SecondNavBar from './SecondNavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar.jsx';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import Circle from '../Tools/Circle';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function getRandColor(char){
    // Map a character from the alphabet to a random color
    const colors = [
        '#21c44d','#cf2017','#c9690e',
        '#e6a519','#98c904','#04c91e',
        '#0ccc69','#0cccaf','#0cb2cc',
        '#0c79cc','#0c39cc','#360ccc',
        '#730ccc','#b60ccc','#cc0ca6',
        '#cc0c5c','#cc0c1c', '#cc3a0c',
    ]
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (char){
        return colors[alphabet.indexOf(char)%colors.length];
    }
}

import {DashboardContext} from './Dashboard.jsx';
import { SearchContext } from './Dashboard.jsx';

export default function Organization() {
    const navigate = useNavigate();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const {organizationId} = useParams();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [orgName, setOrgName] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [editOrg, setEditOrg] = useState([]);
    const [backUpEditOrg, setBackUpEditOrg] = useState([]); // This is used to filter the editOrg and visOrg arrays when the user searches for something
    const [backUpVisOrg, setBackUpVisOrg] = useState([]);
    const [visOrg, setVisOrg] = useState([]);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
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
    const getInventories = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/inventories/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setEditOrg(response.data.edit);
            setBackUpEditOrg(response.data.edit);
            setVisOrg(response.data.view);
            setBackUpVisOrg(response.data.view);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                getInventories(token, currentTry+1);
            }
        })
    
    }
    useEffect(() => {
        if (searchTerm != '') {
            setEditOrg(editOrg.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            }));
            setVisOrg(visOrg.filter((org) => {
                return org.name.toLowerCase().includes(searchTerm.toLowerCase());
            }));
        } else {
            setEditOrg(backUpEditOrg);
            setVisOrg(backUpVisOrg);
        }
    }, [searchTerm]);
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
            getOrg(token, 1);
        }
    }, [userId]);
    useEffect(() => {
        if (orgName !== '') {
            getAccessLevel(token, 1);
        }
    }, [orgName]);
    useEffect(() => {
        if (accessLevel !== '') {
            getInventories(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            {((userId !== 0 || isAuthenticated) && accessLevel !== '') ? <div className="organization">
                <NavBar selection={1}/>
                <SecondNavBar selection={1} accessLevel={accessLevel}/>
                <div className="organizationContent">
                    <div className='titleContainer'>
                        <h1>{orgName} Inventarios</h1>
                        { (accessLevel === 'admin' || accessLevel === 'owner') &&
                            <button className='plusButton'><a onClick={
                                (e) => {
                                    e.preventDefault();
                                    navigate('/create/inv/'+organizationId+'/');
                                }
                            }>+</a></button>}
                    </div>
                    <SearchContext.Provider value ={{searchTerm, setSearchTerm}}>
                        <SearchBar defaultText='Buscar departamento...'/>
                    </SearchContext.Provider>
                    <div className='depsContainer'>
                        <h2>Puedes editar</h2>
                        {editOrg.length > 0 ?<div className='deps-grid'>
                            <div className='deps-grid-header'>Nombre</div>
                            <div className='deps-grid-header'>Fecha de creación</div>
                            <div className='deps-grid-header'>Encargados</div>
                            <div className='deps-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {editOrg.map((org, index) => {
                                return(
                                    <>
                                        <div className='deps-grid-item'><a onClick={
                                            (e) => {
                                                e.preventDefault();
                                                navigate('/inventory/'+organizationId+'/'+org.inventoryId+'/');
                                            }
                                        }>{org.name}</a></div>
                                        <div className='deps-grid-item'>{transformDate(org.createdAt)}</div>
                                        <div className='deps-grid-item' id='circle-grid'>
                                            {org.inCharge.slice(0,Math.min(4,org.inCharge.length)).map((name, index) => {
                                                return(
                                                    <Circle text={name[0]} color={getRandColor(name[0])}/>
                                                )
                                            })}
                                            {org.inCharge.length > 4 ? <Circle text={'+'+(org.inCharge.length-6)} color={'#707070'}/> : null}
                                        </div>
                                        {accessLevel === 'edit' && 
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Editar', color: 'blue', link: '/edit/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                                {text: 'Renunciar', color: 'red', link: '/quit/inv/edit/'+organizationId+'/'+org.inventoryId+'/'},
                                            ]
                                        } mainText="⋮" Id={index + 1} contentStyle={2}/>}
                                        {(accessLevel === 'admin' || accessLevel === 'owner') &&
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Editar', color: 'blue', link: '/edit/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                                {text: 'Editores', color: 'blue', link: '/editors/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                                {text: 'Visores', color: 'blue', link: '/viewers/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                                {text: 'Eliminar', color: 'red', link: '/delete/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                            ]
                                        } mainText="⋮" Id={index + 1} contentStyle={2}/>
                                        } 
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay inventarios para mostrar    
                        </h3>}
                    </div>
                    <div className='depsContainer'>
                        <h2>Solo puedes visualizar</h2>
                        { visOrg.length >0 ? <div className='deps-grid'>
                            <div className='deps-grid-header'>Nombre</div>
                            <div className='deps-grid-header'>Fecha de creación</div>
                            <div className='deps-grid-header'>Encargados</div>
                            <div className='deps-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {visOrg.map((org, index) => {
                                return(
                                    <>
                                        <div className='deps-grid-item'><a onClick={
                                            (e) => {
                                                e.preventDefault();
                                                navigate('/inventory/'+organizationId+'/'+org.inventoryId+'/');
                                            }
                                        }>{org.name}</a></div>
                                        <div className='deps-grid-item'>{transformDate(org.createdAt)}</div>
                                        <div className='deps-grid-item' id='circle-grid'>
                                            {org.inCharge.slice(0,Math.min(4,org.inCharge.length)).map((name, index) => {
                                                return(
                                                    <Circle text={name[0]} color={getRandColor(name[0])}/>
                                                )
                                            })}
                                            {org.inCharge.length > 4 ? <Circle text={'+'+(org.inCharge.length-6)} color={'#c4c4c4'}/> : null}
                                        </div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Renunciar', color: 'red', link: '/quit/inv/view/'+organizationId+'/'+org.inventoryId+'/'},
                                            ]
                                        } mainText="⋮" Id={index + 1} contentStyle={2}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay inventarios para mostrar
                        </h3>
                        }
                    </div>
                </div>
                <Footer/>
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