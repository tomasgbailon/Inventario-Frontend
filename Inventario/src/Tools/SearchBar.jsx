import './SearchBar.css';
import { useState } from 'react';

export default function SearchBar({defaultText}) {
    const [searchTerm, setSearchTerm] = useState('Hola');
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        <div className='searchBar'>
            <input
                disabled={false}
                pointer-events='auto'
                readOnly={false}
                className='searchInput'
                type="text"
                placeholder={defaultText}
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    )
}