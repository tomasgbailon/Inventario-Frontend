import './LandingFooter.css'

export default function LandingFooter() {
    return (
        <div className='landingFooterContainer'>
            <div className='columnContainer'>
                <div className='landingFooterColumn'>
                    <div className='landingFooterItem' id='grey'>Principal</div>
                    <div className='landingFooterItem'>Sobre Nosotros</div>
                    <div className='landingFooterItem'>Documentación</div>
                </div>
                <div className='landingFooterColumn'>
                    <div className='landingFooterItem' id='grey'>Soporte</div>
                    <div className='landingFooterItem'>Contacto</div>
                    <div className='landingFooterItem'>LindkedIn</div>
                </div>
                <div className='landingFooterColumn'>
                    <div className='landingFooterItem' id='grey'>Iniciar Sesión</div>
                    <div className='landingFooterItem'><a href='https://github.com/tomasgbailon/Inventario-Frontend'>Github</a></div>
                    <div className='landingFooterItem'> </div>
                </div>
            </div>
            <div className='creditContainer'>
                <p>© 2023 Kipin v1.1.0 desarrollado por Tomás González Bailón</p>
            </div>
        </div>
    )
}