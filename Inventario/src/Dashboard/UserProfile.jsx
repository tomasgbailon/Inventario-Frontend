import './Edit/EditOrg.css'
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import { useState,createContext } from 'react';
import {DashboardContext} from './Dashboard.jsx';
import Circle from '../Tools/Circle.jsx';

const user = {
    userId: 1,
    username: 'Fátima Bailón',
    email: 'fatimabailon@gmail.com',
}
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

export default function UserProfile(){
    const [buttonUnlock, setButtonUnlock] = useState(0);
    const [userName, setUserName] = useState(user.username);
    const [userEmail, setUserEmail] = useState(user.email);
    const [count, setCount] = useState(0);
    const handleWriteName = (e) => {
        setUserName(e.target.value);
    }
    const handleWriteEmail = (e) => {
        setUserEmail(e.target.value);
    }
    return (
        <DashboardContext.Provider value={{buttonUnlock, setButtonUnlock}}>
            <div className="new-org">
                <NavBar selection={5}/>
                <div className="new-org-content">
                    <div className='space'/>
                    <Circle color={getRandColor(userName[0])} size='big' text={userName[0]} />
                    <h1>{userName}</h1>
                    <div className="new-org-form">
                        <label className="orgName">Nombre</label>
                        <input type="text" className="new-org-input" id="orgName" value={userName} onChange={handleWriteName} />
                        <label className="orgDescription">Correo Electrónico</label>
                        <input type='text' className="new-org-input" id="orgName" value={userEmail} disabled />
                        <button type="submit" className='submit-button'>Confirmar</button>
                    </div>
                    <div className="final-buttons">
                        <button className="final-button">Cambiar Contraseña</button>
                        <button className="final-button">Cerrar Sesión</button>
                        <button className="final-button" id='delete'>Eliminar Cuenta</button>
                    </div>
                </div>
                <Footer/>
            </div>
        </DashboardContext.Provider>

    )
}