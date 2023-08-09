//Config socket lado cliente
const socket = io();

//Emitiendo desde el cliente
socket.emit('mensajeKey', "Hola desde el cliente");

//Escuchando al servidor (sale por consola del navegador)
socket.on("msg_02", data=>{
    console.log(data);
});

socket.on("msg_03", data =>{
    console.log(data);
});

socket.on("msg_04", data =>{
    console.log(data);
});
