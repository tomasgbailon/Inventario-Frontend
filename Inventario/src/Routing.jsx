import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './Landing/Landing.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Organization from './Dashboard/Organization.jsx'
import Administration from './Dashboard/Administration.jsx'
import { SignupWindow } from './Account/Signup.jsx'
import NewOrg from './Dashboard/New/NewOrg.jsx'
import NewRequest from './Dashboard/New/NewRequest.jsx'
import EditOrg from './Dashboard/Edit/EditOrg.jsx'


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
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing