import './Dashboard.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import { useState,createContext } from 'react';

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

export const DashboardContext = createContext();
export const SearchContext = createContext();

export default function Dashboard() {
    const [createdOrgsList, setCreatedOrgsList] = useState(createdOrgs);
    const [administredOrgsList, setAdministredOrgsList] = useState(administredOrgs);
    const [buttonUnlock, setButtonUnlock] = useState(0);
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
        <div className="dashboard">
            <NavBar selection={1}/>
            <div className="dashboardContent">
                <div className='titleContainer'>
                    <h1>Organizaciones</h1>
                    <button className='plusButton'><a href='/create/org/'>+</a></button>
                </div>
                <SearchBar defaultText='Buscar organización...'/>
                <div className='orgsContainer'>
                    <h2>Creadas por ti</h2>
                    <div className='orgs-grid'>
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
                                            {text: 'Eliminar', color: 'red', link: '/'},
                                            {text: 'Otra opción', color: '', link: '/'},
                                        ]
                                    } mainText="⋮" Id={index + 1} contentStyle={1}/>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                    <div className='greyLine'></div>
                                </>
                            )
                        })}
                    </div>
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
                                            {text: 'Renunciar', color: 'red', link: '/'},
                                            {text: 'Otra opción', color: '', link: '/'},
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
            </div>
            <Footer/>
        </div>
        </DashboardContext.Provider>
    )
}