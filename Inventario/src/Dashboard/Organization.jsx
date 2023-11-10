import './Organization.css'
import NavBar from './NavBar.jsx';
import SecondNavBar from './SecondNavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar.jsx';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import Circle from '../Tools/Circle';
import { useState,createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

const org = {
    name: 'Outer Ltda.',
}

const editOrg = [
    {
        inventoryId: '1',
        name: 'Inventario 1',
        createdAt: '2021-05-01',
        inCharge: ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
    },{
        inventoryId: '2',
        name: 'Inventario 2',
        createdAt: '2021-05-02',
        inCharge: ['A', 'B', 'C'],
    },{
        inventoryId: '3',
        name: 'Inventario 3',
        createdAt: '2021-05-03',
        inCharge: ['D', 'E'],
    }
]

const visOrg = [
    {
        inventoryId: '4',
        name: 'Inventario 4',
        createdAt: '2021-05-04',
        inCharge: ['I', 'J'],
    },{
        inventoryId: '5',
        name: 'Inventario 5',
        createdAt: '2021-05-05',
        inCharge: ['K', 'L'],
    },{
        inventoryId: '6',
        name: 'Inventario 6',
        createdAt: '2021-05-06',
        inCharge: ['M', 'N'],
    },{
        inventoryId: '7',
        name: 'Inventario 7',
        createdAt: '2021-05-07',
        inCharge: ['O', 'P'],
    },{
        inventoryId: '8',
        name: 'Inventario 8',
        createdAt: '2021-05-08',
        inCharge: ['Q', 'R'],
    },{
        inventoryId: '9',
        name: 'Inventario 9',
        createdAt: '2021-05-09',
        inCharge: ['S', 'T'],
    },{
        inventoryId: '10',
        name: 'Inventario 10',
        createdAt: '2021-05-10',
        inCharge: ['U', 'V'],
    },{
        inventoryId: '11',
        name: 'Inventario 11',
        createdAt: '2021-05-11',
        inCharge: ['W', 'X'],
    },{
        inventoryId: '12',
        name: 'Inventario 12',
        createdAt: '2021-05-12',
        inCharge: ['Y', 'Z'],
    }
]

function getRandColor(char){
    // Map a character from the alphabet to a random color
    const colors = [
        '#21c44d','#cf2017','#c9690e',
        '#e6a519','#98c904','#04c91e',
        '#0ccc69','#0cccaf','#0cb2cc',
        '#0c79cc','#0c39cc','#360ccc',
        '#730ccc','#b60ccc','#cc0ca6',
        '#cc0c5c','#cc0c1c',
    ]
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (char){
        return colors[alphabet.indexOf(char)];
    }
}

import {DashboardContext} from './Dashboard.jsx';

export default function Organization() {
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const {organizationId} = useParams();
    return(
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            <div className="organization">
                <NavBar selection={1}/>
                <SecondNavBar selection={1}/>
                <div className="organizationContent">
                    <div className='titleContainer'>
                        <h1>{org.name} Departamentos</h1>
                        <button className='plusButton'><a href={'/create/inv/'+organizationId+'/'}>+</a></button>
                    </div>
                    <SearchBar defaultText='Buscar departamento...'/>
                    <div className='depsContainer'>
                        <h2>Puedes editar</h2>
                        <div className='deps-grid'>
                            <div className='deps-grid-header'>Nombre</div>
                            <div className='deps-grid-header'>Fecha de creación</div>
                            <div className='deps-grid-header'>Encargados</div>
                            <div className='deps-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {editOrg.map((org, index) => {
                                return(
                                    <>
                                        <div className='deps-grid-item'><a href={'/inventory/'+organizationId+'/'+org.inventoryId+'/'}>{org.name}</a></div>
                                        <div className='deps-grid-item'>{org.createdAt}</div>
                                        <div className='deps-grid-item' id='circle-grid'>
                                            {org.inCharge.slice(0,Math.min(4,org.inCharge.length)).map((name, index) => {
                                                return(
                                                    <Circle text={name} color={getRandColor(name)}/>
                                                )
                                            })}
                                            {org.inCharge.length > 4 ? <Circle text={'+'+(org.inCharge.length-6)} color={'#707070'}/> : null}
                                        </div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Editar', color: 'blue', link: '/edit/inv/'+organizationId+'/'+org.inventoryId+'/'},
                                                {text: 'Eliminar', color: 'red', link: '/'},
                                            ]
                                        } mainText="⋮" Id={index + 1} contentStyle={2}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className='depsContainer'>
                        <h2>Puedes visualizar</h2>
                        <div className='deps-grid'>
                            <div className='deps-grid-header'>Nombre</div>
                            <div className='deps-grid-header'>Fecha de creación</div>
                            <div className='deps-grid-header'>Encargados</div>
                            <div className='deps-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {visOrg.map((org, index) => {
                                return(
                                    <>
                                        <div className='deps-grid-item'><a href={'/inventory/'+organizationId+'/'+org.inventoryId+'/'}>{org.name}</a></div>
                                        <div className='deps-grid-item'>{org.createdAt}</div>
                                        <div className='deps-grid-item' id='circle-grid'>
                                            {org.inCharge.slice(0,Math.min(4,org.inCharge.length)).map((name, index) => {
                                                return(
                                                    <Circle text={name} color={getRandColor(name)}/>
                                                )
                                            })}
                                            {org.inCharge.length > 4 ? <Circle text={'+'+(org.inCharge.length-6)} color={'#c4c4c4'}/> : null}
                                        </div>
                                        <div className='deps-grid-item'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </DashboardContext.Provider>
    )
}