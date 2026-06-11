document.getElementById('btn-ble')?.addEventListener('click', async () => {
    if (!('bluetooth' in navigator)) {
        showToast('Bluetooth no soportado en este navegador');
        return;
    }
    
    try {
        const dispositivo = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['0000a000-0000-1000-8000-00805f9b34fb'] }],
            optionalServices: ['0000a001-0000-1000-8000-00805f9b34fb']
        });
        
        const servidor = await dispositivo.gatt.connect();
        const servicio = await servidor.getPrimaryService('0000a000-0000-1000-8000-00805f9b34fb');
        const caracteristica = await servicio.getCharacteristic('0000a001-0000-1000-8000-00805f9b34fb');
        
        state.conectado = true;
        state.modo = 'ble';
        document.getElementById('estado').className = 'estado conectado';
        document.getElementById('estado').textContent = '📶 Bluetooth';
        showToast('Conectado por Bluetooth');
        
        window._enviarBLE = async (json) => {
            const encoder = new TextEncoder();
            // Enviar en chunks si es muy grande
            const data = encoder.encode(json);
            const CHUNK_SIZE = 200;
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                await caracteristica.writeValue(data.slice(i, i + CHUNK_SIZE));
            }
            showToast('Guardado en Dasky Mini ✓');
        };
        
        // Leer configuración actual
        const valor = await caracteristica.readValue();
        if (valor && valor.byteLength > 0) {
            const json = new TextDecoder().decode(valor);
            try {
                const config = JSON.parse(json);
                state.pantallas = config.pantallas || [];
                renderTodo();
                showToast('Configuración cargada');
            } catch(e) {}
        }
        
    } catch (error) {
        console.error('Error BLE:', error);
        if (error.message.includes('User cancelled')) return;
        showToast('Error al conectar Bluetooth');
    }
});
