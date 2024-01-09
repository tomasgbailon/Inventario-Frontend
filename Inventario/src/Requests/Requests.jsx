import './Requests.css'
import NavBar from '../Dashboard/NavBar'
import Footer from '../Dashboard/Footer'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard/Dashboard'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Requests(){
    const navigate = useNavigate();
    const { 
        user, // comment for testing
        isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [userId, setUserId] = useState(0)
    const [token, setToken] = useState('');
    const [adminRequests, setAdminRequests] = useState([]);
    const [editRequests, setEditRequests] = useState([]);
    const [viewRequests, setViewRequests] = useState([]);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
    const transformDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0];
        return day + '/' + month + '/' + year;
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
    const getRequests = async (token, currentTry) => {
        await axios.get(import.meta.env.VITE_API_ADDRESS+'/invitations/'+userId, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            console.log(response.data);
            setAdminRequests(response.data.admins);
            setEditRequests(response.data.editors);
            setViewRequests(response.data.viewers);
        }).catch((error) => {
            if (currentTry < 3) {
                getRequests(token, currentTry + 1);
            } else {
                //console.log(error);
            }
        })
    }
    const handleAccept = (e, token, currentTry, invitationId, type, organizationId, inventoryId, proyectId) => {
        e.preventDefault();
        acceptRequest(token, currentTry, invitationId, type, organizationId, inventoryId, proyectId);
    }
    const handleReject = (e, token, currentTry, invitationId) => {
        e.preventDefault();
        rejectRequest(token, currentTry, invitationId);
    }
    const acceptRequest = async (token, currentTry, invitationId, type, organizationId, inventoryId, proyectId) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/invitations/'+invitationId, {
            status: 'accepted',
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getRequests(token, 1);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                acceptRequest(token, currentTry + 1, invitationId);
            } else {
                alert(error);
            }
        })
    }
    const rejectRequest = async (token, currentTry, invitationId) => {
        await axios.put(import.meta.env.VITE_API_ADDRESS+'/invitations/'+invitationId, {
            status: 'rejected',
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            getRequests(token, 1);
        }).catch((error) => {
            if (currentTry < 3 && error.status === 500) {
                rejectRequest(token, currentTry + 1, invitationId);
            } else {
                alert(error);
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
        }
    }, [isAuthenticated]);
    useEffect(() => {
        if (token !== '' && token !== undefined && token !== null ) { 
            getUser(token, 1);
        }
    }, [token]);
    useEffect(() => {
        if (userId != 0) {
            getRequests(token, 1);
        }
    }, [userId]);
    if (isLoading ) {
        return <div className='loading'>Cargando...</div>;
    }
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            { (userId !== 0 || isAuthenticated) ?
                <div className='requests'>
                <NavBar selection={2}/>
                <div className='requests-body'>
                    <div className='titleContainer'>
                        <h1>Solicitudes</h1>
                        <button className='plusButton'><a onClick={
                            (e) => {
                                e.preventDefault();
                                navigate('/create/req/');
                            }
                        }>+</a></button>
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para administrar</h2>
                        {adminRequests.length > 0 ? <div className='reqs-grid-1'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Fecha de recepción</div>
                            <div className='reqs-grid-header'></div>
                            <div className='reqs-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {
                                adminRequests.map((request, index) => (
                                    <>
                                        <div className='reqs-grid-item'>{request.organizationName}</div>
                                        <div className='reqs-grid-item'>{transformDate(request.createdAt)}</div>
                                        <div className='reqs-grid-item'><button className='req-accept' onClick={
                                            (e) => handleAccept(e, token, 1, request.invitationId, 'admin', request.organizationId, request.inventoryId, request.proyectId)
                                        }>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject' onClick={
                                            (e) => handleReject(e, token, 1, request.invitationId)
                                        }>Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>:
                        <h3>
                            No tienes solicitudes para administrar
                        </h3>}
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para editar</h2>
                        {editRequests.length > 0 ? <div className='reqs-grid-2'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Departamento</div>
                            <div className='reqs-grid-header'>Fecha de recepción</div>
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
                                        <div className='reqs-grid-item'>{request.organizationName}</div>
                                        <div className='reqs-grid-item'>{request.inventoryName}</div>
                                        <div className='reqs-grid-item'>{transformDate(request.createdAt)}</div>
                                        <div className='reqs-grid-item'><button className='req-accept' onClick={
                                            (e) => handleAccept(e, token, 1, request.invitationId, 'edit', request.organizationId, request.inventoryId, request.proyectId)
                                        }>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject' onClick={
                                            (e) => handleReject(e, token, 1, request.invitationId)
                                        }>Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>:
                        <h3>
                            No tienes solicitudes para editar
                        </h3>}
                    </div>
                    <div className='requestsContainer'>
                        <h2>Para visualizar</h2>
                        {viewRequests.length > 0 ? <div className='reqs-grid-2'>
                            <div className='reqs-grid-header'>Nombre</div>
                            <div className='reqs-grid-header'>Departamento</div>
                            <div className='reqs-grid-header'>Fecha de recepción</div>
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
                                        <div className='reqs-grid-item'>{request.organizationName}</div>
                                        <div className='reqs-grid-item'>{request.inventoryName}</div>
                                        <div className='reqs-grid-item'>{transformDate(request.createdAt)}</div>
                                        <div className='reqs-grid-item'><button className='req-accept' onClick={
                                            (e) => handleAccept(e, token, 1, request.invitationId, 'view', request.organizationId, request.inventoryId, request.proyectId)
                                        }>Aceptar</button></div>
                                        <div className='reqs-grid-item'><button className='req-reject' 
                                        onClick={(e) => handleReject(e, token, 1, request.invitationId)}
                                        >Rechazar</button></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                ))
                            }
                        </div>:
                        <h3>
                            No tienes solicitudes para visualizar    
                        </h3>}
                    </div>
                </div>
                <Footer/>
            </div>: <div className="dashboard">
                <h1>
                    Autenticando...
                </h1>
            </div>
            }
        </DashboardContext.Provider>
    )
}