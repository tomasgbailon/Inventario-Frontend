import './Administration.css';
import NavBar from './NavBar.jsx';
import SecondNavBar from './SecondNavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar.jsx';
import SidePopOver from '../Tools/PopOver/SidePopOver';
import Generator from '../Tools/Generator';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {DashboardContext} from './Dashboard.jsx';
import { SearchContext } from './Dashboard.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { createContext } from 'react';

function stringArray(array){
    var string = '';
    for (let i = 0; i < array.length; i++){
        string += array[i].name;
        if (i != array.length - 1){
            string += ', ';
        }
    }
    return string;
}

// create context
export const GeneratorContext = createContext();

export default function Administration() {
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const {organizationId} = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [orgName, setOrgName] = useState('');
    const [accessLevel, setAccessLevel] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(0);
    const [creator, setCreator] = useState([]);
    const [backUpCreator, setBackUpCreator] = useState([]); // [
    const [admins, setAdmins] = useState([]);
    const [backUpAdmins, setBackUpAdmins] = useState([]);
    const [editors, setEditors] = useState([]);
    const [backUpEditors, setBackUpEditors] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [backUpViewers, setBackUpViewers] = useState([]);
    const [createdAt, setCreatedAt] = useState('');
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
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
            setCreatedAt(response.data.createdAt);
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
    const getCreator = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/organizations/creator/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setCreator([response.data])
            setBackUpCreator([response.data])
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getCreator(token, currentTry+1);
            }
        })
    }
    const getAdmins = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/adminpermission/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setAdmins(response.data)
            setBackUpAdmins(response.data)
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getAdmins(token, currentTry+1);
            }
        })
    }
    const getEditors = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/editpermission/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setEditors(response.data)
            setBackUpEditors(response.data)
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getEditors(token, currentTry+1);
            }
        })
    }
    const getViewers = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/viewpermission/'+organizationId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            setViewers(response.data)
            setBackUpViewers(response.data)
        }).catch((error) => {
            if (currentTry < 3 || error.status === 500) {
                getViewers(token, currentTry+1);
            }
        })
    }
    useEffect(() => {
        if (searchTerm !== '') {
            setCreator(creator.filter((creator) => {
                return creator.username.toLowerCase().includes(searchTerm.toLowerCase());
            }));
            setAdmins(admins.filter((admin) => {
                return admin.username.toLowerCase().includes(searchTerm.toLowerCase());
            }));
            setEditors(editors.filter((editor) => {
                return editor.username.toLowerCase().includes(searchTerm.toLowerCase());
            }
            ));
            setViewers(viewers.filter((viewer) => {
                return viewer.username.toLowerCase().includes(searchTerm.toLowerCase());
            }));
        } else {
            setCreator(backUpCreator);
            setAdmins(backUpAdmins);
            setEditors(backUpEditors);
            setViewers(backUpViewers);
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
            getCreator(token, 1);
            getAdmins(token, 1);
            getEditors(token, 1);
            getViewers(token, 1);
        }
    }, [accessLevel]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            {(userId !== 0 && (accessLevel === 'admin' || accessLevel === 'owner')) ? <div className="administration">
                <NavBar selection={1}/>
                <SecondNavBar selection={2} accessLevel={accessLevel}/>
                <div className="administrationContent">
                    <div className='titleContainer'>
                        <h1>Administración {orgName}</h1>
                    </div>
                    <SearchContext.Provider value ={{searchTerm, setSearchTerm}}>
                        <SearchBar defaultText='Buscar miembros...'/>
                    </SearchContext.Provider>
                    <GeneratorContext.Provider value={{token, setToken, organizationId, createdAt, setCreatedAt}}>
                        <Generator text='Generar informe' label='Hasta el día:'/>
                    </GeneratorContext.Provider>
                    <div className='adminContainer'>
                        <h2>Creador</h2>
                        {creator.length > 0 ? <div className='admin-grid'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Correo</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {creator.map((creator) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{creator.username}</div>
                                        <div className='admin-grid-item'>{creator.email}</div>
                                        <div className='admin-grid-item'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay creador
                        </h3>}
                    </div>
                    <div className='adminContainer'>
                        <h2>Administradores</h2>
                        {admins.length > 0 ? <div className='admin-grid'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Correo</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {admins.map((admin, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{admin.username}</div>
                                        <div className='admin-grid-item'>{admin.email}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Despedir', color: 'red', link: '/fire/user/'+organizationId+'/'+admin.email+'/'},
                                            ]
                                        } mainText="⋮" Id={index + 2} contentStyle={5}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay administradores
                        </h3>}
                    </div>
                    <div className='adminContainer'>
                        <h2>Editores</h2>
                        {editors.length > 0 ? <div className='admin-grid' id='triple-column'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Correo</div>
                            <div className='admin-grid-header'>Inventarios</div>
                            <div className='admin-grid-header'>Proyectos</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {editors.map((editor, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{editor.username}</div>
                                        <div className='admin-grid-item'>{editor.email}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(editor.inventories)}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(editor.proyects)}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Administrador', color: 'blue', link: '/make/admin/'+organizationId+'/'+editor.email+'/'},
                                                {text: 'Despedir', color: 'red', link: '/fire/user/'+organizationId+'/'+editor.email+'/'},
                                            ]
                                        } mainText="⋮" Id={admins.length + index + 1} contentStyle={5}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay editores
                        </h3>}
                    </div>
                    <div className='adminContainer'>
                        <h2>Visualizadores</h2>
                        { viewers.length > 0 ? <div className='admin-grid' id='triple-column'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Correo</div>
                            <div className='admin-grid-header'>Inventario</div>
                            <div className='admin-grid-header'>Proyectos</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {viewers.map((viewer, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{viewer.username}</div>
                                        <div className='admin-grid-item'>{viewer.email}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(viewer.inventories)}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(viewer.proyects)}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Administrador', color: 'blue', link: '/make/admin/'+organizationId+'/'+viewer.email+'/'},
                                                {text: 'Despedir', color: 'red', link: '/fire/user/'+organizationId+'/'+viewer.email+'/'},
                                            ]
                                        } mainText="⋮" Id={admins.length + editors.length + index + 1} contentStyle={5}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>:
                        <h3>
                            No hay visualizadores
                        </h3>}
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
    );
}