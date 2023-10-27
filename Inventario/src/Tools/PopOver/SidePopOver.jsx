import React, { useEffect, useState, useContext } from 'react';
import './SidePopOver.css';
import {DashboardContext} from '../../Dashboard/Dashboard.jsx';

function SidePopOver({Buttons, mainText, Id, contentStyle}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttons, setButtons] = useState(Buttons);
  const [text, setText] = useState(mainText);
  const [id, setId] = useState(Id);
  // const [style, setStyle] = useState(contentStyle);
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
  useEffect(() => {
  }, []);
  return (
    <div className={`side-popover${contentStyle == 3 ? '-3' : ''} ${(isOpen && (id === buttonUnlock) ) ? 'open' : ''}`}>
      <button onClick={togglePopover} className={`side-popover${contentStyle == 3 ? '-3' : ''}-button`}>{text}</button>
      <div className={"side-popover-content"+"-"+contentStyle}>
        {
          buttons.map((button) => {
            return (
              <>
                <button className={`side-pop-over-button`} id={handleColor(button.color)}><a href={button.link}>{button.text}</a></button>
              </>
            )
          })
        }
      </div>
    </div>
  );
}

export default SidePopOver;