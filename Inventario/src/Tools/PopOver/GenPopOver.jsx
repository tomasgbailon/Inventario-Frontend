import './GenPopOver.css';
import { DashboardContext } from '../../Dashboard/Dashboard.jsx';
import { useState, useContext, useEffect } from 'react';
import { GeneratorContext } from '../../Dashboard/Administration.jsx';
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function GenPopOver({label, type, mainText, color, Id}) {
    const { user, getAccessTokenSilently } = useAuth0();
    const { token, setToken } = useContext(GeneratorContext);
    const { organizationId } = useContext(GeneratorContext);
    const { createdAt, setCreatedAt } = useContext(GeneratorContext);
    const [date, setDate ] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState(mainText);
    const [id, setId] = useState(Id);
    const [contentStyle, setContentStyle] = useState({});
    const {buttonUnlock, setButtonUnlock} = useContext(DashboardContext);
    const [authId, setAuthId] = useState(user?.sub.split('|')[1]);
    const [email, setEmail] = useState(user?.email);
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
                <input className='gen-date' type="date" name="date" id="date" min={
                    createdAt ? createdAt.split('T')[0] : maxDate
                } max={maxDate} value={date} onChange={
                    (event) => {
                        setDate(event.target.value);
                    }
                } />
            )
        }
    }
    const generateReport = async (token, currentTry) => {
        let processedDate = date.split('-');
        processedDate = [parseInt(processedDate[0]), parseInt(processedDate[1]), parseInt(processedDate[2])];
        await axios.post(import.meta.env.VITE_API_ADDRESS+`/reports/create`, {
            organizationId: parseInt(organizationId),
            searchDate: processedDate,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Identity: authId,
            },
        }).then((response) => {
            //if status is 200, use download link
            if (response.status === 200){
                window.open(response.data.url, '_blank');
            } else if (response.status === 201){
                //if status is 201, use message
                alert("El informe está siendo generado, por favor espere unos minutos e intente de nuevo.");
            }
        }).catch((error) => {
            if (error.response.status !== 200 && currentTry < 1) {
                generateReport(token, currentTry + 1);
            }
        });
    }
    return (
        <div className={`gen-popover ${(isOpen && (id === buttonUnlock) ) ? 'open' : ''}`}>
          <button onClick={togglePopover} className="generatorButton">{text}</button>
          <div style={contentStyle} className="gen-popover-content">
                <label htmlFor="date" className='gen-label'>{label}</label>
                {handleType(type)}
                <button className='gen-pop-over-button' id={handleColor(color)} onClick={
                  (e) => {
                    e.preventDefault();
                    generateReport(token, 0);
                  }
                }>{text}</button>
          </div>
        </div>
      );
}