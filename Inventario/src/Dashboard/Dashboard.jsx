import './Dashboard.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import { useState,createContext,useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';

const createdOrgs = [
    {
        name: 'Organización 1',
        createdAt: '2021-05-01',
        organizationId: 1,
    },
    {
        name: 'Organización 2',
        createdAt: '2021-05-02',
        organizationId: 2,
    },
]

const administredOrgs = [
    {
        name: 'Organización 3',
        createdAt: '2021-05-03',
        organizationId: 3,
    },
    {
        name: 'Organización 4',
        createdAt: '2021-05-04',
        organizationId: 4,
    },
]

const editedOrgs = [
    {
        name: 'Organización 5',
        createdAt: '2021-05-05',
        organizationId: 5,
    },
    {
        name: 'Organización 6',
        createdAt: '2021-05-06',
        organizationId: 6,
    },
]

const visOrgs = [
    {
        name: 'Organización 7',
        createdAt: '2021-05-07',
        organizationId: 7,
    },
    {
        name: 'Organización 8',
        createdAt: '2021-05-08',
        organizationId: 8,
    },
]

const user = {
    'sub': 'auth0|6571495dfe17052e1a796138',
}

export const DashboardContext = createContext();
export const SearchContext = createContext();

export default function Dashboard() {
    const { 
        //user,
        isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [createdOrgsList, setCreatedOrgsList] = useState([]);
    const [administredOrgsList, setAdministredOrgsList] = useState(administredOrgs);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    useEffect(() => {
        if (isAuthenticated || true) { // TODO: Cambiar el true por isAuthenticated
            //const token = getAccessTokenSilently();
            const userId = user.sub.split('|')[1];
            axios.get('https://back.outer.cl/organizations/created/'+userId, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
            }).then((response) => {
                setCreatedOrgsList(response.data);
            })

        }
    }, [isAuthenticated]);
    if (isLoading) {
        return <div className='loading'>Cargando...</div>;
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
        {isAuthenticated || true ? <div className="dashboard">
            <NavBar selection={1}/>
            <div className="dashboardContent">
                <div className='dash-titleContainer'>
                    <h1>Organizaciones</h1>
                    <button className='plusButton'><a href='/create/org/'>+</a></button>
                </div>
                <SearchBar defaultText='Buscar organización...'/>
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
                                    <div className='orgs-grid-item'><a href={'/organization/'+org.organizationId+'/'}>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{org.createdAt}</div>
                                    <SidePopOver Buttons={
                                        [
                                            {text: 'Editar', color: 'blue', link: '/edit/org/'+org.organizationId+'/'},
                                            {text: 'Eliminar', color: 'red', link: '/'},
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
                    <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {administredOrgsList.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a href={'/organization/'+org.organizationId+'/'}>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{org.createdAt}</div>
                                    <SidePopOver Buttons={
                                        [
                                            {text: 'Editar', color: 'blue', link: '/edit/org/'+org.organizationId+'/'},
                                            {text: 'Renunciar', color: 'red', link: '/'},
                                        ]
                                    } mainText="⋮" Id={index + createdOrgs.length + 1} contentStyle={1}/>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className='orgsContainer'>
                    <h2>Editadas por ti</h2>
                    <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {editedOrgs.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a href={'/organization/'+org.organizationId+'/'}>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{org.createdAt}</div>
                                    <div className='orgs-grid-item'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>
                </div>
                <div className='orgsContainer'>
                    <h2>Visualizadas por ti</h2>
                    <div className='orgs-grid'>
                        <div className='orgs-grid-header'>Nombre</div>
                        <div className='orgs-grid-header'>Fecha de creación</div>
                        <div className='orgs-grid-header'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        <div className='greyLine'></div>
                        {visOrgs.map((org, index) => {
                            return (
                                <>
                                    <div className='orgs-grid-item'><a href={'/organization/'+org.organizationId+'/'}>{org.name}</a></div>
                                    <div className='orgs-grid-item'>{org.createdAt}</div>
                                    <div className='orgs-grid-item'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer/>
        </div> : <div className="dashboard">
            <h1>
                Debes iniciar sesión para acceder a esta página
            </h1>
        </div>}
        </DashboardContext.Provider>
    )
}