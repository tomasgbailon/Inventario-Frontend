import './UserSearch.css';
import { useContext, useState } from 'react';
import { SearchContext } from '../Dashboard/Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export default function InventorySearch({defaultText}) {
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const { searchResults, setSearchResults } = useContext(SearchContext);
    const { clickedResult, setClickedResult } = useContext(SearchContext);
    const { count, setCount } = useContext(SearchContext);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleClick = (inv) => {
        return () => {
            setClickedResult(inv);
            setSearchTerm('');
            setSearchResults([]);
            setCount(count + 1);
        }
    }
    return (
        <>
            <div className='user-searchBar'>
                <FontAwesomeIcon className='searchIcon' icon={faMagnifyingGlass}/>
                <input
                    disabled={false}
                    pointerEvents='auto'
                    readOnly={false}
                    className='user-searchInput'
                    type="text"
                    placeholder={defaultText}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            { searchResults.length !== 0 && <div className='user-searchBar-frame'>
            {
                searchResults.map(
                    (inventory, index) => {
                        return (
                            <div className='user-searchResult' onClick={handleClick(inventory)} key={index}>
                                <div id='bold'>{inventory.name}</div>&nbsp;&nbsp;&nbsp;{inventory.prefix}
                            </div>
                        )
                    }
                )
            }
            </div>}
        </>
    )
}