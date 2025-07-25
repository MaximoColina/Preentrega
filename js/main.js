window.addEventListener('load', () => {
    document.getElementById('form').reset();
});

/* validaciones */
// Declaración variables
const form = document.querySelector('#form');
const apellidoIn = document.querySelector('#apellido');
const nombreIn = document.querySelector('#nombre');
const correoIn = document.querySelector('#correo');
const comentariosIn = document.querySelector('#comentarios');


form.addEventListener('submit', (event) => {
event.preventDefault();

hideAllErrors();

let esValido = true;


  // Funciones
if (!validarApellidoFt()) {
    showError('empty-apellido', 'Ingrese un apellido válido');
    apellidoIn.focus();
    esValido=false;
}


if (!validarNombreFt()) {
    showError('empty-nombre','Ingrese un nombre válido');
    if (esValido) nombreIn.focus();
    esValido=false;
}


if (!validarCorreoFt()) {
    showError('empty-email','Ingrese un correo electrónico válido');
    if(esValido) correoIn.focus();
    esValido=false;
}


if (!validarComentariosFt()) {
    showError('empty-comentarios','Ingrese un comentario válido (1 a 200 caracteres)');
    if(esValido) comentariosIn.focus();
    esValido=false;
}
if(esValido){
    form.submit();
}
});


function validarApellidoFt() {
const apellido = apellidoIn.value.trim();
const regex = /^[a-zA-Z\s]+$/;
return regex.test(apellido) && apellido.length > 0 && apellido.length <= 50;
}


function validarNombreFt() {
const nombre = nombreIn.value.trim();
const regex = /^[a-zA-Z\s]+$/;
return regex.test(nombre) && nombre.length > 0 && nombre.length <= 50;
}


function validarCorreoFt() {
const correo = correoIn.value.trim();
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(correo) && correo.length > 0 && correo.length <= 50;
}


function validarComentariosFt() {
const comentarios = comentariosIn.value.trim();
return comentarios.length > 0 && comentarios.length <= 200;
}


function showError(fieldId,message){
    const errorElement = document.getElementById(fieldId+'-error');
    if(errorElement){
        errorElement.textContent = '❌ '+message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'red';

    }
}


function hideAllErrors(){
    const errorIds = ['empty-apellido','empty-nombre', 'empty-email','empty-comentarios'];
    errorIds.forEach(id => hideError(id));
}


function hideError(fieldId){
    const errorElement = document.getElementById(fieldId+'-error');
    if (errorElement){
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}



