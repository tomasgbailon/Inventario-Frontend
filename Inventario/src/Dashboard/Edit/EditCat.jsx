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

const cat = {
    name: 'Categoría 1',
    prefix: 'CAT1',
    description: 'Esta es una categoría de prueba',
    categoryId: 1,
}

const inventories = [
    {
        name: 'Inventario 1',
        prefix: 'INV1',
        createdAt: '2021-05-01',
        inventoryId: 1,
    },
    {
        name: 'Inventario 2',
        prefix: 'INV2',
        createdAt: '2021-05-02',
        inventoryId: 2,
    },
    {
        name: 'Inventario 3',
        prefix: 'INV3',
        createdAt: '2021-05-03',
        inventoryId: 3,
    }
]

const otherInventories = [
    {
        name: 'Inventario 4',
        prefix: 'INV4',
        createdAt: '2021-05-04',
        inventoryId: 4,
    },
    {
        name: 'Inventario 5',
        prefix: 'INV5',
        createdAt: '2021-05-05',
        inventoryId: 5,
    },
    {
        name: 'Inventario 6',
        prefix: 'INV6',
        createdAt: '2021-05-06',
        inventoryId: 6,
    }
]

export default function EditCat(){
    const {organizationId, categoryId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState(inventories);
    const [orgName, setOrgName] = useState(cat.name);
    const [orgPrefix, setOrgPrefix] = useState(cat.prefix);
    const [count, setCount] = useState(0);
    const handleWriteName = (e) => {
        setOrgName(e.target.value);
    };
    const handleWritePrefix = (e) => {
        setOrgPrefix(e.target.value);
    };
    const deleteResult = (inventoryId) => {
        return () => {
            const newSelectedUsers = selectedUsers.filter((user) => {
                return user.inventoryId !== inventoryId;
            });
            setSelectedUsers(newSelectedUsers);
        }
    }
    useEffect(() => {
        if (searchTerm !== '') {
            // TODO: Implement search function in backend
            const results = otherInventories.filter((user) => {
                return user.name.toLowerCase().startsWith(searchTerm.toLowerCase());
            });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);
    useEffect(() => {
        const included = selectedUsers.filter((user) => {
            return user.inventoryId === clickedResult.inventoryId && 
            user.name === clickedResult.name && 
            user.prefix === clickedResult.prefix;
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
                    <h1>Editar {cat.name}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgName} onChange={handleWriteName} />
                        <label className="orgName">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgName" value={orgPrefix} onChange={handleWritePrefix} />
                        <label className="orgSearch">Maneja Inventarios (opcional)</label>
                        <UserSearch defaultText='Buscar inventario...'/>
                        { selectedUsers.length > 0 && <div className="orgSearch-frame">
                            <div className='org-searchEntry' id='greyHeader'> Seleccionados </div>
                            {
                                selectedUsers.map(
                                    (user, index) => {
                                        return (
                                            <div className='org-searchEntry'>
                                                <div className='org-searchResult' key={index}>
                                                    <div id='bold'>{user.name}</div>&nbsp;&nbsp;&nbsp;{user.prefix}
                                                </div>
                                                <FontAwesomeIcon className='trashIcon' onClick={deleteResult(user.inventoryId)} icon={faTrash}/>
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