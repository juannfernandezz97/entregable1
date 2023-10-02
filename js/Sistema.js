const datosIngreso = [];

const formulario = document.getElementById("ingresar")
const sesionIniciada = sessionStorage.getItem("logeado")
//console.log(formulario.innerHTML)
function checkUsuarioLogeado(){
    if(sesionIniciada === "1"){
        //console.log("Usuario ya ingresado, redireccionando al panel de usuario")
        window.location.href = "/panel.html";
    }else{
        //console.log("No hay una sesion ya iniciada")
    }
}

function mostrarMensajeError(mensaje){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: 'error',
        title: mensaje
    })
}

async function obtenerDatosIngreso(){
    try {
        const datosSinProcesar = await fetch("./base/usuarios.json")
        const datos = await datosSinProcesar.json()
        datos.forEach(elemento => {
            datosIngreso.push(elemento)
            //console.log(`cuenta:${elemento.cuenta} saldo: ${elemento.saldo}`);
        });
    } catch (e) {
        mostrarMensajeError("Estamos teniendo problemas para acceder a la base de datos, por favor intente nuevamente mas tarde.");
    }
}

const validarLogin = (usuario, contrasenia) => {
    // No uso .ToLowerCase porque porque tratandose de datos de sesión deberian distinguirse entre mayusculas y minusculas
    if(datosIngreso.length <= 0){   // No hay cuentas en el archivo .json o no se cargaron por X motivo
        mostrarMensajeError("Estamos teniendo problemas para acceder a la base de datos, por favor intente nuevamente mas tarde.");
        return false;
    }

    for(let i = 0; i < datosIngreso.length; i++){
        if(datosIngreso[i].cuenta === usuario){
            if(datosIngreso[i].contrasenia === contrasenia){
                mostrarMensajeError("INGRESO CORRECTO")
                return true;
            }else{
                mostrarMensajeError("La contraseña ingresada es incorrecta, intente nuevamente")
                return false;
            }
        }
    }    
    mostrarMensajeError("El nombre de usuario ingresado no existe, intente nuevamente")
    return false;
}

formulario.addEventListener("submit", (evento)=>{
    evento.preventDefault()
    let usuario = evento.target[0].value;
    let contrasenia = evento.target[1].value;
    let ingresoOk = validarLogin(usuario, contrasenia);
    if(ingresoOk){
        sessionStorage.setItem("logeado", 1)
        sessionStorage.setItem("usuarioLogeado", usuario)
        //console.log("ingreso OK")
        window.location.href = "/panel.html";
    }
} )

checkUsuarioLogeado();  // Checkear si ya se inicio sesion
obtenerDatosIngreso();  // Cargar en un array todos los usuarios y contraseñas