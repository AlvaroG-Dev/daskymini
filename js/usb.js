// Doble tap en estado para conectar USB
let usbTapTimer;
document.getElementById('estado')?.addEventListener('dblclick', async () => {
    if (!('serial' in navigator)) {
        showToast('USB solo en Chrome/Edge');
        return;
    }
    
    try {
        const puerto = await navigator.serial.requestPort();
        await puerto.open({ baudRate: 115200 });
        
        state.conectado = true;
        document.getElementById('estado').classList.add('conectado');
        document.getElementById('estado').innerHTML = '<span class="estado-dot"></span> USB';
        
        window._enviarDispositivo = async (json) => {
            const writer = puerto.writable.getWriter();
            await writer.write(new TextEncoder().encode(json + '\n'));
            writer.releaseLock();
            showToast('Guardado en Dasky Mini ✓');
        };
        
        showToast('Conectado por USB ✓');
        
    } catch (error) {
        if (!error.message.includes('cancelled')) {
            showToast('Error de conexión USB');
        }
    }
});
