import './UserSearch.css';
import { useContext, useState } from 'react';
import { SearchContext } from '../Dashboard/Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export default function UserSearch({defaultText}) {
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const { searchResults, setSearchResults } = useContext(SearchContext);
    const { clickedResult, setClickedResult } = useContext(SearchContext);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleClick = (user) => {
        return () => {
            setClickedResult(user);
            setSearchTerm('');
            setSearchResults([]);
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
                    (user, index) => {
                        return (
                            <div className='user-searchResult' onClick={handleClick(user)} key={index}>
                                <div id='bold'>{user.name}</div>&nbsp;&nbsp;&nbsp;{user.email}
                            </div>
                        )
                    }
                )
            }
            </div>}
        </>
    )
}