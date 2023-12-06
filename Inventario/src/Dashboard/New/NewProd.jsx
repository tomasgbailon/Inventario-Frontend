import './NewOrg.css'
import NavBar from '../NavBar'
import Footer from '../Footer'
import { useState, useEffect } from 'react'
import { DashboardContext } from '../Dashboard'
import { SearchContext } from '../Dashboard'

const inventory = {
    name: 'Inventario 1',
    description: 'Descripción del inventario 1',
    inventoryId: 1,
    organizationId: 1,
    createdAt: '2021-05-01',
    updatedAt: '2021-05-02',
}

const Categories = [
    {
        name: 'Herramientas de construcción',
        createdAt: '2021-05-01',
        updatedAt: '2021-05-02',
        prefix: 'C1',
        categoryId: 1,
    },
    {
        name: 'Maquinaria de soldadura',
        createdAt: '2021-05-02',
        updatedAt: '2021-05-03',
        prefix: 'C2',
        categoryId: 2,
    },
    {
        name: 'Herramientas de carpintería',
        createdAt: '2021-05-03',
        updatedAt: '2021-05-04',
        prefix: 'C3',
        categoryId: 3,
    },
    {
        name: 'Pinturas y barnices',
        createdAt: '2021-05-04',
        updatedAt: '2021-05-05',
        prefix: 'C4',
        categoryId: 4,
    },
    {
        name: 'Productos de limpieza',
        createdAt: '2021-05-05',
        updatedAt: '2021-05-06',
        prefix: 'C5',
        categoryId: 5,
    }
]

export default function NewProd(){
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [count, setCount] = useState(0);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [measure, setMeasure] = useState('');
    const [prefix, setPrefix] = useState('');
    return(
        <SearchContext.Provider value={{count, setCount}}>
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={1} />
                <div className="new-org-content">
                    <h1>Nuevo Producto</h1>
                    <div className="new-org-form">
                        <label className="category">Categoría</label>
                        <select className="new-org-input" id="category" onChange={(e) => setCategory(e.target.value)}>
                            <option value="" disabled={true}>Selecciona una categoría</option>
                            {Categories.map((category) => {
                                return <option value={category.categoryId}>{category.name}</option>
                            })}
                        </select>
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" placeholder="Nombre del producto" onChange={(e) => setName(e.target.value)} />
                        <label className='type'>Tipo</label>
                        <label id='small-font'>*Herramienta: Admite responsables y espera retorno</label>
                        <label id='small-font'>*Consumible: No admite responsables ni espera retorno</label>
                        <select className="new-org-input" id="type" onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled={true}>Selecciona un tipo</option>
                            <option value="asset">Herramienta</option>
                            <option value="comsumible">Consumible</option>
                        </select>
                        <label className='prefix'>Prefijo</label>
                        <input type="text" className="new-org-input" id="prefix" placeholder="Prefijo" onChange={(e) => setPrefix(e.target.value)} />
                        <label className='measure'>Unidad de medida</label>
                        <input type="text" className="new-org-input" id="measure" placeholder="Unidad de medida (ej: Unidades, Kg, Ton)" onChange={(e) => setMeasure(e.target.value)} />
                        <label className="brand">Marca (opcional)</label>
                        <input type="text" className="new-org-input" id="brand" placeholder="Marca del producto" onChange={(e) => setBrand(e.target.value)} />
                        <label className="model">Modelo (opcional)</label>
                        <input type="text" className="new-org-input" id="model" placeholder="Modelo del producto" onChange={(e) => setModel(e.target.value)} />
                        <label className="orgDescription">Descripción (opcional)</label>
                        <textarea className="new-org-input" id="orgDescription" placeholder="Descripción del producto" onChange={(e) => setDescription(e.target.value)} />
                        <button type="submit" className='submit-button'>Crear</button>
                    </div>
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
        </SearchContext.Provider>
    )
}