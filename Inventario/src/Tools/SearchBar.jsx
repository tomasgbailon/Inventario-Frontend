import './SearchBar.css';
import { useContext, useState} from 'react';
import { SearchContext } from '../Dashboard/Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
export default function SearchBar({defaultText}) {
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
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