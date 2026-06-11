// ============ ESTADO GLOBAL ============
const state = {
    pantallas: [],
    pantallaActiva: 0,
    widgetSeleccionado: null,
    conectado: false,
    modo: null // 'ble' | 'usb'
};

// ============ DATOS DEMO ============
const pantallaDemo = {
    id: 'p1',
    nombre: 'Principal',
    widgets: [
        { id: 'w1', tipo: 'texto', x: 20, y: 20, w: 160, h: 56, formato: '{hora}:{minutos}', fuente: 'grande', color: '#ffffff', alineacion: 'centro' },
        { id: 'w2', tipo: 'icono', x: 28, y: 100, w: 36, h: 36, icono: 'sol', origen: 'temp' },
        { id: 'w3', tipo: 'texto', x: 72, y: 100, w: 110, h: 36, formato: '{temp}°C', fuente: 'normal', color: '#e94560', alineacion: 'izquierda' },
        { id: 'w4', tipo: 'barra', x: 20, y: 190, w: 170, h: 10, origen: 'bateria', color: '#4ade80' }
    ]
};

const variablesDisponibles = ['hora', 'minutos', 'segundos', 'dia', 'mes', 'anio', 'temp', 'humedad', 'bateria'];
const iconosDisponibles = ['sol', 'luna', 'nube', 'lluvia', 'nieve', 'viento', 'gota', 'termometro', 'bateria_icono'];

// ============ INICIALIZACIÓN ============
function init() {
    // Cargar desde localStorage
    const saved = localStorage.getItem('dasky_pantallas');
    if (saved) {
        try {
            state.pantallas = JSON.parse(saved);
        } catch(e) {
            state.pantallas = [pantallaDemo];
        }
    } else {
        state.pantallas = [pantallaDemo];
    }
    
    state.pantallaActiva = 0;
    renderTodo();
    setupEventListeners();
}

function renderTodo() {
    renderCarousel();
    renderCanvas();
    updateWidgetsCount();
}

// ============ CARRUSEL DE PANTALLAS ============
function renderCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.getElementById('carousel-dots');
    
    track.innerHTML = state.pantallas.map((p, i) => `
        <div class="pantalla-chip ${i === state.pantallaActiva ? 'activa' : ''}"
             data-index="${i}">
            ${p.nombre}
        </div>
    `).join('');
    
    dots.innerHTML = state.pantallas.map((_, i) => `
        <span class="dot ${i === state.pantallaActiva ? 'activa' : ''}" 
              data-index="${i}"></span>
    `).join('');
    
    // Scroll al chip activo
    const chipActivo = track.querySelector(`[data-index="${state.pantallaActiva}"]`);
    if (chipActivo) {
        chipActivo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    
    // Event listeners en chips
    track.querySelectorAll('.pantalla-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            state.pantallaActiva = parseInt(chip.dataset.index);
            state.widgetSeleccionado = null;
            renderTodo();
        });
        
        // Doble tap para renombrar
        chip.addEventListener('dblclick', () => {
            const nuevoNombre = prompt('Nombre de la pantalla:', state.pantallas[parseInt(chip.dataset.index)].nombre);
            if (nuevoNombre) {
                state.pantallas[parseInt(chip.dataset.index)].nombre = nuevoNombre;
                renderTodo();
                saveToLocalStorage();
            }
        });
        
        // Long press para renombrar en móvil
        let pressTimer;
        chip.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                const nuevoNombre = prompt('Nombre de la pantalla:', state.pantallas[parseInt(chip.dataset.index)].nombre);
                if (nuevoNombre) {
                    state.pantallas[parseInt(chip.dataset.index)].nombre = nuevoNombre;
                    renderTodo();
                    saveToLocalStorage();
                }
            }, 800);
        });
        chip.addEventListener('touchend', () => clearTimeout(pressTimer));
        chip.addEventListener('touchmove', () => clearTimeout(pressTimer));
    });
}

// ============ CANVAS ============
function renderCanvas() {
    const grid = document.getElementById('canvas-grid');
    const pantalla = state.pantallas[state.pantallaActiva];
    
    if (!pantalla) return;
    
    grid.innerHTML = pantalla.widgets.map((w, i) => `
        <div class="widget-elemento ${state.widgetSeleccionado === i ? 'seleccionado' : ''}"
             data-index="${i}"
             style="left:${w.x}px; top:${w.y}px; width:${w.w}px; height:${w.h}px; z-index:${i};">
            ${renderWidgetContent(w)}
            <div class="widget-resize" data-index="${i}"></div>
        </div>
    `).join('');
    
    setupWidgetInteractions();
}

function renderWidgetContent(w) {
    switch(w.tipo) {
        case 'texto':
            const fontSize = w.fuente === 'grande' ? '18px' : w.fuente === 'normal' ? '14px' : '11px';
            const textAlign = w.alineacion || 'centro';
            return `<span style="font-size:${fontSize}; color:${w.color}; display:block; width:100%; text-align:${textAlign}; line-height:1.2;">
                ${(w.formato || '').replace(/\{(\w+)\}/g, '<span style="color:#e94560">$1</span>')}
            </span>`;
        case 'icono':
            return `<span style="font-size:${Math.min(w.w, w.h) * 0.7}px; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                ${getIconEmoji(w.icono || 'sol')}
            </span>`;
        case 'grafico':
            return `<svg width="${w.w}" height="${w.h}" viewBox="0 0 ${w.w} ${w.h}">
                <polyline points="5,${w.h-5} 30,${w.h*0.6} 55,${w.h*0.3} 80,${w.h*0.5} 105,${w.h*0.1} 130,${w.h*0.4} 155,${w.h*0.2}" 
                    stroke="${w.color || '#4ade80'}" fill="none" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        case 'barra':
            return `<div style="width:100%; height:100%; background:${w.color || '#4ade80'}; border-radius:${w.h/2}px; opacity:0.8;"></div>`;
        default:
            return '';
    }
}

function getIconEmoji(nombre) {
    const map = {
        'sol': '☀️', 'luna': '🌙', 'nube': '☁️', 'lluvia': '🌧️',
        'nieve': '❄️', 'viento': '💨', 'gota': '💧', 'termometro': '🌡️',
        'bateria_icono': '🔋'
    };
    return map[nombre] || '☀️';
}

// ============ INTERACCIONES WIDGETS ============
function setupWidgetInteractions() {
    const widgets = document.querySelectorAll('.widget-elemento');
    const grid = document.getElementById('canvas-grid');
    
    widgets.forEach(widget => {
        const index = parseInt(widget.dataset.index);
        const w = state.pantallas[state.pantallaActiva].widgets[index];
        
        // Tap para seleccionar
        widget.addEventListener('pointerdown', (e) => {
            if (e.target.classList.contains('widget-resize')) return;
            e.stopPropagation();
            state.widgetSeleccionado = index;
            renderCanvas();
            // Doble tap para abrir editor
            if (e.detail === 2 || (e.pointerType === 'touch' && e.isPrimary)) {
                setTimeout(() => {
                    if (state.widgetSeleccionado === index) {
                        abrirEditorWidget(index);
                    }
                }, 300);
            }
        });
        
        // Drag para mover
        let dragging = false;
        let startX, startY, origX, origY;
        
        widget.addEventListener('pointerdown', (e) => {
            if (e.target.classList.contains('widget-resize')) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = w.x;
            origY = w.y;
            widget.setPointerCapture(e.pointerId);
        });
        
        widget.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = (e.clientX - startX) / (grid.clientWidth / 200);
            const dy = (e.clientY - startY) / (grid.clientHeight / 267);
            w.x = Math.max(0, Math.min(200 - w.w, origX + dx));
            w.y = Math.max(0, Math.min(267 - w.h, origY + dy));
            widget.style.left = w.x + 'px';
            widget.style.top = w.y + 'px';
        });
        
        widget.addEventListener('pointerup', () => {
            if (dragging) {
                dragging = false;
                saveToLocalStorage();
            }
        });
        
        // Resize
        const resizeHandle = widget.querySelector('.widget-resize');
        if (resizeHandle) {
            resizeHandle.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                const startRX = e.clientX;
                const startRY = e.clientY;
                const origW = w.w;
                const origH = w.h;
                
                function onMove(ev) {
                    w.w = Math.max(20, origW + (ev.clientX - startRX) / (grid.clientWidth / 200));
                    w.h = Math.max(20, origH + (ev.clientY - startRY) / (grid.clientHeight / 267));
                    widget.style.width = w.w + 'px';
                    widget.style.height = w.h + 'px';
                }
                
                function onUp() {
                    document.removeEventListener('pointermove', onMove);
                    document.removeEventListener('pointerup', onUp);
                    saveToLocalStorage();
                    renderCanvas();
                }
                
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp);
            });
        }
    });
    
    // Tap en canvas vacío = deseleccionar
    grid.addEventListener('pointerdown', (e) => {
        if (e.target === grid) {
            state.widgetSeleccionado = null;
            renderCanvas();
        }
    });
}

// ============ MODAL EDITOR ============
function abrirEditorWidget(index) {
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    
    document.getElementById('modal-titulo').textContent = 
        w.tipo === 'texto' ? 'Editar Texto' :
        w.tipo === 'icono' ? 'Editar Icono' :
        w.tipo === 'grafico' ? 'Editar Gráfico' : 'Editar Barra';
    
    body.innerHTML = `
        <div class="form-grupo">
            <label>Tipo de widget</label>
            <select id="edit-tipo" onchange="cambiarTipoWidget(${index}, this.value)">
                <option value="texto" ${w.tipo === 'texto' ? 'selected' : ''}>Texto</option>
                <option value="icono" ${w.tipo === 'icono' ? 'selected' : ''}>Icono</option>
                <option value="grafico" ${w.tipo === 'grafico' ? 'selected' : ''}>Gráfico</option>
                <option value="barra" ${w.tipo === 'barra' ? 'selected' : ''}>Barra</option>
            </select>
        </div>
        
        ${w.tipo === 'texto' ? `
            <div class="form-grupo">
                <label>Formato</label>
                <input type="text" id="edit-formato" value="${w.formato || ''}" 
                       placeholder="Ej: {hora}:{minutos} - {temp}°C">
                <div class="variables-chips" style="margin-top:10px;">
                    ${variablesDisponibles.map(v => 
                        `<span class="var-chip" onclick="insertarVariable('edit-formato', '${v}')">{${v}}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="form-grupo">
                <label>Tamaño de fuente</label>
                <select id="edit-fuente">
                    <option value="pequena" ${w.fuente === 'pequena' ? 'selected' : ''}>Pequeña</option>
                    <option value="normal" ${w.fuente === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="grande" ${w.fuente === 'grande' ? 'selected' : ''}>Grande</option>
                </select>
            </div>
            <div class="form-grupo">
                <label>Alineación</label>
                <select id="edit-alineacion">
                    <option value="izquierda" ${w.alineacion === 'izquierda' ? 'selected' : ''}>Izquierda</option>
                    <option value="centro" ${w.alineacion === 'centro' ? 'selected' : ''}>Centro</option>
                    <option value="derecha" ${w.alineacion === 'derecha' ? 'selected' : ''}>Derecha</option>
                </select>
            </div>
        ` : w.tipo === 'icono' ? `
            <div class="form-grupo">
                <label>Icono</label>
                <div class="variables-chips">
                    ${iconosDisponibles.map(ic => 
                        `<span class="var-chip ${w.icono === ic ? 'selected' : ''}" 
                               onclick="seleccionarIcono('${ic}')" style="font-size:20px;">
                            ${getIconEmoji(ic)}
                        </span>`
                    ).join('')}
                </div>
                <input type="hidden" id="edit-icono" value="${w.icono || 'sol'}">
            </div>
            <div class="form-grupo">
                <label>Cambia según</label>
                <select id="edit-origen-icono">
                    <option value="temp" ${w.origen === 'temp' ? 'selected' : ''}>Temperatura</option>
                    <option value="humedad" ${w.origen === 'humedad' ? 'selected' : ''}>Humedad</option>
                    <option value="hora" ${w.origen === 'hora' ? 'selected' : ''}>Hora del día</option>
                </select>
            </div>
        ` : w.tipo === 'barra' ? `
            <div class="form-grupo">
                <label>Origen del dato</label>
                <select id="edit-origen-barra">
                    <option value="bateria" ${w.origen === 'bateria' ? 'selected' : ''}>Batería</option>
                    <option value="humedad" ${w.origen === 'humedad' ? 'selected' : ''}>Humedad</option>
                    <option value="temp" ${w.origen === 'temp' ? 'selected' : ''}>Temperatura</option>
                </select>
            </div>
        ` : `
            <div class="form-grupo">
                <label>Color de línea</label>
                <input type="color" id="edit-color-grafico" value="${w.color || '#4ade80'}">
            </div>
        `}
        
        <div class="form-grupo">
            <label>Color</label>
            <input type="color" id="edit-color" value="${w.color || '#ffffff'}">
        </div>
    `;
    
    document.getElementById('btn-eliminar').onclick = () => {
        state.pantallas[state.pantallaActiva].widgets.splice(index, 1);
        state.widgetSeleccionado = null;
        cerrarModal();
        renderTodo();
        saveToLocalStorage();
        showToast('Widget eliminado');
    };
    
    document.getElementById('btn-ok').onclick = () => {
        guardarCambiosWidget(index);
        cerrarModal();
        renderTodo();
        saveToLocalStorage();
    };
    
    overlay.classList.add('visible');
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('visible');
}

function insertarVariable(inputId, variable) {
    const input = document.getElementById(inputId);
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + `{${variable}}` + text.substring(end);
    input.focus();
    input.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
}

function seleccionarIcono(nombre) {
    document.getElementById('edit-icono').value = nombre;
    document.querySelectorAll('#modal-body .var-chip').forEach(chip => chip.style.borderColor = 'var(--border)');
    event.target.style.borderColor = 'var(--accent)';
}

function cambiarTipoWidget(index, nuevoTipo) {
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    w.tipo = nuevoTipo;
    if (nuevoTipo === 'texto') { w.formato = '{hora}:{minutos}'; w.fuente = 'normal'; }
    if (nuevoTipo === 'icono') { w.icono = 'sol'; }
    if (nuevoTipo === 'barra') { w.origen = 'bateria'; }
    if (nuevoTipo === 'grafico') { w.color = '#4ade80'; }
    abrirEditorWidget(index);
}

function guardarCambiosWidget(index) {
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    const tipo = document.getElementById('edit-tipo')?.value || w.tipo;
    
    w.tipo = tipo;
    w.color = document.getElementById('edit-color')?.value || w.color;
    
    if (tipo === 'texto') {
        w.formato = document.getElementById('edit-formato')?.value || w.formato;
        w.fuente = document.getElementById('edit-fuente')?.value || w.fuente;
        w.alineacion = document.getElementById('edit-alineacion')?.value || w.alineacion;
    }
    if (tipo === 'icono') {
        w.icono = document.getElementById('edit-icono')?.value || w.icono;
        w.origen = document.getElementById('edit-origen-icono')?.value || w.origen;
    }
    if (tipo === 'barra') {
        w.origen = document.getElementById('edit-origen-barra')?.value || w.origen;
    }
    if (tipo === 'grafico') {
        w.color = document.getElementById('edit-color-grafico')?.value || w.color;
    }
}

// ============ TOOLBAR ============
function setupEventListeners() {
    // Botones de herramientas
    document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'guardar') {
                guardarConfiguracion();
            } else if (action.startsWith('add-')) {
                const tipo = action.replace('add-', '');
                agregarWidget(tipo);
            }
        });
    });
    
    // Añadir pantalla
    document.getElementById('btn-add-pantalla').addEventListener('click', () => {
        const nueva = {
            id: 'p' + Date.now(),
            nombre: 'Pantalla ' + (state.pantallas.length + 1),
            widgets: []
        };
        state.pantallas.push(nueva);
        state.pantallaActiva = state.pantallas.length - 1;
        state.widgetSeleccionado = null;
        renderTodo();
        saveToLocalStorage();
        showToast('Nueva pantalla creada');
    });
    
    // Cerrar modal
    document.getElementById('modal-close').addEventListener('click', cerrarModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    
    // Gestos en carousel
    const track = document.getElementById('carousel-track');
    track.addEventListener('scroll', () => {
        const chips = track.querySelectorAll('.pantalla-chip');
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        chips.forEach((chip, i) => {
            const chipCenter = chip.offsetLeft + chip.clientWidth / 2;
            const dist = Math.abs(chipCenter - trackCenter);
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });
        if (closest !== state.pantallaActiva) {
            state.pantallaActiva = closest;
            state.widgetSeleccionado = null;
            renderCarousel();
            renderCanvas();
            updateWidgetsCount();
        }
    });
}

function agregarWidget(tipo) {
    const pantalla = state.pantallas[state.pantallaActiva];
    const nuevo = {
        id: 'w' + Date.now(),
        tipo,
        x: 40, y: 40,
        w: tipo === 'barra' ? 160 : tipo === 'icono' ? 36 : 120,
        h: tipo === 'barra' ? 8 : tipo === 'icono' ? 36 : 36,
        color: '#ffffff',
        formato: '{hora}:{minutos}',
        fuente: 'normal',
        alineacion: 'centro'
    };
    pantalla.widgets.push(nuevo);
    state.widgetSeleccionado = pantalla.widgets.length - 1;
    renderTodo();
    saveToLocalStorage();
    showToast('Widget añadido');
    
    // Abrir editor automáticamente
    setTimeout(() => abrirEditorWidget(state.widgetSeleccionado), 400);
}

// ============ GUARDAR ============
function guardarConfiguracion() {
    const json = JSON.stringify({ pantallas: state.pantallas }, null, 2);
    
    if (state.conectado && state.modo === 'ble') {
        window._enviarBLE?.(json);
    } else if (state.conectado && state.modo === 'usb') {
        window._enviarUSB?.(json);
    } else {
        // Descargar archivo
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dasky_pantallas.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Archivo descargado');
    }
}

function saveToLocalStorage() {
    localStorage.setItem('dasky_pantallas', JSON.stringify(state.pantallas));
}

// ============ UTILIDADES ============
function updateWidgetsCount() {
    const count = state.pantallas[state.pantallaActiva]?.widgets?.length || 0;
    document.getElementById('widgets-count').textContent = count + ' widget' + (count !== 1 ? 's' : '');
}

function showToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 2000);
}

window.mostrarToast = showToast;

// ============ ARRANCAR ============
document.addEventListener('DOMContentLoaded', init);
