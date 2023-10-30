import './GenPopOver.css';
import {DashboardContext} from '../../Dashboard/Dashboard.jsx';
import { useState, useContext } from 'react';

export default function GenPopOver({label, type, mainText, color, Id}) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState(mainText);
    const [id, setId] = useState(Id);//[id, setId
    const [contentStyle, setContentStyle] = useState({});//{textAlign: 'right',}
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
    const handleType = (type) => {
        if (type === 'date'){
            const maxDate = new Date().toISOString().split('T')[0];
            return (
                <input className='gen-date' type="date" name="date" id="date" min="1900-01-01" max={maxDate} />
            )
        }
    }
    return (
        <div className={`gen-popover ${(isOpen && (id === buttonUnlock) ) ? 'open' : ''}`}>
          <button onClick={togglePopover} className="generatorButton">{text}</button>
          <div style={contentStyle} className="gen-popover-content">
                <label htmlFor="date" className='gen-label'>{label}</label>
                {handleType(type)}
                <button className='gen-pop-over-button' id={handleColor(color)}>{text}</button>
          </div>
        </div>
      );
}