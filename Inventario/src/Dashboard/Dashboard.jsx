import './Dashboard.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import SearchBar from '../Tools/SearchBar';

export default function Dashboard() {
    return (
        <div className="dashboard">
            <NavBar selection={1}/>
            <div className="dashboardContent">
                <div className='titleContainer'>
                    <h1>Organizaciones</h1>
                    <button className='plusButton'><a href='/'>+</a></button>
                </div>
                <SearchBar defaultText='Buscar organización...'/>
            </div>
            <Footer/>
        </div>
    )
}