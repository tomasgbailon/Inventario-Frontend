import React, { useEffect, useState, useContext } from 'react';
import './PopOver.css';
import {DashboardContext} from '../../Dashboard/Dashboard.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function PopOver({Buttons, mainText, Id}) {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [buttons, setButtons] = useState(Buttons);
  const [text, setText] = useState(mainText);
  const [id, setId] = useState(Id);//[id, setId
  const [contentStyle, setContentStyle] = useState({});//{textAlign: 'right',}
  const [block, setBlock] = useState(true);
  const {buttonUnlock, setButtonUnlock} = useContext(DashboardContext);
  const togglePopover = () => {
    setButtonUnlock(id);
    setIsOpen(!isOpen);
  };
  const handleColor = (color) => {
    switch (color) {
      case 'blue':
        return 'blue-button';
      case 'red':
        return 'red-button';
      case 'green':
        return 'green-button';
      default:
        return '';
    }
  }
  useEffect(() => {
  }, []);
  return (
    <div className={`popover ${(isOpen && (id === buttonUnlock) ) ? 'open' : ''}`}>
      <button onClick={togglePopover} className="popover-button">{text}</button>
      <div style={contentStyle} className="popover-content">
        {
          buttons.map((button) => {
            return (
              <>
                <button className='pop-over-button' id={handleColor(button.color)}><a onClick={
                  (e) => {
                    e.preventDefault();
                    navigate(button.link);
                  }
                }>{button.text}</a></button>
              </>
            )
          })
        }
        <button className='pop-over-button' id='red-button' onClick={() => logout({ logoutParams: { returnTo: window.location.origin }}) }>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default PopOver;