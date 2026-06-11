// Conexión USB (iPhone/PC)
document.getElementById('btn-conectar-usb')?.addEventListener('click', async () => {
    try {
        const puerto = await navigator.serial.requestPort();
        await puerto.open({ baudRate: 115200 });
        
        dispositivoConectado = true;
        actualizarEstado('conectado', 'Conectado USB');
        
        window.enviarADispositivo = async (json) => {
            const writer = puerto.writable.getWriter();
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(json + '\n'));
            writer.releaseLock();
            alert('Pantallas guardadas en el dispositivo');
        };
        
    } catch (error) {
        console.error('Error USB:', error);
        actualizarEstado('desconectado', 'Error USB');
    }
});

function actualizarEstado(clase, texto) {
    const estado = document.getElementById('estado');
    estado.className = 'estado ' + clase;
    estado.textContent = texto;
}