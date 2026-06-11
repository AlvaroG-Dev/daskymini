// Estado global
let pantallas = [];
let pantallaActiva = 0;
let widgetSeleccionado = null;
let dispositivoConectado = false;

// Pantalla demo por defecto
const pantallaDemo = {
    id: 'principal',
    nombre: 'Principal',
    widgets: [
        {
            tipo: 'texto',
            x: 40, y: 20,
            ancho: 160, alto: 50,
            formato: '{hora}:{minutos}',
            fuente: 'grande',
            color: '#ffffff'
        },
        {
            tipo: 'icono',
            x: 20, y: 100,
            ancho: 32, alto: 32,
            icono: 'sol',
            origen: 'sensor_temp'
        },
        {
            tipo: 'texto',
            x: 60, y: 100,
            ancho: 120, alto: 32,
            formato: '{temp}°C',
            fuente: 'normal',
            color: '#e94560'
        },
        {
            tipo: 'barra',
            x: 20, y: 180,
            ancho: 180, alto: 8,
            origen: 'bateria',
            color: '#4ade80'
        }
    ]
};

// Inicializar
function init() {
    pantallas = [pantallaDemo];
    renderListaPantallas();
    renderPantalla();
}

// Renderizar lista de pantallas
function renderListaPantallas() {
    const lista = document.getElementById('lista-pantallas');
    lista.innerHTML = pantallas.map((p, i) => `
        <div class="pantalla-item ${i === pantallaActiva ? 'activa' : ''}" 
             onclick="cambiarPantalla(${i})">
            ${p.nombre}
        </div>
    `).join('');
}

// Cambiar pantalla activa
function cambiarPantalla(i) {
    pantallaActiva = i;
    renderListaPantallas();
    renderPantalla();
}

// Renderizar pantalla en canvas
function renderPantalla() {
    const canvas = document.getElementById('canvas');
    const pantalla = pantallas[pantallaActiva];
    
    canvas.innerHTML = pantalla.widgets.map((w, i) => `
        <div class="widget-canvas ${widgetSeleccionado === i ? 'seleccionado' : ''}"
             style="left:${w.x}px; top:${w.y}px; width:${w.ancho}px; height:${w.alto}px;"
             onclick="seleccionarWidget(${i})"
             draggable="true">
            ${renderWidgetPreview(w)}
        </div>
    `).join('');
}

// Preview simple del widget
function renderWidgetPreview(w) {
    switch(w.tipo) {
        case 'texto':
            return `<span style="font-size:${w.fuente === 'grande' ? '18px' : '12px'}; color:${w.color}">
                ${w.formato.replace(/\{(\w+)\}/g, '$1')}
            </span>`;
        case 'icono':
            return `<span style="font-size:20px">☀️</span>`;
        case 'barra':
            return `<div style="width:100%; height:${w.alto}px; background:${w.color}; border-radius:4px;"></div>`;
        case 'grafico':
            return `<span style="font-size:16px">📈</span>`;
        default:
            return '';
    }
}

// Seleccionar widget para editar
function seleccionarWidget(i) {
    widgetSeleccionado = i;
    renderPantalla();
    mostrarPropiedades();
}

// Mostrar formulario de propiedades
function mostrarPropiedades() {
    const form = document.getElementById('form-propiedades');
    const w = pantallas[pantallaActiva].widgets[widgetSeleccionado];
    
    if (!w) {
        form.innerHTML = '';
        return;
    }
    
    form.innerHTML = `
        <div class="form-grupo">
            <label>Tipo</label>
            <select onchange="actualizarPropiedad('tipo', this.value)">
                <option value="texto" ${w.tipo === 'texto' ? 'selected' : ''}>Texto</option>
                <option value="icono" ${w.tipo === 'icono' ? 'selected' : ''}>Icono</option>
                <option value="grafico" ${w.tipo === 'grafico' ? 'selected' : ''}>Gráfico</option>
                <option value="barra" ${w.tipo === 'barra' ? 'selected' : ''}>Barra</option>
            </select>
        </div>
        <div class="form-grupo">
            <label>Formato</label>
            <input type="text" value="${w.formato || ''}" 
                   onchange="actualizarPropiedad('formato', this.value)">
        </div>
        <div class="form-grupo">
            <label>Color</label>
            <input type="color" value="${w.color || '#ffffff'}" 
                   onchange="actualizarPropiedad('color', this.value)">
        </div>
        <div class="form-grupo">
            <label>Fuente</label>
            <select onchange="actualizarPropiedad('fuente', this.value)">
                <option value="pequena" ${w.fuente === 'pequena' ? 'selected' : ''}>Pequeña</option>
                <option value="normal" ${w.fuente === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="grande" ${w.fuente === 'grande' ? 'selected' : ''}>Grande</option>
            </select>
        </div>
    `;
}

// Actualizar propiedad
function actualizarPropiedad(prop, valor) {
    pantallas[pantallaActiva].widgets[widgetSeleccionado][prop] = valor;
    renderPantalla();
}

// Nueva pantalla
document.getElementById('btn-nueva-pantalla')?.addEventListener('click', () => {
    pantallas.push({
        id: 'pantalla_' + Date.now(),
        nombre: 'Pantalla ' + (pantallas.length + 1),
        widgets: []
    });
    pantallaActiva = pantallas.length - 1;
    renderListaPantallas();
    renderPantalla();
});

// Guardar
document.getElementById('btn-guardar')?.addEventListener('click', () => {
    const json = JSON.stringify({ pantallas }, null, 2);
    if (dispositivoConectado) {
        enviarADispositivo(json);
    } else {
        // Descargar como archivo
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dasky_pantallas.json';
        a.click();
        alert('Archivo descargado. Conecta el dispositivo para transferir.');
    }
});

// Drag & drop simplificado
document.getElementById('canvas')?.addEventListener('dragover', e => e.preventDefault());
document.getElementById('canvas')?.addEventListener('drop', e => {
    e.preventDefault();
    const tipo = e.dataTransfer.getData('text/plain');
    if (tipo) {
        pantallas[pantallaActiva].widgets.push({
            tipo,
            x: 40, y: 40,
            ancho: 100, alto: 30,
            formato: '{hora}:{minutos}',
            fuente: 'normal',
            color: '#ffffff'
        });
        renderPantalla();
    }
});

document.querySelectorAll('.widget-item').forEach(item => {
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.closest('.widget-item').dataset.tipo);
    });
});

// Iniciar
init();