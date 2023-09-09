import './Dashboard.css';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

export default function Dashboard() {
    return (
        <div className="dashboard">
            <NavBar selection={1}/>
            <div className="dashboardContent">
                Content
            </div>
            <Footer/>
        </div>
    )
}