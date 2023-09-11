const user = "juan"
const pass = "12345"

const formulario = document.getElementById("ingresar")
const sesionIniciada = sessionStorage.getItem("logeado")
const mensajeIngreso = document.getElementById("msgIngresoFallido")
//console.log(formulario.innerHTML)
function checkUsuarioLogeado(){
    if(sesionIniciada === "1"){
        //console.log("Usuario ya ingresado, redireccionando al panel de usuario")
        window.location.href = "/panel.html";
    }else{
        //console.log("No hay una sesion ya iniciada")
    }
}

const validarLogin = (usario, contrasenia) => {
    // No uso .ToLowerCase porque porque tratandose de datos de sesión deberian distinguirse entre mayusculas y minusculas ¿No?
    if(usario === user){        
        if(contrasenia === pass){
            sessionStorage.setItem("logeado", 1)
            sessionStorage.setItem("usuarioLogeado", usario)
            return true;
        }
        else{
            mensajeIngreso.innerText = "La contraseña ingresada es incorrecta"
            return false;
        }
    }else{
        mensajeIngreso.innerText = "El nombre de usuario ingresado es incorrecto"
        return false;
    }
}

formulario.addEventListener("submit", (evento)=>{
    evento.preventDefault()
    console.log(evento.target[0].value)
    console.log(evento.target[1].value)
    let usuario = evento.target[0].value;
    let contrasenia = evento.target[1].value;
    let ingresoOk = validarLogin(usuario, contrasenia);
    if(ingresoOk){
        console.log("ingreso OK")
        window.location.href = "/panel.html";
    }
} )

checkUsuarioLogeado();  // Checkear si ya se inicio sesion