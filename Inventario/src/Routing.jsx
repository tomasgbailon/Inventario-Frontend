import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing/Landing.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Organization from './Dashboard/Organization.jsx'
import Administration from './Dashboard/Administration.jsx'
import { SignupWindow } from './Account/Signup.jsx'
import NewOrg from './Dashboard/New/NewOrg.jsx'
import NewRequest from './Dashboard/New/NewRequest.jsx'
import EditOrg from './Dashboard/Edit/EditOrg.jsx'
import Requests from './Requests/Requests.jsx'
import Inventory from './Dashboard/Inventory.jsx'
import NewCat from './Dashboard/New/NewCat.jsx'
import EditCat from './Dashboard/Edit/EditCat.jsx'
import NewInv from './Dashboard/New/NewInventory.jsx'
import Proyects from './Dashboard/Proyects.jsx'
import EditInv from './Dashboard/Edit/EditInv.jsx'
import UserProfile from './Dashboard/UserProfile.jsx'
import NewProy from './Dashboard/New/NewProyect.jsx'
import EditProyect from './Dashboard/Edit/EditProyect.jsx'

function Routing(){
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Landing/>}/>
                    <Route path={'/dashboard'} element={<Dashboard/>}/>
                    <Route path={'/organization/:organizationId/'} element={<Organization/>}/>
                    <Route path={'/administration/:organizationId/'} element={<Administration/>}/>
                    <Route path={'/signup'} element={<SignupWindow/>}/>
                    <Route path={'/create/org/'} element={<NewOrg/>}/>
                    <Route path={'/create/req/'} element={<NewRequest/>}/>
                    <Route path={'/edit/org/:organizationId/'} element={<EditOrg/>}/>
                    <Route path={'/requests'} element={<Requests/>}/>
                    <Route path={'/inventory/:organizationId/:inventoryId/'} element={<Inventory/>}/>
                    <Route path={'/create/cat/:organizationId/'} element={<NewCat/>}/>
                    <Route path={'/edit/cat/:organizationId/:categoryId/'} element={<EditCat/>}/>
                    <Route path={'/create/inv/:organizationId/'} element={<NewInv/>}/>
                    <Route path={'/proyects/:organizationId/'} element={<Proyects/>}/>
                    <Route path={'/edit/inv/:organizationId/:inventoryId/'} element={<EditInv/>}/>
                    <Route path={'/user/:userId/'} element={<UserProfile/>}/>
                    <Route path={'/create/proy/:organizationId/'} element={<NewProy/>}/>
                    <Route path={'/edit/proy/:organizationId/:proyectId/'} element={<EditProyect/>}/>

                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing