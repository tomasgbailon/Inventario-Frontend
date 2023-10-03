import './Organization.css'
import NavBar from './NavBar.jsx';
import SecondNavBar from './SecondNavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar.jsx';
import SidePopOver from '../Tools/PopOver/SidePopOver.jsx';
import Circle from '../Tools/Circle';
import { useState,createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

const editOrg = [
    {
        name: 'Inventario 1',
        createdAt: '2021-05-01',
        inCharge: ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
    },{
        name: 'Inventario 2',
        createdAt: '2021-05-02',
        inCharge: ['A', 'B', 'C'],
    },{
        name: 'Inventario 3',
        createdAt: '2021-05-03',
        inCharge: ['D', 'E'],
    }
]

const visOrg = [
    {
        name: 'Inventario 4',
        createdAt: '2021-05-04',
        inCharge: ['I', 'J'],
    },{
        name: 'Inventario 5',
        createdAt: '2021-05-05',
        inCharge: ['K', 'L'],
    },{
        name: 'Inventario 6',
        createdAt: '2021-05-06',
        inCharge: ['M', 'N'],
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
                        <h1>Departamentos</h1>
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
                                        <div className='deps-grid-item'><a href={'/administration/'+organizationId+'/'}>{org.name}</a></div>
                                        <div className='deps-grid-item'>{org.createdAt}</div>
                                        <div className='deps-grid-item' id='circle-grid'>
                                            {org.inCharge.slice(0,Math.min(4,org.inCharge.length)).map((name, index) => {
                                                return(
                                                    <Circle text={name} color={getRandColor(name)}/>
                                                )
                                            })}
                                            {org.inCharge.length > 4 ? <Circle text={'+'+(org.inCharge.length-6)} color={'#c4c4c4'}/> : null}
                                        </div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Editar', color: 'blue', link: '/'},
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
                                        <div className='deps-grid-item'><a href={'/administration/'+organizationId+'/'}>{org.name}</a></div>
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