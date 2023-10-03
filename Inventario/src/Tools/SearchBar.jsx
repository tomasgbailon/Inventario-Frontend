import './SearchBar.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBar({defaultText}) {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        <div className='searchBar'>
            <FontAwesomeIcon className='searchIcon' icon={faMagnifyingGlass}/>
            <input
                disabled={false}
                pointerEvents='auto'
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