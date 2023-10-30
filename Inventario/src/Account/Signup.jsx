import './Signup.css'

export function SignupWindow(){
    return(
        <div className='signup-window'>
            <div className='signup-window-left'>
                <img src='SignupImage.jpg' className='signup-image'/>
            </div>
            <div className='signup-window-right'>
                <div className='signup-window-form'>
                    <h1>Regístrate en Inventario</h1>
                    <label className='signup-form-label'>Nombre</label>
                    <input className='signup-form-input' type='text' placeholder='Nombre'/>
                    <label className='signup-form-label'>Apellido</label>
                    <input className='signup-form-input' type='text' placeholder='Apellido'/>
                    <label className='signup-form-label'>Correo electrónico</label>
                    <input className='signup-form-input' type='text' placeholder='Correo electrónico'/>
                    <label className='signup-form-label'>Contraseña</label>
                    <input className='signup-form-input' type='password' placeholder='Contraseña'/>
                    <button className='signup-form-button'>Registrarse</button>
                </div>
            </div>
        </div>
    )
}