const user = "juan"
const pass = "12345"
let saldo = 100000
const TNA = 0.97 // Ya que la TNA es de 97%
const interesCuotasMensuales = 0.20; // Esto es porque vamos a cobrar un 20% de interes mensual en las cuotas (hermoso banco)
const arraysPlazosFijos = [];   // Va a contener los arrays con los plazos fijos que se vayan generando
const arraysCuotasPrestamos = [];   // Va a contener los arrays con las cuotas pendientes de pago por prestamos

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
    let confirmacion = confirm(`Va a invertir ${monto} por ${dias} días, lo cual le va a generar un interes de $${interes}, es correcto?`);
    if(confirmacion === true){
        saldo -= monto;
        alert("Plazo fijo generado con exito!")
        arraysPlazosFijos.push({monto, dias, interes})
        console.table(arraysPlazosFijos)
    }
}

const solicitarPrestamo = (monto, cuotas) => {
    if(monto < 1000){
        alert("El monto mínimo de un prestamo es de $1.000");
        return false;
    }else if(cuotas < 1 || cuotas > 12){
        alert("La cantidad de cuotas mensuales debe ser mayor a 1 e inferior a 12");
        return false;
    }
    let valorCuota = (monto / cuotas) + ((monto * (cuotas * interesCuotasMensuales)) / cuotas);
    let confirmacion = confirm(`Va a solicitar un prestamo por $${monto} a pagar en ${cuotas} cuotas fijas mensuales de $${valorCuota} cada una, si es correcto seleccione "Confirmar"`);
    if(confirmacion === true){
        saldo += monto;
        alert(`Prestamo solicitado con éxito!\nAhora su saldo es de $${saldo} `)
        arraysCuotasPrestamos.push({cuotas, valorCuota})
        console.table(arraysCuotasPrestamos)
        console.log(arraysCuotasPrestamos)
    }
}

const consultarMovimientos = (tipoMovimiento) => {
    if(tipoMovimiento === 1){       // Plazos fijos
        let plazosFijos = arraysPlazosFijos.length;
        alert(`${user}: Has realizado ${plazosFijos} plazos fijos. Consulta la consola (tecla F12) para obtener mas información.`)
        for(let i = 0; i < plazosFijos; i++){
            console.log(`Plazo fijo N°${i+1}: Capital invertido: ${arraysPlazosFijos[i].monto}, a ${arraysPlazosFijos[i].dias} días que generará ${arraysPlazosFijos[i].interes} de interes`)
        }
    }else if(tipoMovimiento === 2){ // Prestamos

    }else{                          // ERROR INESPERADO 

    }
}

const realizarOperacion = (tipoOperacion) => {
    switch(tipoOperacion){
        case 1: // Hacer plazo fijo
            let monto = parseInt(prompt(`Está a punto de crear un nuevo plazo fijo y su saldo disponible es ${saldo} \n Ingrese la cantidad que desea invertir:`));
            let dias = parseInt(prompt(`Ingresó ${monto}, si es correcto ingrese el plazo en dias (mínimo 30):`));
            
            crearPlazoFijo(monto, dias);
            break;
        case 2: // Solicitar un prestamo
            let montoPrestamo = parseInt(prompt(`Está a punto de solicitar un nuevo préstamo.\n Ingrese la cantidad que desea solicitar:`));   
            let cuotasPrestamo = parseInt(prompt(`Ingrese en cuantas cuotas(mensuales) desea pagar su prestamo de ${montoPrestamo}:`));   
            
            solicitarPrestamo(montoPrestamo, cuotasPrestamo);
            break;
        case 3: // Consultar plazos fijos creados
            if(arraysPlazosFijos.length <= 0){
                alert("Actualmente no hay ningún plazo fijo creado.");
            }else{
                consultarMovimientos(1);
            }
            break;
        case 4: // Consultar prestamos solicitados
            if(arraysCuotasPrestamos.length <= 0){
                alert("No has solicitado ningún prestamo hasta el momento.");
            }else{
                consultarMovimientos(2);
            }
            break;
        default:
            alert("Ingresó una opcion inválida.");
    }
}

const validarLogin = () => {
    // No uso .ToLowerCase porque porque tratandose de datos de sesión deberian distinguirse entre mayusculas y minusculas ¿No?
    let userInput = prompt("Bienvenido a su HomeBanking, ingrese su nombre de usuario:") 
    if(userInput === user){
        let passwordInput = prompt(`Bienvenido ${userInput}, ingrese su contraseña:`)
        
        if(passwordInput === pass){
            return true;
        }
        else{
            alert("La contraseña ingresada es incorrecta")
            return false;
        }
    }
    alert("El nombre de usuario que ingresó es incorrecto")
    return false;
}

function main(){
    let loopLogin = true;
    let ingresoCorrecto = false;
    while(loopLogin){ 
        ingresoCorrecto = validarLogin()

        if(!ingresoCorrecto){
            loopLogin = confirm("¿Desea intentarlo nuevamente?")
        }
        else{
            loopLogin = false;
        }
    }

    if(ingresoCorrecto == true){
        let loopOperacion = true;
        while(loopOperacion)
        {
            let tipoOperacion = parseInt(prompt(`Bienvenido a su cuenta ${user}, posee un saldo de $${saldo} ¿Que operación desea realizar? \nIngrese 1 para constituir un plazo fijo \nIngrese 2 para solicitar un prestamo\nIngrese 3 para consultar sus plazos fijos existentes`))
        
            realizarOperacion(tipoOperacion);
            
            loopOperacion = confirm("¿Desea realizar otra operación?")
            if(loopOperacion == false){
                alert("Gracias por utilizar nuestros servicios!")
            }
        }
    }
    else{
        alert("Adios! Vuelva pronto.")
    }
}

main();