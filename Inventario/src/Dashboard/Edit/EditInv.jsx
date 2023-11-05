import './EditOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const inv = {
    name: 'Inventario 1',
    prefix: 'INV1',
    location: 'Sala 1',
    description: 'Este es un inventario de prueba',
    inventoryId: 1,
}
const editors = [
    {
        name: 'aUsuario 1',
        email: 'a@b.cl',
        userId: 1,
    },
    {
        name: 'aUsuario 2',
        email: 'b@c.cl',
        userId: 2,
    }
]

const users = [
    {
        name: 'aUsuario 1',
        email: 'aab@b.cl',
        userId: 9,
    },
    {
        name: 'aUsuario 2',
        email: 'abb@d.cl',
        userId: 10,
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

export default function EditInv(){
    const {organizationId, inventoryId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState(editors);
    const [orgName, setOrgName] = useState(inv.name);
    const [orgPrefix, setOrgPrefix] = useState(inv.prefix);
    const [orgLocation, setOrgLocation] = useState(inv.location);
    const [orgDescription, setOrgDescription] = useState(inv.description);
    const [count, setCount] = useState(0);
    const handleWriteName = (e) => {
        setOrgName(e.target.value);
    };
    const handleWritePrefix = (e) => {
        setOrgPrefix(e.target.value);
    }
    const handleWriteLocation = (e) => {
        setOrgLocation(e.target.value);
    }
    const handleWriteDesc = (e) => {
        setOrgDescription(e.target.value);
    };
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
        const included = selectedUsers.filter((user) => {
            return user.userId === clickedResult.userId && 
            user.name === clickedResult.name && 
            user.email === clickedResult.email;
        });
        if (clickedResult.name !== undefined && included.length === 0) {
            setSelectedUsers([...selectedUsers, clickedResult]);
        }
        console.log(clickedResult);
    }, [clickedResult, count]);
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{inv.name}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgName} onChange={handleWriteName} />
                        <label className="orgPrefix">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgPrefix" value={orgPrefix} onChange={handleWritePrefix} />
                        <label className="orgLocation">Ubicación</label>
                        <input type="text" className="new-org-input" id="orgLocation" value={orgLocation} onChange={handleWriteLocation} />
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescription} onChange={handleWriteDesc} />
                        <label className="orgSearch">Maneja Editores (opcional)</label>
                        <UserSearch defaultText='Buscar usuario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
                            <div className='org-searchEntry' id='greyHeader'> Seleccionados </div>
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
                        <button type="submit" className='submit-button'>Confirmar</button>
                    </div>
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}