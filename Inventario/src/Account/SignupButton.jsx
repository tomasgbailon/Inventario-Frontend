import './SignupButton.css'
import { useAuth0 } from "@auth0/auth0-react";

export default function Signup() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    if(!isAuthenticated){
        return(
            <button className='signup-button' onClick={() => loginWithRedirect({ screen_hint: "signup" })}>
                Registrarse
            </button>
        )
    }
    return(
        <div></div>
    )
}