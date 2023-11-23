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

const unit = {
    sku: 'MT-001',
    description: 'Esta es una unidad de prueba',
    unitId: 1,
    productId: 1,
    price: 1000,
    status: 'in use',
    responsible: 'Pedro Manque',
    subproyect: 'Subproyecto 3',
    subproyectId: 3,
    provider: 'Homecenter Sodimac',
    purchaseDate: '2021-05-01',
}

const subproyects = [
    {
        name: 'Subproyecto 1',
        subproyectId: 1,
    },
    {
        name: 'Subproyecto 2',
        subproyectId: 2,
    },
    {
        name: 'Subproyecto 3',
        subproyectId: 3,
    },
]

export default function EditUnit(){
    const {organizationId} = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clickedResult, setClickedResult] = useState({});
    const [orgDescription, setOrgDescription] = useState(unit.description);
    const [orgSku, setOrgSku] = useState(unit.sku);
    const [orgStatus, setOrgStatus] = useState(unit.status);
    const [orgPrice, setOrgPrice] = useState(unit.price);
    const [orgResponsible, setOrgResponsible] = useState(unit.responsible);
    const [orgSubproyect, setOrgSubproyect] = useState(unit.subproyect);
    const [orgProvider, setOrgProvider] = useState(unit.provider);
    const [orgPurchaseDate, setOrgPurchaseDate] = useState(unit.purchaseDate);
    const [count, setCount] = useState(0);
    const handleWriteDesc = (e) => {
        setOrgDescription(e.target.value);
    };
    const handleWriteResponsible = (e) => {
        setOrgResponsible(e.target.value);
    };
    const handleWriteProvider = (e) => {
        setOrgProvider(e.target.value);
    };
    const handleWriteStatus = (e) => {
        setOrgStatus(e.target.value);
    }
    const handleWritePrice = (e) => {
        const price = e.target.value.substring(1);
        setOrgPrice(price);
    }
    const handleWriteDate = (e) => {
        setOrgPurchaseDate(e.target.value);
    }
    const handleWriteSubproyect = (e) => {
        setOrgSubproyect(e.target.value);
    }
    return(
        <SearchContext.Provider value={{searchTerm, setSearchTerm, searchResults, setSearchResults, clickedResult, setClickedResult, count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>{unit.sku}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Estado</label>
                        <select className="new-org-input" id="orgStatus" value={orgStatus} onChange={handleWriteStatus}>
                            <option value="available">Disponible</option>
                            <option value="in use">En uso</option>
                            <option value="unavailable">No disponible</option>
                        </select>
                        <label className="orgName">Precio</label>
                        <input className="new-org-input" id="orgPrice" value={'$'+orgPrice} onChange={handleWritePrice} />
                        {orgStatus === 'in use' && <label className="orgName">Responsable (Opcional)</label>}
                        {orgStatus === 'in use' && <input className="new-org-input" id="orgResponsible" value={orgResponsible} onChange={handleWriteResponsible} />}
                        <label className="orgName">Proveedor (Opcional)</label>
                        <input className="new-org-input" id="orgProvider" value={orgProvider} onChange={handleWriteProvider} />
                        <label className="orgName">Fecha de compra (Opcional)</label>
                        <input type='date' className="new-org-input" id="orgPurchaseDate" value={orgPurchaseDate} onChange={handleWriteDate} />
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" value={orgDescription} onChange={handleWriteDesc} />
                        {orgStatus === 'in use' && <label className='orgName'>Subproyecto (opcional)</label>}
                        {orgStatus === 'in use' && 
                        <select className='new-org-input' id='orgStatus' value={orgSubproyect} onChange={handleWriteSubproyect}>
                            {subproyects.map((subproyect) => {
                                return <option value={subproyect.name}>{subproyect.name}</option>
                            })}
                            <option value=''>Ninguno</option>
                        </select>}
                        <button type="submit" className='submit-button'>Confirmar</button>
                    </div>
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}