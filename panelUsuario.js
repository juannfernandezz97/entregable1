const usuario = sessionStorage.getItem("usuarioLogeado")
let saldo = localStorage.getItem("saldoUsuario")
const TNA = 0.97 // Ya que la TNA es de 97%
const interesCuotasMensuales = 0.20; // Esto es porque vamos a cobrar un 20% de interes mensual en las cuotas (hermoso banco)
let arraysPlazosFijos = [];   // Va a contener los arrays con los plazos fijos que se vayan generando
const arraysCuotasPrestamos = [];   // Va a contener los arrays con las cuotas pendientes de pago por prestamos
let operacionActual = 0; // Solo lo uso para usar el mismo form para todas las operaciones, entonces con esta variable indico cual es la operacion que se está realizando actualmente

const cerrarSesion = document.getElementById("botonCerrarSesion")
const mensajeResultado = document.getElementById("mensajeResultado")
const crearPlazoF = document.getElementById("botonPlazoF")
const pedirPrestamo = document.getElementById("botonPedirPrestamo")
const consultaPF = document.getElementById("botonConsultaPF")
const consultaPrest = document.getElementById("botonConsultaPrest")
const panel = document.getElementById("formAcciones")
const detallesPanel = document.getElementById("textoDetalles")
const saludarUsuario = document.getElementById("mensajeUsuario")
const mostrarSaldo = document.getElementById("saldoUsuario")

const crearPlazoFijo = (monto, dias) => {
    if(isNaN(monto) || monto === null){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "Ingrese un monto válido!"
        limpiarFormPanel();
        return false;
    }else if(isNaN(dias) || dias === null){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "Ingrese una cantidad de dias válida!"
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) > saldo){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "El monto ingresado no puede ser superior a su saldo disponible!"
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) < 1000){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "El monto mínimo a invertir es de $1.000"
        limpiarFormPanel();
        return false;
    }else if(parseInt(dias) < 30){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "El plazo mínimo para la constitucion de un plazo fijo es de 30 dias"
        limpiarFormPanel();
        return false;
    }
    let interes = parseInt(monto * (dias * (TNA / 360)));
    
    saldo -= parseInt(monto);
    localStorage.setItem("saldoUsuario", parseInt(saldo))
    actualizarSaldoUsuario();
    arraysPlazosFijos.push({monto, dias, interes})

    let PlazosJSON = JSON.stringify(arraysPlazosFijos);
    localStorage.setItem("PlazosFijos", PlazosJSON);

    mensajeResultado.className = "verde"
    mensajeResultado.innerText = `Creó un plazo fijo de $${monto} a ${dias} días exitosamente`
    limpiarFormPanel();
}

const solicitarPrestamo = (monto, cuotas) => {
    if(isNaN(monto) || monto === null){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "Ingrese un monto válido!"
        limpiarFormPanel();
        return false;
    }else if(isNaN(cuotas) || cuotas === null){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "Ingrese un número de cuotas válido!"
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) < 1000){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "El monto mínimo de un prestamo es de $1.000"
        limpiarFormPanel();
        return false;
    }else if(parseInt(cuotas) < 1 || parseInt(cuotas) > 12){
        mensajeResultado.className = "rojo"
        mensajeResultado.innerText = "La cantidad de cuotas mensuales debe ser mayor a 1 e inferior a 12"
        limpiarFormPanel();
        return false;
    }
    let valorCuota = parseInt((parseInt(monto) / parseInt(cuotas)) + ((parseInt(monto) * (parseInt(cuotas) * interesCuotasMensuales)) / parseInt(cuotas)));
    
    saldo += parseInt(monto);
    localStorage.setItem("saldoUsuario", parseInt(saldo))
    actualizarSaldoUsuario();
    arraysCuotasPrestamos.push({monto, cuotas, valorCuota})
    let PrestamosJSON = JSON.stringify(arraysCuotasPrestamos);
    localStorage.setItem("PrestamosSolicitados", PrestamosJSON);

    mensajeResultado.className = "verde"
    mensajeResultado.innerText = `Ya tenés acreditado tu prestamo de $${monto} a pagar en ${cuotas} cuotas de ${valorCuota} cada una.`
    limpiarFormPanel();
}

const limpiarFormPanel = () => {
    //alert("Eliminando contenido del form")
    
    if(operacionActual === 1){
        const borrarMonto = document.getElementById("monto")
        const borrarDias = document.getElementById("dias")
        const borrarBotonPF = document.getElementById("botonPanel")
        panel.removeChild(borrarMonto);
        panel.removeChild(borrarDias);
        panel.removeChild(borrarBotonPF);
    }else if(operacionActual === 2){
        const borrarMonto = document.getElementById("monto")
        const borrarDias = document.getElementById("cuotas")
        const borrarBotonPF = document.getElementById("botonPanel")
        panel.removeChild(borrarMonto);
        panel.removeChild(borrarDias);
        panel.removeChild(borrarBotonPF);
    }
    detallesPanel.innerText= "";
    operacionActual = 0; // Operacion actual = plazo fijo
}

crearPlazoF.addEventListener("click",()=>{
    limpiarFormPanel();
    detallesPanel.innerText= "A continuacion vas a conformar un nuevo plazo fijo:"
    panel.innerHTML=`
    <input type="number" name="monto" placeholder="monto" id="monto">
    <input type="number" name="dias" placeholder="Cantidad de dias" id="dias">
    <input type="submit" placeholder="submit" id="botonPanel">
    `
    operacionActual = 1; // Operacion actual = plazo fijo
})

pedirPrestamo.addEventListener("click",()=>{
    limpiarFormPanel();
    detallesPanel.innerText= "A continuacion vas a solicitar un prestamo."
    panel.innerHTML=`
    <input type="number" name="monto" placeholder="monto" id="monto">
    <input type="number" name="cuotas" placeholder="Cantidad de cuotas" id="cuotas">
    <input type="submit" placeholder="submit" id="botonPanel">
    `
    operacionActual = 2; // Operacion actual = pedir prestamo
})

consultaPF.addEventListener("click",()=>{
    limpiarFormPanel();
    let plazosFijos = arraysPlazosFijos.length;
    if(plazosFijos <= 0){
        panel.innerHTML=`
        <h3 class="rojo"> No hay ningún plazo fijo para mostrar</h3>
        `
    }else{
        detallesPanel.innerText= "Tus plazos fijos existentes son:"
        panel.innerHTML=`
        <ul class="verde">
        </ul>
        `
        for(let i = 0; i < plazosFijos; i++){
            //console.log(`Plazo fijo N°${i+1}: Capital invertido: $${arraysPlazosFijos[i].monto}, a ${arraysPlazosFijos[i].dias} días que generará $${arraysPlazosFijos[i].interes} de interes`)
            const listaPF = document.createElement("li")
            listaPF.innerText = `Plazo fijo N°${i+1}: Capital invertido: $${arraysPlazosFijos[i].monto}, a ${arraysPlazosFijos[i].dias} días que generará $${arraysPlazosFijos[i].interes} de interes`
            panel.appendChild(listaPF)
        }
    }
})

consultaPrest.addEventListener("click",()=>{
    limpiarFormPanel();
    let prestamosPagando = arraysCuotasPrestamos.length;
    if(prestamosPagando <= 0){
        panel.innerHTML=`
        <h3 class="rojo"> Actualmente no tienes ningún prestamo impago.</h3>
        `
    }else{
        detallesPanel.innerText= "Actualmente estás pagando cuotas por los siguientes prestamos solicitados:"
        panel.innerHTML=`
        <ul class="verde">
        </ul>
        `
        //alert(`${user}: Has solicitado ${prestamosPagando} prestamos por un total de $${totalMontoPrestamos} . Consulta la consola para obtener mas información.`)
        for(let i = 0; i < prestamosPagando; i++){
            //console.log(`Plazo fijo N°${i+1}: Capital invertido: $${arraysPlazosFijos[i].monto}, a ${arraysPlazosFijos[i].dias} días que generará $${arraysPlazosFijos[i].interes} de interes`)
            const listaPrestamos = document.createElement("li")
            listaPrestamos.innerText = `Prestamo N°${i+1}: Monto solicitado: $${arraysCuotasPrestamos[i].monto} a pagar en ${arraysCuotasPrestamos[i].cuotas} cuotas mensuales de $${arraysCuotasPrestamos[i].valorCuota} cada una.`
            panel.appendChild(listaPrestamos)
        }
    }
})

cerrarSesion.addEventListener("click",()=>{
    sessionStorage.clear()
    window.location.href = "/index.html";
})


panel.addEventListener("submit", (evento)=>{
    evento.preventDefault(0)
    const datos = new FormData(evento.target)
    const cliente = Object.fromEntries(datos)
    console.log(cliente)

    switch(operacionActual){
        case 1: // Hacer plazo fijo
            crearPlazoFijo(cliente.monto, cliente.dias);
            break;
        case 2: // Solicitar un prestamo
            solicitarPrestamo(cliente.monto, cliente.cuotas);
            break;
        case 3: // Consultar plazos fijos creados
            consultarMovimientos(1);
            break;
        case 4: // Consultar prestamos solicitados
            consultarMovimientos(2);
            break;
        default:
            console.log("Se envió un formulario invalido.");
    }
})

function separadorDeMiles(x) {  // Esta función me la robé de internet
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function actualizarSaldoUsuario(){
    mostrarSaldo.innerText = `Tu saldo es: $${separadorDeMiles(saldo)}`
}

function validarUsuarioLogeado(){
    if(!usuario){
        alert("No hay usuario logeado, redireccionando al index para que acceda")
        window.location.href = "/index.html";
    }
    saludarUsuario.innerText = `Bievenido ${usuario}`

    if(saldo <= 0){
        saldo = 100000;
        localStorage.setItem("saldoUsuario", saldo);
    }

    actualizarSaldoUsuario();

    const ConseguirPlazosFijos = localStorage.getItem("PlazosFijos");
    console.log(ConseguirPlazosFijos);
    if(ConseguirPlazosFijos != null){   // Check si es que existe guardado en localStorage algún plazo fijo
        arraysPlazosFijos = JSON.parse(ConseguirPlazosFijos)
    }

}

validarUsuarioLogeado();