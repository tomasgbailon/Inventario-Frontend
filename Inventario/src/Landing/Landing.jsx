import './Landing.css'
import '../App.css'
import LandingNavBar from './LandingNavBar'
import LandingFooter from './LandingFooter'
import Signup from '../Account/SignupButton'

export default function Landing() {
    return (
        <div className='mainContainer'>
            <LandingNavBar/>
            <div className="landingContainer">
                <div className="leftLandingContainer">
                    <h1> Maneja tu <span className='bold-word'>bodega</span> fácilmente</h1>
                    <p>
                        Las empresas pequeñas tienen la emergente necesidad
                        de manejar su inventario de la forma más simple e
                        intuitiva posible. Con Inventario.com maneja tu empresa
                        y decide quienes pueden administrar el negocio junto
                        a ti 
                    </p>
                    <div className='signupButtonContainer'>
                        <Signup/>
                    </div>
                </div>
                <div className="rightLandingContainer">
                    <img src="/Landing.jpg" className='landingImage'></img>
                </div>
            </div>
            <LandingFooter/>
        </div>
    )
}