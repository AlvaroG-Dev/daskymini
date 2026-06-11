document.getElementById('estado')?.addEventListener('click', async () => {
    if (state.conectado) return;
    
    if (!('bluetooth' in navigator)) {
        showToast('Bluetooth no disponible en este navegador');
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
        document.getElementById('estado').classList.add('conectado');
        document.getElementById('estado').innerHTML = '<span class="estado-dot"></span> Bluetooth';
        
        window._enviarDispositivo = async (json) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(json);
            const CHUNK = 200;
            for (let i = 0; i < data.length; i += CHUNK) {
                await caracteristica.writeValue(data.slice(i, i + CHUNK));
            }
            showToast('Guardado en Dasky Mini ✓');
        };
        
        showToast('Conectado por Bluetooth ✓');
        
    } catch (error) {
        if (!error.message.includes('cancelled')) {
            showToast('Error de conexión');
        }
    }
});
