import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing/Landing.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'


function Routing(){
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Landing/>}/>
                    <Route path={'/dashboard'} element={<Dashboard/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing