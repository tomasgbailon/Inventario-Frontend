import React, { useState } from 'react';
import './PopOver.css';

function Popover() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`popover ${isOpen ? 'open' : ''}`}>
      <button onClick={togglePopover} className="popover-button">Cuenta</button>
      <div className="popover-content">
        Contenido de la ventana emergente.
      </div>
    </div>
  );
}

export default Popover;