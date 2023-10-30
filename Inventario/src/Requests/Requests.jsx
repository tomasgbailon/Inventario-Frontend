import './Requests.css'
import NavBar from '../Dashboard/NavBar'
import Footer from '../Dashboard/Footer'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard/Dashboard'

const adminRequests = [
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
    {
        name: 'Organización 3',
        createdAt: '2021-05-03',
        organizationId: 3,
    }
]

const editRequests = [
    {
        name: 'Organización 4',
        createdAt: '2021-05-04',
        inventory: 'Inventario 1',
        organizationId: 4,
    },
    {
        name: 'Organización 5',
        createdAt: '2021-05-05',
        inventory: 'Inventario 2',
        organizationId: 5,
    },
    {
        name: 'Organización 6',
        createdAt: '2021-05-06',
        inventory: 'Inventario 3',
        organizationId: 6,
    }
]

const viewRequests = [
    {
        name: 'Organización 7',
        createdAt: '2021-05-07',
        inventory:  'Inventario 4',
        organizationId: 7,
    },
    {
        name: 'Organización 8',
        createdAt: '2021-05-08',
        inventory: 'Inventario 5',
        organizationId: 8,
    },
    {
        name: 'Organización 9',
        createdAt: '2021-05-09',
        inventory: 'Inventario 6',
        organizationId: 9,
    }
]

export default function Requests(){
    const [buttonUnlock, setButtonUnlock] = useState(0);
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className='requests'>
                <NavBar selection={2}/>
                <div className='requests-body'>
                    <div className='titleContainer'>
                        <h1>Solicitudes</h1>
                        <button className='plusButton'><a href='/create/req/'>+</a></button>
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para administrar</h2>
                        <div className='reqs-grid-1'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Fecha de creación</div>
                            <div className='reqs-grid-header'></div>
                            <div className='reqs-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {
                                adminRequests.map((request, index) => (
                                    <>
                                        <div className='reqs-grid-item'>{request.name}</div>
                                        <div className='reqs-grid-item'>{request.createdAt}</div>
                                        <div className='reqs-grid-item'><button className='req-accept'>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject'>Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para editar</h2>
                        <div className='reqs-grid-2'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Fecha de creación</div>
                            <div className='reqs-grid-header'>Departamento</div>
                            <div className='reqs-grid-header'></div>
                            <div className='reqs-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {
                                editRequests.map((request, index) => (
                                    <>
                                        <div className='reqs-grid-item'>{request.name}</div>
                                        <div className='reqs-grid-item'>{request.createdAt}</div>
                                        <div className='reqs-grid-item'>{request.inventory}</div>
                                        <div className='reqs-grid-item'><button className='req-accept'>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject'>Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para visualizar</h2>
                        <div className='reqs-grid-2'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Fecha de creación</div>
                            <div className='reqs-grid-header'>Departamento</div>
                            <div className='reqs-grid-header'></div>
                            <div className='reqs-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {
                                viewRequests.map((request, index) => (
                                    <>
                                        <div className='reqs-grid-item'>{request.name}</div>
                                        <div className='reqs-grid-item'>{request.createdAt}</div>
                                        <div className='reqs-grid-item'>{request.inventory}</div>
                                        <div className='reqs-grid-item'><button className='req-accept'>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject'>Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </DashboardContext.Provider>
    )
}