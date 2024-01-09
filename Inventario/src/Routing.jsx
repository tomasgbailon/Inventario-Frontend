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
import SubProyect from './Dashboard/SubProyect.jsx'
import Product from './Dashboard/Product.jsx'
import EditUnit from './Dashboard/Edit/EditUnit.jsx'
import NewProd from './Dashboard/New/NewProd.jsx'
import DeleteOrg from './Dashboard/Delete/DeleteOrg.jsx'
import DeleteInv from './Dashboard/Delete/DeleteInv.jsx'
import QuitOrg from './Dashboard/Delete/QuitOrg.jsx'
import FireUser from './Dashboard/Delete/FireUser.jsx'
import MakeAdmin from './Dashboard/Edit/MakeAdmin.jsx'
import HandleEditors from './Dashboard/Edit/HandleEditors.jsx'
import HandleViewers from './Dashboard/Edit/HandleViewers.jsx'
import QuitInv from './Dashboard/Delete/QuitInv.jsx'
import DeleteCat from './Dashboard/Delete/DeleteCat.jsx'
import DeleteProd from './Dashboard/Delete/DeleteProd.jsx'
import NewUnit from './Dashboard/New/NewUnit.jsx'
import QuitProy from './Dashboard/Delete/QuitProy.jsx'
import HandleProyectEditors from './Dashboard/Edit/HandleProyectEditors.jsx'
import HandleProyectViewers from './Dashboard/Edit/HandleProyectViewers.jsx'
import DeleteProy from './Dashboard/Delete/DeleteProyect.jsx'
import DeleteSubProy from './Dashboard/Delete/DeleteSubproyect.jsx'
import NewSubproyect from './Dashboard/New/NewSubproyect.jsx'
import Demo from './Demo/Demo.jsx'

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
                    <Route path={'/edit/cat/:organizationId/:inventoryId/:categoryId/'} element={<EditCat/>}/>
                    <Route path={'/create/inv/:organizationId/'} element={<NewInv/>}/>
                    <Route path={'/proyects/:organizationId/'} element={<Proyects/>}/>
                    <Route path={'/edit/inv/:organizationId/:inventoryId/'} element={<EditInv/>}/>
                    <Route path={'/myprofile'} element={<UserProfile/>}/>
                    <Route path={'/create/proy/:organizationId/'} element={<NewProy/>}/>
                    <Route path={'/edit/proy/:organizationId/:proyectId/'} element={<EditProyect/>}/>
                    <Route path={'/subproy/:organizationId/:proyectId/:subproyectId/'} element={<SubProyect/>}/>
                    <Route path={'/product/:organizationId/:inventoryId/:categoryId/:productId/'} element={<Product/>}/>
                    <Route path={'/edit/unit/:organizationId/:inventoryId/:categoryId/:productId/:unitId/'} element={<EditUnit/>}/>
                    <Route path={'/create/prod/:organizationId/:inventoryId/'} element={<NewProd/>}/>
                    <Route path={'/delete/org/:organizationId/'} element={<DeleteOrg/>}/>
                    <Route path={'/delete/inv/:organizationId/:inventoryId/'} element={<DeleteInv/>}/>
                    <Route path={'/quit/org/:organizationId/'} element={<QuitOrg/>}/>
                    <Route path={'/fire/user/:organizationId/:targetUserEmail/'} element={<FireUser/>}/>
                    <Route path={'/make/admin/:organizationId/:targetUserEmail/'} element={<MakeAdmin/>}/>
                    <Route path={'/editors/inv/:organizationId/:inventoryId/'} element={<HandleEditors/>}/>
                    <Route path={'/editors/proy/:organizationId/:proyectId/'} element={<HandleProyectEditors/>}/>
                    <Route path={'/viewers/inv/:organizationId/:inventoryId/'} element={<HandleViewers/>}/>
                    <Route path={'/viewers/proy/:organizationId/:proyectId/'} element={<HandleProyectViewers/>}/>
                    <Route path={'/quit/inv/:type/:organizationId/:inventoryId/'} element={<QuitInv/>}/>
                    <Route path={'/delete/cat/:organizationId/:inventoryId/:categoryId/'} element={<DeleteCat/>}/>
                    <Route path={'/delete/prod/:organizationId/:inventoryId/:categoryId/:productId/'} element={<DeleteProd/>}/>
                    <Route path={'/create/unit/:organizationId/:inventoryId/:categoryId/:productId/'} element={<NewUnit/>}/>
                    <Route path={'/quit/proy/:type/:organizationId/:proyectId/'} element={<QuitProy/>}/>
                    <Route path={'/delete/proy/:organizationId/:proyectId/'} element={<DeleteProy/>}/>
                    <Route path={'/delete/subproy/:organizationId/:proyectId/:subproyectId/'} element={<DeleteSubProy/>}/>
                    <Route path={'/create/subproy/:organizationId/'} element={<NewSubproyect/>}/>
                    <Route path={'/howitworks'} element={<Demo/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing