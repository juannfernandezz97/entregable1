let saldo = 100000
const TNA = 0.97 // Ya que la TNA es de 97%
const interesCuotasMensuales = 0.20; // Esto es porque vamos a cobrar un 20% de interes mensual en las cuotas (hermoso banco)
const arraysPlazosFijos = [];   // Va a contener los arrays con los plazos fijos que se vayan generando
const arraysCuotasPrestamos = [];   // Va a contener los arrays con las cuotas pendientes de pago por prestamos
let operacionActual = 0; // Solo lo uso para usar el mismo form para todas las operaciones, entonces con esta variable indico cual es la operacion que se está realizando actualmente

const crearPlazoF = document.getElementById("botonPlazoF")
const panel = document.getElementById("formAcciones")

const crearPlazoFijo = (monto, dias) => {
    if(monto > saldo){
        alert("El monto ingresado no puede ser superior a su saldo disponible!");
        return false;
    }else if(monto < 1000){
        alert("El monto mínimo a invertir es de $1.000");
        return false;
    }else if(dias < 30){
        alert("El plazo mínimo para la constitucion de un plazo fijo es de 30 dias");
        return false;
    }
    let interes = parseInt(monto * (dias * (TNA / 360)));
    let confirmacion = confirm(`Va a invertir $${monto} por ${dias} días, lo cual le va a generar un interes de $${interes}, es correcto?`);
    if(confirmacion === true){
        saldo -= monto;
        arraysPlazosFijos.push({monto, dias, interes})
        console.log(`Plazo fijo creado, capital invertido: $${monto}, a ${dias} días que generará $${interes} de interes. Saldo restante: $${saldo}`)
        alert(`Plazo fijo generado con exito!\nAhora su saldo es de $${saldo} `)
    }
}


crearPlazoF.addEventListener("click",()=>{
    alert("vas a crear un plazo fijo")
    const montoPlazoF = document.createElement("input")
    montoPlazoF.type = "number"
    montoPlazoF.name = "monto"
    montoPlazoF.placeholder = "monto"
    montoPlazoF.id = "monto"
    const diasPlazoF = document.createElement("input")
    diasPlazoF.type = "number"
    diasPlazoF.name = "dias"
    diasPlazoF.placeholder = "dias"
    diasPlazoF.id = "dias"
    const botonCrearPlazoF = document.createElement("input")
    botonCrearPlazoF.type = "submit"
    botonCrearPlazoF.placeholder = "submit"
    panel.appendChild(montoPlazoF)
    panel.appendChild(diasPlazoF)
    panel.appendChild(botonCrearPlazoF)
    operacionActual = 1; // Operacion actual = plazo fijo
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
            solicitarPrestamo(montoPrestamo, cuotasPrestamo);
            break;
        case 3: // Consultar plazos fijos creados
            consultarMovimientos(1);
            break;
        case 4: // Consultar prestamos solicitados
            consultarMovimientos(2);
            break;
        default:
            alert("ERROR INESPERADO DEL SISTEMA.");
    }
     
 })