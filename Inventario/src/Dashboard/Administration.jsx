import './Administration.css';
import NavBar from './NavBar.jsx';
import SecondNavBar from './SecondNavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar.jsx';
import SidePopOver from '../Tools/PopOver/SidePopOver';
import Generator from '../Tools/Generator';
import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import {DashboardContext} from './Dashboard.jsx';

const creator = {
    name: 'Fátima Bailón'
}

const admins = [
    {
        name: 'Isaac Jimenez',
    },{
        name: 'Admin 2',
    },{
        name: 'Admin 3',
    }
]

const editors = [
    {
        name: 'Editor 1',
        departments: ['Inventario 1', 'Inventario 2', 'Inventario 3'],
    },{
        name: 'Editor 2',
        departments: ['Inventario 1', 'Inventario 2', 'Inventario 3'],
    },{
        name: 'Editor 3',
        departments: ['Inventario 1', 'Inventario 2'],
    }
]

const viewers = [
    {
        name: 'Viewer 1',
        departments: ['Inventario 1', 'Inventario 2', 'Inventario 3'],
    },{
        name: 'Viewer 2',
        departments: ['Inventario 1', 'Inventario 2'],
    },{
        name: 'Viewer 3',
        departments: ['Inventario 1'],
    }
]

function stringArray(array){
    var string = '';
    for (let i = 0; i < array.length; i++){
        string += array[i];
        if (i != array.length - 1){
            string += ', ';
        }
    }
    return string;
}

export default function Administration() {
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const {organizationId} = useParams();
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock, organizationId}}>
            <div className="administration">
                <NavBar selection={1}/>
                <SecondNavBar selection={2}/>
                <div className="administrationContent">
                    <div className='titleContainer'>
                        <h1>Administración</h1>
                    </div>
                    <SearchBar defaultText='Buscar miembros...'/>
                    <Generator text='Generar informe' label='Hasta el día:'/>
                    <div className='adminContainer'>
                        <h2>Creador</h2>
                        <div className='admin-grid'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='admin-grid-item'>{creator.name}</div>
                            <SidePopOver Buttons={
                                [
                                    {text: 'Editar', color: 'blue', link: '/'},
                                    {text: 'Eliminar', color: 'red', link: '/'},
                                ]
                            } mainText="⋮" Id={1} contentStyle={2}/>
                        </div>
                    </div>
                    <div className='adminContainer'>
                        <h2>Administradores</h2>
                        <div className='admin-grid'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {admins.map((admin, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{admin.name}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Modificar', color: 'blue', link: '/'},
                                                {text: 'Despedir', color: 'red', link: '/'},
                                            ]
                                        } mainText="⋮" Id={index + 2} contentStyle={2}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className='adminContainer'>
                        <h2>Editores</h2>
                        <div className='admin-grid' id='triple-column'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Departamentos</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {editors.map((editor, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{editor.name}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(editor.departments)}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Modificar', color: 'blue', link: '/'},
                                                {text: 'Despedir', color: 'red', link: '/'},
                                            ]
                                        } mainText="⋮" Id={admins.length + index + 2} contentStyle={2}/>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                        <div className='greyLine'></div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className='adminContainer'>
                        <h2>Visualizadores</h2>
                        <div className='admin-grid' id='triple-column'>
                            <div className='admin-grid-header'>Nombre</div>
                            <div className='admin-grid-header'>Departamentos</div>
                            <div className='admin-grid-header'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            <div className='greyLine'></div>
                            {viewers.map((viewer, index) => {
                                return(
                                    <>
                                        <div className='admin-grid-item'>{viewer.name}</div>
                                        <div className='admin-grid-item' id='small-font'>{stringArray(viewer.departments)}</div>
                                        <SidePopOver Buttons={
                                            [
                                                {text: 'Modificar', color: 'blue', link: '/'},
                                                {text: 'Despedir', color: 'red', link: '/'},
                                            ]
                                        } mainText="⋮" Id={admins.length + editors.length + index + 2} contentStyle={2}/>
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
    );
}