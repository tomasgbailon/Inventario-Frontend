import './NewRequest.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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

const users = [
    {
        name: 'aUsuario 1',
        email: 'aab@b.cl',
        userId: 1,
    },
    {
        name: 'aUsuario 2',
        email: 'abb@d.cl',
        userId: 2,
    },
    {
        name: 'bUsuario 3',
        email: 'aba@f.cl',
        userId: 3,
    },
    {
        name: 'cUsuario 4',
        email: 'aaa@h.cl',
        userId: 4,
    },
    {
        name: 'aUsuario 5',
        email: 'baa@j.cl',
        userId: 5,
    },
    {
        name: 'cUsuario 6',
        email: 'bbb@l.cl',
        userId: 6,
    },
    {
        name: 'dUsuario 7',
        email: 'bab@n.cl',
        userId: 7,
    },
    {
        name: 'bUsuario 8',
        email: 'o@p.cl',
        userId: 8,
    },
]

const inventories = [
    {
        name: 'Inventario 1',
        createdAt: '2021-05-01',
        inventoryId: 1,
    },
    {
        name: 'Inventario 2',
        createdAt: '2021-05-02',
        inventoryId: 2,
    },
    {
        name: 'Inventario 3',
        createdAt: '2021-05-03',
        inventoryId: 3,
    },
    {
        name: 'Inventario 4',
        createdAt: '2021-05-04',
        inventoryId: 4,
    },
    {
        name: 'Inventario 5',
        createdAt: '2021-05-05',
        inventoryId: 5,
    },
    {
        name: 'Inventario 6',
        createdAt: '2021-05-06',
        inventoryId: 6,
    },
    {
        name: 'Inventario 7',
        createdAt: '2021-05-07',
        inventoryId: 7,
    },
    {
        name: 'Inventario 8',
        createdAt: '2021-05-08',
        inventoryId: 8,
    },
    {
        name: 'Inventario 9',
        createdAt: '2021-05-09',
        inventoryId: 9,
    },
    {
        name: 'Inventario 10',
        createdAt: '2021-05-10',
        inventoryId: 10,
    },
    {
        name: 'Inventario 11',
        createdAt: '2021-05-11',
        inventoryId: 11,
    },
    {
        name: 'Inventario 12',
        createdAt: '2021-05-12',
        inventoryId: 12,
    },
    {
        name: 'Inventario 13',
        createdAt: '2021-05-13',
        inventoryId: 13,
    },
    {
        name: 'Inventario 14',
        createdAt: '2021-05-14',
        inventoryId: 14,
    },
    {
        name: 'Inventario 15',
        createdAt: '2021-05-15',
        inventoryId: 15,
    },
    {
        name: 'Inventario 16',
        createdAt: '2021-05-16',
        inventoryId: 16,
    },
]

export default function NewRequest(){
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedType, setSelectedType] = useState(1); // 1: Admin, 2: Editor, 3: Viewer
    const [count, setCount] = useState(0);
    const handleSelectedType = (event) => {
        setSelectedType(event.target.value);
    }
    const deleteResult = (userId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.userId !== userId;
            });
            setSelectedUsers(newSelectedUsers);
        }
    }
    useEffect(() => {
        if (searchTerm !== '') {
            // TODO: Implement search function in backend
            const results = users.filter((user) => {
                return user.email.toLowerCase().startsWith(searchTerm.toLowerCase());
            });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);
    useEffect(() => {
        if (clickedResult.name !== undefined && selectedUsers.length === 0) {
            setSelectedUsers([...selectedUsers, clickedResult]);
        }
    }, [clickedResult, count]);
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className='new-req'>
                <NavBar selection={2}/>
                <div className='new-req-content'>
                    <h1>Nueva Solicitud</h1>
                    <div className='new-req-form'>
                        <label htmlFor="org-select">Organización</label>
                        <select name="org-select" id="org-select">
                            {
                                [...createdOrgs, ...administredOrgs].map((org) => {
                                    return <option value={org.organizationId}>{org.name}</option>
                                })
                            }
                        </select>
                        <label htmlFor="perm-type">Tipo de permiso</label>
                        <select name="perm-type" id="perm-type" value={selectedType} onChange={handleSelectedType}>
                            <option value={1}>Administrador</option>
                            <option value={2}>Editor</option>
                            <option value={3}>Visualizador</option>
                        </select>
                        {(selectedType === '3' || selectedType === '2') && <><label htmlFor="inv-select">Inventario</label>
                        <select name="inv-select" id="inv-select">
                            {
                                inventories.map((inv) => {
                                    return <option value={inv.inventoryId}>{inv.name}</option>
                                })
                            }
                        </select></>}
                        <label htmlFor="perm-name">Correo del receptor</label>
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
                            {
                                selectedUsers.map(
                                    (user, index) => {
                                        return (
                                            <div className='org-searchEntry'>
                                                <div className='org-searchResult' key={index}>
                                                    <div id='bold'>{user.name}</div>&nbsp;&nbsp;&nbsp;{user.email}
                                                </div>
                                                <FontAwesomeIcon className='trashIcon' onClick={deleteResult(user.userId)} icon={faTrash}/>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>}
                        <button type="submit" className='submit-button'>Crear</button>
                    </div>
                </div>
                < Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}