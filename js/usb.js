document.getElementById('btn-usb')?.addEventListener('click', async () => {
    if (!('serial' in navigator)) {
        showToast('USB no soportado. Usa Chrome o Edge.');
        return;
    }
    
    try {
        const puerto = await navigator.serial.requestPort();
        await puerto.open({ baudRate: 115200 });
        
        state.conectado = true;
        state.modo = 'usb';
        document.getElementById('estado').className = 'estado conectado';
        document.getElementById('estado').textContent = '🔌 USB';
        showToast('Conectado por USB');
        
        window._enviarUSB = async (json) => {
            const writer = puerto.writable.getWriter();
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(json + '\n'));
            writer.releaseLock();
            showToast('Guardado en Dasky Mini ✓');
        };
        
        // Leer configuración actual
        const reader = puerto.readable.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        setTimeout(async () => {
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value);
                    if (buffer.includes('\n')) {
                        const json = buffer.split('\n')[0];
                        try {
                            const config = JSON.parse(json);
                            state.pantallas = config.pantallas || [];
                            renderTodo();
                            showToast('Configuración cargada');
                        } catch(e) {}
                        break;
                    }
                }
            } catch(e) {}
            reader.releaseLock();
        }, 500);
        
    } catch (error) {
        console.error('Error USB:', error);
        if (error.message.includes('cancelled')) return;
        showToast('Error al conectar USB');
    }
});
