/**
 *@file app_DC.js 
 *@brief Código principal para la página web index_DC.html
 * 
 * Código que conlleva una página para agendar citas 
 * 
 * @author Patricia García González
 * @date 30/10/2024
 * */




/**
 * Función que muestra la hora y fecha actual, en este caso,
 * en la cabecera de la página web
 * 
 */
function showDH() {
    const now = new Date();
    const dateOptions = {year: 'numeric', month: 'long', weekday:'long', day:'2-digit' }
    const timeOptions = {hour: '2-digit', minute:'2-digit'}

    let datePart = now.toLocaleDateString('es-ES', dateOptions)
    const timePart = now.toLocaleTimeString('es-ES', timeOptions);

    datePart = datePart.charAt(0).toUpperCase() + datePart.slice(1);

    const dateTime = `${datePart}, ${timePart}`;

    document.getElementById('date').textContent = dateTime;
}

showDH();
setInterval(showDH, 1000);

/**
 * @class Patient
 * @brief Clase que representa un paciente de la clínica dental
 * 
 * Representa un paciente, recogiendo la información necesaria así como su nombre, apellidos,
 * teléfono y DNI 
 */
class Patient {
    constructor(name, surnames, DNI, phoneNumber, birthdate){
        this.name = name;
        this.surnames = surnames;
        this.DNI = DNI;
        this.phoneNumber = phoneNumber;
        this.birthdate = birthdate;
    }

}


/**
 * Función que carga los pacientes existentes o los crea en la base de datos con 'localStorage'
 * 
 * 
 */
function patientL(){
    const patients = JSON.parse(localStorage.getItem('patients')) || []; 
}


/**
 * Función que crea el objeto patient de la clase Patient y lo guarda
 * en el local storage para luego llamar a la funcion patientL() y cargar los pacientes 
 * 
 * @param {Event} event Evento de envío del formulario de 'Datos del paciente' para evitar
 * que se recargue la página 
 * 
 */
function createPatients(event) {
    event.preventDefault();

    const patient = new Patient(
       document.getElementById('name').value,
       document.getElementById('surnames').value,
       document.getElementById('DNI').value,
       document.getElementById('phone').value,
       document.getElementById('birthdate').value
    )


    const patients = JSON.parse(localStorage.getItem('patients')) || []; 
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
    patientL();
}

document.getElementById('patients').addEventListener('submit', createPatients);
patientL();



/**
 * @class Quote
 * @brief Clase que representa una cita
 * 
 * Clase que representa una cita, recogiendo la información 
 * necesaria del horario de la cita junto el nombre del paciente previamente registrado
 * 
 */
class Quote{
    /**
     * Constructor de la clase Quote
     *
     * @param {} dateQ
     * @param {string} patientDNI
     * @param {string} observations
     */
    constructor(dateQ, patientDNI, observations){
        this.dateQ = dateQ;
        this.patientDNI = patientDNI;
        this.observations = observations;
        this.id = dateQ + patientDNI;
     }
}

 /**
  * @function quotesL
  * @brief Carga de la base de datos de las citas
  * 
  * Función que se encarga de cargar la base de datos de las citas o los crea usando 'Localstorage'
  */
 function quotesL() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];

    const patients = JSON.parse(localStorage.getItem('patients')) || []; 

    const quoteTable = document.querySelector('.quoteTable tbody');

    quoteTable.innerHTML = ' ';
 
    
    if(quotes.length !== 0){
        quotes.forEach((quotes, index_DC) => {

            const patient = patients.find( p => p.DNI === quotes.patientDNI)

            const quoteRow = document.createElement('tr');
            quoteRow.innerHTML = `
            <td>${index_DC + 1}</td>
            <td>${quotes.dateQ}</td>
            <td>${patient.birthdate}</td>
            <td>${patient.name}</td>
            <td>${patient.surnames}</td>
            <td>${quotes.patientDNI}</td>
            <td>${patient.phoneNumber}</td> 
            <td>${quotes.observations}
            <button onclick="quoteDelete('${quotes.id}')" id="deleteB">Eliminar cita</button>
            <button onclick="quoteModify('${quotes.id}')" id="modifyB">Modificar cita</button>
            </td>`;
            quoteTable.appendChild(quoteRow);
        })
        document.querySelector('.quoteTable tbody').style.display = 'table-row';

    } else {
        quoteTable.innerHTML = "<tr class=`dataQuotes`><td colspan=`8`>No existen citas agendadas</td></tr>";
    }
    
 }

/**
 * @function quotesC
 * @brief Creación de un objeto de la clase Quote y su guardado con 'Localstorage' 
 * 
 * Función que crea un objeto de la clase Quote y lo guarda
 * 
 * @param {Event} event Evento de envió del formulario de 'Añadir cita' 
 * evitando así que se recarge la página
 */
function quotesC(event) {
    event.preventDefault();

    const quote = new Quote (
        document.getElementById('dateQ').value,
        document.getElementById('patientDNI').value,
        document.getElementById('observations').value
    );

    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes.push(quote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    quotesL();
}

document.getElementById('quotes').addEventListener('submit', quotesC);
quotesL();


/**
 * @function quoteDelete
 * @brief Función que elimina una cita ya creada
 * 
 * @param {string} id identificador único que se crea en cada objeto quote
 */
function quoteDelete(id){
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
    const quoteD = quotes.filter(quote => quote.id !== id);
    localStorage.setItem('quotes', JSON.stringify(quoteD));
    quotesL();

}


/**
 * @function quoteModify
 * @brief Función que modifica una cita 
 * 
 * @param {string} id identificador único que se crea en cada objeto quote
 */

function quoteModify(id) {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const patients = JSON.parse(localStorage.getItem('patients')) || []; 

    const quoteM = quotes.find(quotes => quotes.id === id);

    const patient = patients.find( p => p.DNI === quoteM.patientDNI)

    document.getElementById('dateQ').value = quoteM.dateQ;
    document.getElementById('patientDNI').value = quoteM.patientDNI;
    document.getElementById('observations').value = quoteM.observations;

    quoteDelete(id);
}



