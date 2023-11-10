import './Proyects.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';
import SecondNavBar from './SecondNavBar';
import { DashboardContext } from './Dashboard';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import SidePopOver from '../Tools/PopOver/SidePopOver';

const getProyects = [
    {
        proyectId: 1,
        name: 'Proyecto 1',
        status: 'active',
        budget: 100000,
        createdAt: '2021-08-01',
        updatedAt: '2021-08-01',
        subproyects: [
            {
                subproyectId: 1,
                name: 'Subproyecto 1',
                status: 'active',
                budget: 10000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            },{
                subproyectId: 2,
                name: 'Subproyecto 2',
                status: 'active',
                budget: 20000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            },{
                subproyectId: 3,
                name: 'Subproyecto 3',
                status: 'active',
                budget: 30000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            }
        ]
    },{
        proyectId: 2,
        name: 'Proyecto 2',
        status: 'active',
        budget: 200000,
        createdAt: '2021-08-01',
        updatedAt: '2021-08-01',
        subproyects: [
            {
                subproyectId: 4,
                name: 'Subproyecto 4',
                status: 'active',
                budget: 40000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            },{
                subproyectId: 5,
                name: 'Subproyecto 5',
                status: 'active',
                budget: 50000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            },{
                subproyectId: 6,
                name: 'Subproyecto 6',
                status: 'active',
                budget: 60000,
                createdAt: '2021-08-01',
                updatedAt: '2021-08-01',
            }
        ]
    }
]

export default function Proyects() {
    const { organizationId } = useParams();
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [proyects, setProyects] = useState(getProyects);
    const [locks, setLocks] = useState(proyects.map(() => 0));
    const [orderDirection, setOrderDirection] = useState(proyects.map(() => [0, 0, 0, 0, 0, 0, 0, 0]));
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
        let newProducts = [...proyects[index].subproyects];
        const func = {
            'name':0,
            'status':1,
            'budget':2,
            'updatedAt':3,
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
        const newCategories = [...proyects];
        newCategories[index].subproyects = newProducts;
        setProyects(newCategories);
    }
    return (
        <DashboardContext.Provider value={{ buttonUnlock, setButtonUnlock, organizationId }}>
            <div className='proyects'>
                <NavBar selection={1}/>
                <SecondNavBar selection={3}/>
                <div className='proyects-body'>
                    <div className='titleContainer'>
                        <h1> Proyectos</h1>
                        <button className='plusButton'><a href={'/create/proy/'+organizationId+'/'}>+</a></button>
                    </div>
                    <SearchBar defaultText={'buscar proyectos...'}/>
                    {
                        proyects.map((proyect, index) => {
                            return (
                                <div className='entry'>
                                <div className={`proyectsContainer ${locks[index] === 1 ? 'open' : ''}`} key={index}>
                                    <div className='proyectInfo'  onClick={toggleLock(index)}>
                                        <p id='big-font' className='flex-start'>{proyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>} {proyect.name}</p>
                                        <p>${proyect.budget}</p>
                                        <p>{proyect.subproyects.length} subproyectos</p>
                                    </div>
                                    { locks[index] === 1 && proyect.subproyects.length > 0 && <div className='blackLine'/>}
                                    { locks[index] === 1 && proyect.subproyects.length > 0 && 
                                    <div className='subproyects-grid'>
                                        <div className='subproyects-grid-header' onClick={orderBy('name',index)}>Nombre</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('status',index)}>Estado</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('budget',index)}>Presupuesto</div>
                                        <div className='subproyects-grid-header' onClick={orderBy('updatedAt',index)}>Última modificación</div>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        <div className='blackLine'/>
                                        {
                                            proyect.subproyects.map((subproyect, index) => {
                                                return (
                                                    <>
                                                        <div className='subproyects-grid-item'>{subproyect.name}</div>
                                                        <div className='subproyects-grid-item'>{subproyect.status === 'active' ? <div className='little-circle' id='green-circle'></div> : <div className='little-circle' id='red-circle'></div>}</div>
                                                        <div className='subproyects-grid-item'>${subproyect.budget}</div>
                                                        <div className='subproyects-grid-item'>{subproyect.updatedAt}</div>
                                                        {index < proyect.subproyects.length - 1&&<><div className='greyLine'/>
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
                                        {text: 'Editar', color: 'blue', link: '/edit/proy/'+organizationId+'/'+proyect.proyectId+'/'},
                                        {text: 'Eliminar', color: 'red', link: '/'},
                                    ]
                                } mainText="⋮" Id={index + 1} contentStyle={3}/>
                                </div>
                            )
                        })
                    }
                    <Footer/>
                </div>
            </div>
        </DashboardContext.Provider>
    )
}