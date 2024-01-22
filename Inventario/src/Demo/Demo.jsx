import './Demo.css';
import LandingNavBar from '../Landing/LandingNavBar';
import LandingFooter from '../Landing/LandingFooter';

export default function Demo() {
    return (
        <>
        <LandingNavBar/>
        <div className="demo-container">
            <img id='demo-logo' src='LogoInventario3.png'/>
            <h1>¿Cómo funciona Kipin?</h1>
            <div className='demo-block-vert'>
            <p>Kipin es una plataforma que permite a las empresas mantener un estricto y detallado control de su(s) inventario(s) mediante la entrega de permisos y autorizaciones de distinta jerarquía. Además, Kipin permite el seguimiento y registro de ingresos y egresos a bodega mediante el uso de proyectos y subproyectos.</p>
            <h2>¿Qué deseas aprender?</h2>
            <ul>
                <li><a href='#usertypes'>Tipos de usuario</a></li>
                <li><a href='#signup'>Crear cuenta en Kipin</a></li>
                <li><a href='#account'>Manejar mi cuenta de Kipin</a></li>
                <li><a href='#orgs'>Cómo funcionan las organizaciones</a></li>
                <li><a href='#requests'>Cómo funcionan las invitaciones</a></li>
                <li><a href='#inventories'>Cómo funcionan los inventarios</a></li>
                <li><a href='#categories'>Cómo funcionan las categorias</a></li>
                <li><a href='#products'>Cómo funcionan los productos</a></li>
                <li><a href='#administration'>Administrar el personal</a></li>
                <li><a href='#proyects'>Cómo funcionan los proyectos</a></li>
            </ul>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert'>
            <div id='usertypes'>
                <h2>Tipos de Usuario</h2>
                <p>Para entender el funcionamiento de Kipin, primero es necesario comprender los tipos de usuario que existen dentro de una organización.</p>
                <h3>Creador</h3>
                <p>
                    El creador es el usuario que crea una organización. Este usuario tiene todos los permisos sobre la organización y puede realizar cualquier acción sobre esta. El creador es el único usuario que puede eliminar una organización. Dentro de sus facultades se encuentra:
                </p>
                <ul>
                    <li>Invitar a otros usuarios a la organización</li>
                    <li>Administrar cualquier permiso dentro de la organización</li>
                    <li>Modificar y eliminar la organización</li>
                    <li>Crear, administrar, modificar y eliminar inventarios</li>
                    <li>Crear, administrar, modificar y eliminar proyectos</li>
                    <li>Crear, administrar, modificar y eliminar subproyectos de todo proyecto</li>
                    <li>Crear, administrar, modificar y eliminar categorías y productos de todo inventario</li>
                    <li>Crear, administrar, modificar y eliminar unidades de todo producto</li>
                </ul>
                <h3>Administrador</h3>
                <p>
                    El administrador es un usuario que tiene todos los permisos sobre una organización, con excepción de la eliminación de la misma. El administrador puede realizar cualquier acción sobre la organización, excepto eliminarla. El administrador debe ser invitado por el creador. Dentro de sus facultades se encuentra:
                </p>
                <ul>
                    <li>Invitar a otros usuarios a la organización</li>
                    <li>Administrar cualquier permiso dentro de la organización, incluyendo otros administradores</li>
                    <li>Modificar la organización</li>
                    <li>Crear, administrar, modificar y eliminar inventarios</li>
                    <li>Crear, administrar, modificar y eliminar proyectos</li>
                    <li>Crear, administrar, modificar y eliminar subproyectos de todo proyecto</li>
                    <li>Crear, administrar, modificar y eliminar categorías y productos de todo inventario</li>
                    <li>Crear, administrar, modificar y eliminar unidades de todo producto</li>
                </ul>
                <h3>Editor</h3>
                <p>
                    El editor es un usuario que tiene todos los permisos sobre un inventario o proyecto, con excepción de la eliminación del mismo. El editor debe ser invitado por el creador o un administrador. Los permisos de editor se pueden acumular, de tal forma que un usuario sea editor de multiples inventarios y/o proyectos al mismo tiempo. Dentro de sus facultades se encuentra:
                </p>
                <ul>
                    <li>Crear, administrar y modificar uno o más inventarios</li>
                    <li>Crear, administrar y modificar uno o más proyectos</li>
                    <li>Crear, administrar, modificar y eliminar subproyectos de uno o más proyectos</li>
                    <li>Crear, administrar, modificar y eliminar categorías y productos de uno o más inventarios</li>
                    <li>Crear, administrar, modificar y eliminar unidades de todos los productos de uno o más inventarios</li>
                </ul>
                <h3>Visor</h3>
                <p>
                    El visor es un usuario que puede explorar un inventario o proyecto, pero no puede realizar ninguna modificación sobre este. El visor debe ser invitado por el creador o un administrador. Los permisos de visor se pueden acumular, de tal forma que un usuario sea visor de multiples inventarios y/o proyectos al mismo tiempo. Dentro de sus facultades se encuentra:
                </p>
                <ul>
                    <li>Explorar uno o más inventarios</li>
                    <li>Explorar uno o más proyectos</li>
                    <li>Explorar uno o más subproyectos</li>
                    <li>Explorar categorías y productos de uno o más inventarios</li>
                    <li>Explorar unidades de todos los productos de uno o más inventarios</li>
                </ul>
            </div>
            </div>
            <div className='separator'/>
            <div className='demo-block-hor' id='signup'>
                <div className='demo-block-vert'>
                    <h2>¿Cómo crear una cuenta en Kipin?</h2>
                    <p id='inside-p'> 
                        Para crear una cuenta en Kipin, ve a la sección de <a href='/'><span className='bold'>Registrarse</span></a> y llena el formulario con tus datos. Una vez que hayas creado tu cuenta, podrás iniciar sesión en Kipin.
                    </p>
                </div>
                <img src='signup.png'/>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='account'>
                <h2>¿Cómo manejar mi cuenta en Kipin?</h2>
                <p id='inside-p'>
                    Una vez hayas iniciado sesión, dirígete al <a href='/dashboard'><span className='bold'>Panel de control</span></a>. Allí encontrarás una barra de navegación con tu nombre de usuario en la esquina derecha. Si la presionas aparecerá un pequeño menú que te llevará a tu perfil de usuario.
                </p>
                <img src='account-1.png' id='alone'/>
                <p id='inside-p'>
                    Accederás a tu perfil, donde podras cambiar tu nombre de usuario, por el que se te asignará un color, o eliminar tu cuenta si así lo deseas.
                </p>
                <img src='account-2.png' id='alone'/>
            </div>
            <div className='separator'/>
            <div className='demo-block-hor' id='orgs'>
                <div className='demo-block-vert'>
                    <h2>¿Cómo funcionan las organizaciones?</h2>
                    <p id='inside-p'> 
                        Al acceder a tu <a href='/dashboard'><span className='bold'>Panel de control</span></a> podras ver un resumen que muestra las organizaciones creadas por ti, administradas por ti, editadas por ti y visualizadas por ti. Desde aquí puedes acceder a cada una de ellas.
                    </p>
                </div>
                <img src='org-1.png'/>
            </div>
            <div className='demo-block-hor'>
                <img src='org-2.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea tu organización</h2>
                    <p id='inside-r'>
                        Para crear una organización, presiona el botón <span className='bold'>MÁS</span> de color azul. Llena el formulario con los datos de tu organización y presiona <span className='bold'>Crear</span>.
                        Al momento de crear la organización, puedes elegir usuarios para invitarlos a que sean administradores. Si no invitas administradores, puedes hacerlo después.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2>Edita tu organización</h2>
                <div className='label-container'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                <p>
                    Para editar tu organización, presiona el botón <span className='bold'>EDITAR</span> de color azul en el panel de control. Puedes cambiar el nombre y descripción de la organización e invitar o remover administradores.
                </p>
                <div className='hor'>
                    <img src='org-4.png'/>
                    <img src='org-5.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='org-6.png'/>
                <div className='demo-block-vert'>
                    <h2>Elimina tu organización</h2>
                    <div className='label-container'>
                        <div className='label'>Creador</div>
                    </div>
                    <p>
                        Para eliminar tu organización, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en el panel de control. Para confirmar, escribe 
                        el nombre de la organización. Si eres administrador, solo tendrás la opción de renunciar a la organización.
                    </p>
                </div>
            </div>
            <div className='demo-block-hor'>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Administra tu organización</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                        <div className='label'>Visor</div>
                    </div>
                    <p id='inside-r'>
                        Para administrar tu organización, haz click en la organización que deseas administrar. Desde aquí puedes controlar los inventarios, personal y proyectos de la organización. Si solo posees permisos de editor y visor, no podrás visualizar el personal de la organización.
                    </p>
                </div>
                <img src='org-7.png'/>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='requests'>
                <h2>¿Cómo funcionan las invitaciones?</h2>
                <p>Para obtener permiso de administración, edición o visualización de una organización es necesario haber recibido una invitación o solicitud por parte de un 
                    miembro de dicha organización. Para revisar las solicitudes que hemos recibido, debes ir a <a href='/dashboard'><span className='bold'>Panel de control</span></a> y presionar el botón <span className='bold'>Solicitudes</span> en la barra de navegación. Allí podrás ver las solicitudes que has recibido.
                </p>
                <img src='req-1.png' id='alone'/>
            </div>
            <div className='demo-block-hor'>
                <img src='req-2.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Envía una solicitud</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para invitar a un usuario a tu organización, presiona el botón <a href='/dashboard'><span className='bold'>MÁS</span></a> en la pestaña de solicitudes. Llena el formulario con la organización, el tipo de permiso que deseas otorgar y busca al usuario a quien deseas invitar. Presiona <span className='bold'>Crear</span>.
                    </p>
                </div>
            </div>
            <div className='demo-block-hor'>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Acepta una solicitud</h2>
                    <p id='inside-r'>
                        Para obtener el permiso de administración, edición o visualización de una organización, debes aceptar una solicitud. Si no deseas aceptar una solicitud, puedes rechazarla. Para aceptar una solicitud, presiona el botón <span className='bold'>ACEPTAR</span> de color azul en la pestaña de solicitudes. Para rechazar una solicitud, presiona el botón <span className='bold-red'>RECHAZAR</span> de color rojo en la pestaña de solicitudes.
                    </p>
                </div>
                <img src='req-3.png'/>
            </div>
            <div className='demo-block-hor'>
                <img src='req-4.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Encuentra la nueva organización</h2>
                    <p id='inside-r'>
                        Luego de aceptar una invitación, el permiso se te otorgará de inmediato. Para encontrar la nueva organización, ve a <a href='/dashboard'><span className='bold'>Panel de control</span></a> y busca la nueva organización según el tipo de permiso que se te haya otorgado. Ejemplo visto desde la perspectiva del usuario que recibió la invitación.
                    </p>
                </div>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='inventories'>
                <h2>¿Cómo funcionan los inventarios?</h2>
                <p>Los inventarios son el centro de Kipin. Un inventario te permite almacenar productos en categorías. Para crear uno, debes ser administrador o creador de una organización.
                </p>
                <img src='inv-1.png' id='alone'/>
            </div>
            <div className='demo-block-hor'>
                <img src='inv-4.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea tu inventario</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para crear un inventario, presiona el botón <span className='bold'>MÁS</span> de color azul en la pestaña de inventarios. Llena el formulario con los datos de tu inventario y presiona <span className='bold'>Crear</span>. 
                        Puedes invitar a otros usuarios a que sean editores del nuevo inventario. Si no invitas editores, puedes hacerlo después.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2>Edita tu inventario</h2>
                <div className='label-container'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                <p>
                    Para editar tu inventario, presiona el botón <span className='bold'>EDITAR</span> de color azul en la pestaña de inventarios. Puedes cambiar el nombre y descripción del inventario. El prefijo no puede ser cambiado.
                </p>
                <div className='hor'>
                    <img src='inv-2.png'/>
                    <img src='inv-3.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='inv-5.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Administra editores y visores de un inventario</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para administrar los editores y visores de un inventario, presiona el botón <span className='bold'>EDITORES</span> o <span className='bold'>VISORES</span> de color azul en la pestaña de inventarios. Puedes invitar o remover editores y visores.
                    </p>
                </div>
            </div>
            <div className='demo-block-hor'>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Elimina tu inventario</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para eliminar tu inventario, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la pestaña de inventarios. Para confirmar, escribe 
                        el nombre del inventario. Si eres editor o visor, solo tendrás la opción de renunciar al inventario.
                    </p>
                </div>
                <img src='inv-6.png'/>
            </div>
            <div className='demo-block-hor'>
                <img src='inv-7.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Administra un inventario</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                        <div className='label'>Visor</div>
                    </div>
                    <p id='inside-r'>
                        Para administrar las categorías y productos de un inventario, presiona el nombre del inventario en la pestaña de inventarios.
                    </p>
                </div>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='categories'>
                <h2>¿Cómo funcionan las categorías?</h2>
                <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                        <div className='label'>Visor</div>
                </div>
                <p>
                Una categoría te permite almacenar productos. Para ver las categorías dentro de un inventario, accede al <span className='bold'>inventario</span>. Cada categoría puede contener una serie de productos.
                Para revisar los productos dentro de una categoría, haz click en el panel que muestra el nombre de la categoría que deseas revisar. 
                </p>
                <img src='cat-1.png' id='big-pic'/>
                <p>
                    Cada panel de categoría muestra su nombre, prefijo y cantidad de productos en su interior.
                    Al revisar su <span className='bold'>detalle</span> se puede encontrar la lista de contiene los productos de la categoría, incluyendo su nombre, prefijo, valor total de las unidades correspondientes al producto y cantidad de unidades, además 
                    de indicadores la cantidad de productos que se encuentran 
                    <span className='bold-green'> disponibles</span>
                    , 
                    <span className='bold-yellow'> en uso </span>
                    y 
                    <span className='bold-red'> no disponibles</span>
                    . La lista se puede ordenar por cada uno de estos indicadores al presionar el nombre de la columna correspondiente.
                </p>
            </div>
            <div className='demo-block-hor'>
                <img src='cat-2.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea tu categoría</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para crear una categoría, presiona el botón <span className='bold'>MÁS</span> de color azul en la pestaña de un inventario. Llena el formulario con los datos de tu categoría y presiona <span className='bold'>Crear</span>.
                        Puedes <span className='bold'>replicar la misma categoría</span> para múltiples inventarios al mismo tiempo.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Edita tu categoría</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                </div>
                <p id='inside-r'>
                    Para editar tu categoría, presiona el botón <span className='bold'>EDITAR</span> de color azul en la pestaña de un inventario. Puedes cambiar el nombre, prefijo y descripción de la categoría.
                    Si la categoría fue replicada al crearse, puedes seleccionar los inventarios en los que deseas aplicar los cambios.
                </p>
                <div className='hor'>
                    <img src='cat-4.1.png'/>
                    <img src='cat-3.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='cat-5.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Elimina tu categoría</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para eliminar tu categoría, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la pestaña de un inventario. Para confirmar, vuelve a 
                        presionar el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la ventana emergente.
                    </p>
                </div>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='products'>
                <h2>¿Cómo funcionan los productos?</h2>
                <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                        <div className='label'>Visor</div>
                </div>
                <p>
                Un producto es un elemento que se almacena bajo una categoría. 
                Un producto por si solo no está cuantificado, sino que se cuantifica mediante unidades.
                Para ver los productos dentro de una categoría, accede al <span className='bold'>inventario</span> y luego a la <span className='bold'>categoría</span> que deseas revisar. 
                </p>
                <img src='prod-1.png' id='big-pic'/>
                <h4 id='inside-p'>
                    Un producto tiene los siguientes atributos:
                </h4>
                <ul>
                    <li>Nombre</li>
                    <li>Tipo: Existen dos tipos</li>
                    <ul>
                        <li><span className='bold-black'>Activo</span>: Es un tipo producto del que se espera un retorno, por lo que es no consumible. Además, admite 
                            personas a cargo por cada unidad. Por ejemplo: Máquina Soldadora.
                        </li>
                        <li>
                        <span className='bold-black'>Consumible</span>: Es un tipo de producto que se consume, por lo que no se espera un retorno. No admite personas a cargo.
                            Por ejemplo: Caja de tornillos.
                        </li>
                    </ul>
                    <li>Prefijo</li>
                    <li>Unidad de medida</li>
                    <li>Marca</li>
                    <li>Modelo</li>
                    <li>Descripción</li>
                </ul>
                <p>
                    Accede al detalle de un producto al hacer click en su nombre en el panel de una categoría.
                </p>
                <img src='prod-4.png' id='alone'/>
                <h4 id='inside-p'>
                    Cada unidad de un producto tiene los siguientes atributos:
                </h4>
                <ul>
                    <li>Estado: Existen tres estados</li>
                    <ul>
                        <li><span className='bold-green'>Disponible</span>: La unidad está disponible para ser usada.</li>
                        <li><span className='bold-yellow'>En uso</span>: La unidad está siendo usada en un subproyecto o por algun responsable</li>
                        <li><span className='bold-red'>No disponible</span>: La unidad no está disponible para ser usada. Puede representar producto fuera de servicio.</li>
                    </ul>
                    <li>Precio</li>
                    <li>Responsable (producto activo)</li>
                    <li>Proveedor</li>
                    <li>Fecha de compra</li>
                    <li>Descripción</li>
                </ul>
            </div>
            <div className='demo-block-hor'>
                <img src='prod-2.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea tu producto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para crear un producto, presiona el botón <span className='bold'>Crear nuevo producto</span> de color azul en la pestaña de un inventario. Llena el formulario con los datos de tu producto y presiona <span className='bold'>Crear</span>.
                        Ten en cuenta que el tipo de producto no puede ser modificado después de su creación.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Edita tu producto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                </div>
                <p id='inside-r'>
                    Para editar tu producto, presiona el botón <span className='bold'>EDITAR</span> de color azul en la pestaña de un inventario. Puedes cambiar todos los atributos del producto, 
                    a excepción del tipo de producto y su prefijo.
                </p>
                <div className='hor'>
                    <img src='prod-3.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='prod-5.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Elimina tu producto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para eliminar tu producto, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la pestaña de un producto. Para confirmar, vuelve a 
                        presionar el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la ventana emergente.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Administra las unidades de un producto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                    <div className='label'>Visor</div>
                </div>
                <p id='inside-r'>
                    Para administrar las unidades de un producto, presiona el nombre del producto en la pestaña de un inventario. El detalle
                    incluye el valor total de unidades del producto y una lista de unidades separadas por estado. Cada unidad tiene un 
                    <span className='bold'> SKU</span> generado automáticamente.
                </p>
                <img src='prod-6.png' id='big-pic'/>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Modifica las unidades de un producto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                </div>
                <p id='inside-r'>
                    Para modificar las unidades de un producto, selecciona las casillas de las unidades que deseas modificar y selecciona
                    la opción según el estado de la unidad. Algunas opciones se pueden aplicar a múltiples unidades al mismo tiempo.
                </p>
                <img src='prod-7.png' id='big-pic'/>
                <p>
                    Es recomendable utilizar el boton para <span className='bold'>recargar</span> de color azul para actualizar la lista de unidades correctamente
                </p>
                <img src='prod-8.png' id='big-pic'/>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='administration'>
                <h2>Administra tu personal</h2>
                <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                </div>
                <p>
                    Para administrar el personal de tu organización, dirígete a la sección de <a href='/dashboard'><span className='bold'>Administración</span></a> al entrar en una organización.
                    Desde aquí puedes visualizar la nómina de tu organización, ascender a un usuario a administrador o despedir a un usuario.
                </p>
                <img src='admin-1.png' id='big-pic'/>
                <h2>Genera informes de estado</h2>
                <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                </div>
                <p>
                    Para generar un informe de estado de tu organización, presiona el botón <span className='bold-green'>Generar informe</span> de color verde en la sección de administración. 
                    Selecciona la fecha y presiona <span className='bold-green'>Generar</span>. El informe se descargará en formato Excel.
                </p>
                <img src='admin-2.png' id='alone'/>
            </div>
            <div className='separator'/>
            <div className='demo-block-vert' id='proyects'>
                <h2>¿Cómo funcionan los proyectos?</h2>
                <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                        <div className='label'>Visor</div>
                </div>
                <p>
                Un proyecto es una instancia que permite agrupar subproyectos, los que a su vez permiten agrupar egresos de productos de
                múltiples inventarios. De esa forma, tanto proyectos como subproyectos permiten definir presupuestos y evaluar el estado de los mismos. Para
                acceder a los proyectos de una organización, dirígete a la pestaña <span className='bold'>Proyectos</span> al entrar en una organización.
                </p>
                <img src='proy-1.png' id='big-pic'/>
                <h4>
                    Un proyecto puede tener dos estados posibles:
                </h4>
                <ul>
                    <li><span className='bold-green'>Activo: </span> El proyecto se encuentra activo y puede recibir egresos de productos.</li>
                    <li><span className='bold-red'>Inactivo: </span> El proyecto se encuentra inactivo y no puede recibir egresos de productos.</li>
                </ul>
                <p>
                    Cuando un proyecto es desactivado, todas las unidades dentro de sus subproyectos dejan de ser visibles en los inventarios, pero no son eliminadas.
                    Por ello, es importante que los proyectos sean desactivados solo cuando se esté seguro de que no se utilizarán más.
                    Al igual que las categorías y los productos, se puede desplegar el detalle de los subproyectos al hacer click en el panel de cada proyecto. 
                    Se muestran las siguientes métricas:
                </p>
                <ul>
                    <li><span className='bold-black'>Porcentaje de presupuesto utilizado: </span>
                        Porcentaje de presupuesto utilizado por el proyecto. Se calcula dividiendo el valor real del proyecto por el presupuesto del proyecto.
                    </li>
                    <li><span className='bold-black'>Presupuesto: </span> Cantidad definida por el usuario</li>
                    <li><span className='bold-black'>Balance de presupuestos</span>: Diferencia entre el presupuesto del proyecto y la suma de los presupuestos 
                        de los subproyectos. Indica qué tan bien se ha definido el presupuesto del proyecto.
                    </li>
                    <li><span className='bold-black'>Balance Real: </span>
                        Diferencia entre el presupuesto del proyecto y la suma de los valores reales de cada 
                        subproyecto.
                    </li>
                </ul>
                <h4>
                    Un subproyecto puede tener dos estados posibles:
                </h4>
                <ul>
                    <li><span className='bold-green'>Activo: </span> El subproyecto se encuentra activo y puede recibir egresos de productos.</li>
                    <li><span className='bold-red'>Inactivo: </span> El subproyecto se encuentra inactivo y no puede recibir egresos de productos.</li>
                </ul>
                <p>
                    Los subproyectos son agrupaciones de egresos de productos. Todas las <span className='bold'>métricas</span> de un subproyecto son calculadas en base a los egresos de productos que contiene. Las 
                    métricas son las siguientes:
                </p>
                <ul>
                    <li><span className='bold-black'>Presupesto: </span>
                        Cantidad definida por el usuario.
                    </li>
                    <li><span className='bold-black'>Valor Real: </span>
                        Suma del valor de cada unidad de cada producto que ha sido asignada a dicho subproyecto
                    </li>
                    <li><span className='bold-black'>Balance: </span>
                        Diferencia entre el presupuesto del subproyecto y el valor real del subproyecto.
                    </li>
                </ul>
            </div>
            <div className='demo-block-hor'>
                <img src='proy-2.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea tu proyecto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para crear un proyecto, presiona el botón <span className='bold'>MÁS</span> de color azul en la pestaña de proyectos. Llena el formulario con los datos de tu proyecto y presiona <span className='bold'>Crear</span>.
                        Puedes invitar a otros usuarios a que sean editores del nuevo proyecto. Si no invitas editores, puedes hacerlo después.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Edita tu proyecto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                </div>
                <p id='inside-r'>
                    Para editar tu proyecto, presiona el botón <span className='bold'>EDITAR</span> de color azul en la pestaña de proyectos. Puedes cambiar el nombre, descripción y estado del proyecto.
                </p>
                <div className='hor'>
                    <img src='proy-3.png'/>
                    <img src='proy-4.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='proy-5.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Administra editores y visores</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para administrar los editores y visores de un proyecto, presiona el botón <span className='bold'>EDITORES</span> o <span className='bold'>VISORES</span> de color azul en la pestaña de proyectos. Puedes invitar o remover editores y visores.
                    </p>
                </div>
            </div>
            <div className='demo-block-hor'>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Elimina tu proyecto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                    </div>
                    <p id='inside-r'>
                        Para eliminar tu proyecto, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la pestaña de proyectos. Para confirmar, escribe 
                        el nombre del proyecto. Si eres editor o visor, solo tendrás la opción de renunciar al proyecto.
                    </p>
                </div>
                <img src='proy-11.png'/>
            </div>
            <div className='demo-block-hor'>
                <img src='proy-6.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Crea un subproyecto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para crear un subproyecto, presiona el botón <span className='bold'>CREAR SUBPROYECTO</span> de color azul en la pestaña de proyectos. Llena el formulario con los datos de tu subproyecto y presiona <span className='bold'>Crear</span>.   
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Edita tu subproyecto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                </div>
                <p id='inside-r'>
                    Para editar tu subproyecto, presiona el botón <span className='bold'>EDITAR</span> de color azul en la pestaña de proyectos. Puedes cambiar el nombre, descripción y estado del subproyecto.
                </p>
                <div className='hor'>
                    <img src='proy-7.png'/>
                    <img src='proy-8.png'/>
                </div>
            </div>
            <div className='demo-block-hor'>
                <img src='proy-12.png'/>
                <div className='demo-block-vert'>
                    <h2 id='inside-r'>Elimina tu subproyecto</h2>
                    <div className='label-container' id='inside-r'>
                        <div className='label'>Creador</div>
                        <div className='label'>Administrador</div>
                        <div className='label'>Editor</div>
                    </div>
                    <p id='inside-r'>
                        Para eliminar tu subproyecto, presiona el botón <span className='bold-red'>ELIMINAR</span> de color rojo en la pestaña de proyectos. Para confirmar, escribe 
                        el nombre del subproyecto.
                    </p>
                </div>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Administra las unidades de un subproyecto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                    <div className='label'>Visor</div>
                </div>
                <p id='inside-r'>
                    Para administrar las unidades de un subproyecto, presiona el nombre del subproyecto en la pestaña de proyectos. El detalle
                    incluye el valor total de unidades del subproyecto y una lista de unidades separadas por estado.
                </p>
                <img src='proy-9.png' id='alone'/>
            </div>
            <div className='demo-block-vert'>
                <h2 id='inside-r'>Modifica las unidades de un subproyecto</h2>
                <div className='label-container' id='inside-r'>
                    <div className='label'>Creador</div>
                    <div className='label'>Administrador</div>
                    <div className='label'>Editor</div>
                </div>
                <p id='inside-r'>
                    Para modificar las unidades de un subproyecto, selecciona las casillas de las unidades que deseas modificar y selecciona
                    la opción según el estado de la unidad. Algunas opciones se pueden aplicar a múltiples unidades al mismo tiempo.
                </p>
                <img src='proy-10.png' id='alone'/>
                <p>
                    Es recomendable utilizar el botón para <span className='bold'>recargar</span> de color azul para actualizar la lista de unidades correctamente
                </p>
                <img src='prod-8.png' id='big-pic'/>
            </div>
        </div>
        <LandingFooter/>
        </>
    )
}