const usuario = sessionStorage.getItem("usuarioLogeado")
let saldo;
const TNA = 0.97 // Ya que la TNA es de 97%
const interesCuotasMensuales = 0.20; // Esto es porque vamos a cobrar un 20% de interes mensual en las cuotas (hermoso banco)
let arraysPlazosFijos = [];   // Va a contener los arrays con los plazos fijos que se vayan generando
let arraysCuotasPrestamos = [];   // Va a contener los arrays con las cuotas pendientes de pago por prestamos
let operacionActual = 0; // Solo lo uso para usar el mismo form para todas las operaciones, entonces con esta variable indico cual es la operacion que se está realizando actualmente

const cerrarSesion = document.getElementById("botonCerrarSesion")
const mensajeResultado = document.getElementById("mensajeResultado")
const hacerTransferencia = document.getElementById("botonTransferencia")
const crearPlazoF = document.getElementById("botonPlazoF")
const pedirPrestamo = document.getElementById("botonPedirPrestamo")
const consultaPF = document.getElementById("botonConsultaPF")
const consultaPrest = document.getElementById("botonConsultaPrest")
const panel = document.getElementById("formAcciones")
const detallesPanel = document.getElementById("textoDetalles")
const saludarUsuario = document.getElementById("mensajeUsuario")
const mostrarSaldo = document.getElementById("saldoUsuario")

function mostrarMensajito(mensaje,  icono){
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
        icon: icono,
        title: mensaje
    })
}

function cartelConfirmarTransf(monto, cbu){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
        title: '¿Estas seguro?',
        text: `Vas a transferir $${monto} al CBU/CVU: ${cbu}` ,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'No, volver atras!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
        } else if (
          /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
        swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
        )
        }
    })
}
const realizarTransf = (monto, cbu) => {
    if(isNaN(monto) || monto <= 0){
        mostrarMensajito("Ingrese un monto a transferir válido!", "error");
        limpiarFormPanel();
        return false;
    }else if(isNaN(cbu) || cbu.length != 16){
        mostrarMensajito("El CBU/CVU debe ser un numero de 16 digitos!", "warning")
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) > saldo){
        mostrarMensajito("El monto ingresado no puede ser superior a su saldo disponible!", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) < 100){
        mostrarMensajito("El monto mínimo para transferencias es de $100", "warning")
        limpiarFormPanel();
        return false;
    }else if(parseInt(cbu) <= 0){
        mostrarMensajito("Revise el CBU/CVU ingresado e intente nuevemente", "error")
        limpiarFormPanel();
        return false;
    }

    Swal.fire({
        title: 'Realizar transferencia',
        text: `Vas a transferir $${monto} al CBU/CVU: ${cbu}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, es correcto!',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            saldo -= parseInt(monto);
            localStorage.setItem(`saldo_${usuario}`, parseInt(saldo))
            actualizarSaldoUsuario();
            limpiarFormPanel();
            Swal.fire(
            'Listo!',
            'Tu transferencia fue enviada con éxito.',
            'success'
            )
        }
    })
}

const crearPlazoFijo = (monto, dias) => {
    if(isNaN(monto) || monto <= 0){
        mostrarMensajito("Ingrese un monto válido!", "error");
        limpiarFormPanel();
        return false;
    }else if(isNaN(dias) || dias <= 0){
        mostrarMensajito("Ingrese una cantidad de dias válida!", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) > saldo){
        mostrarMensajito("El monto ingresado no puede ser superior a su saldo disponible!", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) < 1000){
        mostrarMensajito("El monto mínimo a invertir es de $1.000", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(dias) < 30){
        mostrarMensajito("El plazo mínimo para la constitucion de un plazo fijo es de 30 dias", "error")
        limpiarFormPanel();
        return false;
    }
    let interes = parseInt(monto * (dias * (TNA / 360)));
    
    saldo -= parseInt(monto);
    localStorage.setItem(`saldo_${usuario}`, parseInt(saldo))
    actualizarSaldoUsuario();
    arraysPlazosFijos.push({monto, dias, interes})

    let PlazosJSON = JSON.stringify(arraysPlazosFijos);
    localStorage.setItem(`PlazosFijos_${usuario}`, PlazosJSON);

    mostrarMensajito(`Creó un plazo fijo de $${monto} a ${dias} días exitosamente`, "success")
    limpiarFormPanel();
}

const solicitarPrestamo = (monto, cuotas) => {
    if(isNaN(monto) || monto <= 0){
        mostrarMensajito("Ingrese un monto válido!", "error")
        limpiarFormPanel();
        return false;
    }else if(isNaN(cuotas) || cuotas <= 0){
        mostrarMensajito("Ingrese un número de cuotas válido!", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(monto) < 1000){
        mostrarMensajito("El monto mínimo de un prestamo es de $1.000", "error")
        limpiarFormPanel();
        return false;
    }else if(parseInt(cuotas) < 1 || parseInt(cuotas) > 12){
        mostrarMensajito("La cantidad de cuotas mensuales debe ser mayor a 1 e inferior a 12", "error")
        limpiarFormPanel();
        return false;
    }
    let valorCuota = parseInt((parseInt(monto) / parseInt(cuotas)) + ((parseInt(monto) * (parseInt(cuotas) * interesCuotasMensuales)) / parseInt(cuotas)));
    
    saldo += parseInt(monto);
    localStorage.setItem(`saldo_${usuario}`, parseInt(saldo))
    actualizarSaldoUsuario();
    arraysCuotasPrestamos.push({monto, cuotas, valorCuota})
    let PrestamosJSON = JSON.stringify(arraysCuotasPrestamos);
    localStorage.setItem(`Prestamos_${usuario}`, PrestamosJSON);

    mostrarMensajito(`Ya tenés acreditado tu prestamo de $${monto} a pagar en ${cuotas} cuotas de ${valorCuota} cada una.`, "success")
    limpiarFormPanel();
}

const limpiarFormPanel = () => {
    /*
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
    }*/

    panel.innerHTML="";
    detallesPanel.innerText= "";
    operacionActual = 0; // "operacionActual" se usa para poder usar el mismo formulario para todas las opciones del panel
}

hacerTransferencia.addEventListener("click",()=>{
    limpiarFormPanel();
    detallesPanel.innerText= "Realizar una transferencia:"
    panel.innerHTML=`
    <label for="monto">Monto a transferir:</label>
    <input class="boton" type="number" name="monto" placeholder="Monto" id="monto">
    <label for="cbu">CBU/CVU:</label>
    <input class="boton" type="number" name="cbu" placeholder="CBU/CVU" id="cbu">
    <input type="submit" class="boton" placeholder="submit" id="botonPanel">
    `
    operacionActual = 5; // Operacion actual = realizar transferencia
})

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
        for(let i = 0; i < prestamosPagando; i++){
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
        case 5: // Realizar una transferencia
            //console.log(`var1: [${cliente.monto}] var2: [${cliente.cbu}]`);
            realizarTransf(cliente.monto, cliente.cbu);
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

async function obtenerSaldoGuardado(usuarioLogeado){
    try {
        const datosSinProcesar = await fetch("./base/usuarios.json")
        const datos = await datosSinProcesar.json()
        datos.forEach(elemento => {
            //console.table(`UsuarioLogeado: ${usuarioLogeado} cuenta:${elemento.cuenta} saldo: ${elemento.saldo}`);
            if(elemento.cuenta === usuarioLogeado){
                //alert("asdasda")
                let verificarSaldoGuardado = parseInt(localStorage.getItem(`saldo_${usuario}`))
                console.log(verificarSaldoGuardado)
                if(isNaN(verificarSaldoGuardado) || parseInt(verificarSaldoGuardado) <= 0){
                    console.log(`Se creó en el LocalStorage: saldo_${usuarioLogeado} = ${elemento.saldo} [${verificarSaldoGuardado}] - usuario[${usuario}]`)
                    localStorage.setItem(`saldo_${usuario}`, parseInt(elemento.saldo))
                    saldo = parseInt(elemento.saldo);
                }else{
                    console.log(`Datos adquiridos en la DB: verificarSaldoGuardado[${verificarSaldoGuardado}] - usuario[${usuario}]`)
                    saldo = parseInt(verificarSaldoGuardado);
                }
            }
        })
        actualizarSaldoUsuario();
    } catch (e) {
        console.log("Error obteniendo saldo del usuario.");
    }
}

function validarUsuarioLogeado(){
    if(!usuario){
        alert("No hay usuario logeado, redireccionando al index para que acceda")
        window.location.href = "/index.html";
    }
    saludarUsuario.innerText = `Bievenido ${usuario}`

    obtenerSaldoGuardado(usuario);

    const ConseguirPlazosFijos = localStorage.getItem(`PlazosFijos_${usuario}`);
    if(ConseguirPlazosFijos != null){   // Check si es que existe guardado en localStorage algún plazo fijo
        arraysPlazosFijos = JSON.parse(ConseguirPlazosFijos)
    }

    const ConseguirCuotasPrestamos = localStorage.getItem(`Prestamos_${usuario}`);
    if(ConseguirCuotasPrestamos != null){   // Check si es que existe guardado en localStorage algún plazo fijo
        arraysCuotasPrestamos = JSON.parse(ConseguirCuotasPrestamos)
    }
}

validarUsuarioLogeado();