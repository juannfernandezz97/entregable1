const user = "juan"
const pass = "12345"

const formulario = document.getElementById("ingresar")
//console.log(formulario.innerHTML)

const validarLogin = (usario, contrasenia) => {
    // No uso .ToLowerCase porque porque tratandose de datos de sesión deberian distinguirse entre mayusculas y minusculas ¿No?
    if(usario === user){        
        if(contrasenia === pass){
            alert("INGRESO EXITOSO !!")
            return true;
        }
        else{
            alert("La contraseña ingresada es incorrecta")
            return false;
        }
    }else{
        alert("El nombre de usuario ingresado es incorrecto")
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
        window.location.href = "\panel.html";
    }
} )