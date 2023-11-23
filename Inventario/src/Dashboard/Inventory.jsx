import './Inventory.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SecondNavBar from './SecondNavBar';
import { DashboardContext } from './Dashboard';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import SidePopOver from '../Tools/PopOver/SidePopOver';

const inventory = {
    name: 'Inventario 1',
    createdAt: '2021-05-01',
}

const Categories = [
    {
        name: 'Herramientas de construcción',
        createdAt: '2021-05-01',
        updatedAt: '2021-05-02',
        prefix: 'C1',
        categoryId: 1,
        products: [
            {
                productId: 1,
                name: 'Martillo Stanley',
                prefix: 'P1',
                price: 100,
                units: 10,
                available: 10,
                inUse: 0,
                unavailable: 0,
                updatedAt: '2021-05-01'
            },{
                productId: 2,
                name: 'Martillo Bauker',
                prefix: 'P2',
                price: 100,
                units: 10,
                available: 5,
                inUse: 5,
                unavailable: 0,
                updatedAt: '2021-05-01'
            },{
                productId: 3,
                name: 'Martillo Truper',
                prefix: 'P3',
                price: 1000,
                units: 15,
                available: 10,
                inUse: 0,
                unavailable: 5,
                updatedAt: '2021-05-01'
            }

        ]

    },
    {
        name: 'Maquinaria de soldadura',
        createdAt: '2021-05-02',
        updatedAt: '2021-05-03',
        prefix: 'C2',
        categoryId: 2,
        products: [
            {
                productId: 4,
                name: 'Soldadora Einhell',
                prefix: 'P4',
                price: 100,
                units: 10,
                available: 10,
                inUse: 0,
                unavailable: 0,
                updatedAt: '2021-05-01'
            },{
                productId: 5,
                name: 'Soldadora Stanley',
                prefix: 'P5',
                price: 100,
                units: 10,
                available: 5,
                inUse: 5,
                unavailable: 0,
                updatedAt: '2021-05-01'
            },{
                productId: 6,
                name: 'Soldadora Truper',
                prefix: 'P6',
                price: 1000,
                units: 15,
                available: 10,
                inUse: 0,
                unavailable: 5,
                updatedAt: '2021-05-01'
            }
        ],
    },
    {
        name: 'Categoría 3',
        createdAt: '2021-05-03',
        updatedAt: '2021-05-04',
        prefix: 'C3',
        categoryId: 3,
        products: [],
    },
    {
        name: 'Categoría 4',
        createdAt: '2021-05-04',
        updatedAt: '2021-05-05',
        prefix: 'C4',
        categoryId: 4,
        products: [],
    },
    {
        name: 'Categoría 5',
        createdAt: '2021-05-05',
        updatedAt: '2021-05-06',
        prefix: 'C5',
        categoryId: 5,
        products: [],
    }
]

export default function Inventory() {
    const { organizationId, inventoryId } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [categories, setCategories] = useState(Categories);
    const [locks, setLocks] = useState(categories.map(() => 0));
    const [orderDirection, setOrderDirection] = useState(categories.map(() => [0, 0, 0, 0, 0, 0, 0, 0]));
    const toggleLock = (index) => () => {
        const newLocks = locks.map((lock, i) => {
            if (i === index) {
                return lock === 0 ? 1 : 0;
            }
            return lock;
        });
        setLocks(newLocks);
    }
    const toggleOrderDirection = (index, key) => () => {
        const newOrderDirection = orderDirection.map((direction, i) => {
            if (i === index) {
                const newDirection = direction.map((dir, j) => {
                    if (j === key) {
                        return dir === 0 ? 1 : 0;
                    }
                    return dir;
                });
                return newDirection;
            }
            return direction;
        });
        setOrderDirection(newOrderDirection);
    }
    const orderBy = (key, index) => () => {
        let newProducts = [...categories[index].products];
        const func = {
            'name':0,
            'prefix':1,
            'price':2,
            'units':3,
            'available':4,
            'inUse':5,
            'unavailable':6,
            'updatedAt':7
        }
        if (orderDirection[index][func[key]] === 0) {
            toggleOrderDirection(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return -1;
                }
                return 1;
            });
        } else {
            toggleOrderDirection(index, func[key])();
            newProducts = newProducts.sort((a, b) => {
                if (a[key] <= b[key]) {
                    return 1;
                }
                return -1;
            });
        }
        const newCategories = [...categories];
        newCategories[index].products = newProducts;
        setCategories(newCategories);
    }
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            <div className="inventory">
                <NavBar selection={1} />
                <SecondNavBar selection={1}/>
                <div className="inventory-body">
                    <h1 className='title'>{inventory.name}</h1>
                    <SearchBar defaultText={'buscar productos...'}/>
                    <div className='create-product'><a href={'/create/prod/'+organizationId+'/'}>Crear nuevo producto</a></div>
                    <div className='titleContainer'>
                        <h1> Categorías</h1>
                        <button className='plusButton'><a href={'/create/cat/'+organizationId+'/'}>+</a></button>
                    </div>
                    {
                        categories.map((category, index) => {
                            return (
                                <div className='entry'>
                                <div className={`categoryContainer ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='categoryInfo'  onClick={toggleLock(index)}>
                                        <p id='big-font' className='flex-start'>{category.prefix} - {category.name}</p>
                                        <p>{category.products.length} productos</p>
                                    </div>
                                    { locks[index] === 1 && category.products.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && category.products.length > 0 && 
                                    <div className='products-grid'>
                                        <div className='products-grid-header' onClick={orderBy('name',index)}>Nombre</div>
                                        <div className='products-grid-header' onClick={orderBy('prefix',index)}>Prefijo</div>
                                        <div className='products-grid-header' onClick={orderBy('price',index)}>Valor Total</div>
                                        <div className='products-grid-header' onClick={orderBy('units',index)}>Unidades</div>
                                        <div className='products-grid-header' onClick={orderBy('available',index)}><div className='little-circle' id='green-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('inUse',index)}><div className='little-circle' id='yellow-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('unavailable',index)}><div className='little-circle' id='red-circle'></div></div>
                                        <div className='products-grid-header' onClick={orderBy('updatedAt',index)}>Última modificación</div>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        {
                                            category.products.map((product, index) => {
                                                return (
                                                    <>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.name}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.prefix}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>${product.price}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.units}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.available}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.inUse}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.unavailable}</a></div>
                                                        <div className='products-grid-item'><a href={'/product/'+organizationId+'/'+inventoryId+'/'+product.productId+'/'}>{product.updatedAt}</a></div>
                                                        {index < category.products.length - 1&&<><div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        <div className='greyLine'/>
                                                        </>}
                                                    </>
                                                )
                                            })
                                        }
                                    </div>}
                                </div>
                                <SidePopOver Buttons={
                                    [
                                        {text: 'Editar', color: 'blue', link: '/edit/cat/'+organizationId+'/'+category.categoryId+'/'},
                                        {text: 'Eliminar', color: 'red', link: '/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>
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