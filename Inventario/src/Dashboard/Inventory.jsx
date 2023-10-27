import './Inventory.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SecondNavBar from './SecondNavBar';
import { DashboardContext } from './Dashboard';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const inventory = {
    name: 'Inventario 1',
    createdAt: '2021-05-01',
}

const categories = [
    {
        name: 'Categoría 1',
        createdAt: '2021-05-01',
        prefix: 'C1',
        categoryId: 1,
        products: 12,
    },
    {
        name: 'Categoría 2',
        createdAt: '2021-05-02',
        prefix: 'C2',
        categoryId: 2,
        products: 45,
    },
    {
        name: 'Categoría 3',
        createdAt: '2021-05-03',
        prefix: 'C3',
        categoryId: 3,
        products: 23,
    },
    {
        name: 'Categoría 4',
        createdAt: '2021-05-04',
        prefix: 'C4',
        categoryId: 4,
        products: 56,
    },
    {
        name: 'Categoría 5',
        createdAt: '2021-05-05',
        prefix: 'C5',
        categoryId: 5,
        products: 34,
    }
]

export default function Inventory() {
    const { organizationId, inventoryId } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            <div className="inventory">
                <NavBar selection={1} />
                <SecondNavBar selection={1}/>
                <div className="inventory-body">
                    <h1 className='title'>{inventory.name}</h1>
                    <SearchBar defaultText={'buscar productos...'}/>
                    <div className='titleContainer'>
                        <h2> Categorías</h2>
                        <button className='plusButton'><a href='/create/category'>+</a></button>
                    </div>
                    {
                        categories.map((category, index) => {
                            return (
                                <div className='categoryContainer' key={index}>
                                    <div className='categoryInfo'>
                                        <p id='big-font'>{category.prefix} - {category.name}</p>
                                        <div/>
                                        <p>{category.products} productos</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <Footer />
            </div>
        </DashboardContext.Provider>
    )
}