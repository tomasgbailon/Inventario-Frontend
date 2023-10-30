import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import UserSearch from '../../Tools/UserSearch'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'

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

export default function NewCat(){
    const { organizationId } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [count, setCount] = useState(0);
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
            const results = inventories.filter((user) => {
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
    }, [clickedResult, count]);
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nueva Categoría</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre de la categoría" />
                        <label className="orgName">Prefijo</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Prefijo de la categoría (debe ser único)" />
                        <label className="orgSearch">Agrega Inventarios (opcional)</label>
                        <label className="orgSearch" id='small-font'>*Si se deja en blanco se agregará a todos los inventarios</label>
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
                        <button type="submit" className='submit-button'>Crear</button>
                    </div>
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}