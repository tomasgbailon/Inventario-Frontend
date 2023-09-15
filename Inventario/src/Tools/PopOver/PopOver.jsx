import React, { useEffect, useState, useContext } from 'react';
import './PopOver.css';
import {DashboardContext} from '../../Dashboard/Dashboard.jsx';

function Popover({Buttons, mainText, Type, Id}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttons, setButtons] = useState(Buttons);
  const [text, setText] = useState(mainText);
  const [type, setType] = useState(Type);
  const [style, setStyle] = useState({});//{textAlign: 'right',}
  const [id, setId] = useState(Id);//[id, setId
  const [contentStyle, setContentStyle] = useState({});//{textAlign: 'right',}
  const [block, setBlock] = useState(true);
  const {buttonUnlock, setButtonUnlock} = useContext(DashboardContext);
  const togglePopover = () => {
    setButtonUnlock(id);
    setIsOpen(!isOpen);
    console.log(buttonUnlock, isOpen);
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
  const handleStyle = () => {
    if (type === 'options') {
      setStyle( {
        textAlign: 'right',
        width: '100%',
      });
      setContentStyle( {
        marginLeft: '17em',
        marginTop: '0em',
      });
    } else if (type === 'navBar') {
      setStyle( {
        textAlign: 'center',
        width: '100%',
      });
    }
  };
  useEffect(() => {
    handleStyle();
  }, []);
  return (
    <div className={`popover ${(isOpen && (id === buttonUnlock) ) ? 'open' : ''}`}>
      <button style={style} onClick={togglePopover} className="popover-button">{text}</button>
      <div style={contentStyle} className="popover-content">
        {
          buttons.map((button) => {
            return (
              <>
                <button className='pop-over-button' id={handleColor(button.color)}><a href={button.link}>{button.text}</a></button>
              </>
            )
          })
        }
      </div>
    </div>
  );
}

export default Popover;