// ============ ESTADO GLOBAL ============
const state = {
    pantallas: [],
    pantallaActiva: 0,
    widgetSeleccionado: null,
    conectado: false,
    modo: null
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
    const saved = localStorage.getItem('dasky_pantallas');
    if (saved) {
        try {
            state.pantallas = JSON.parse(saved);
        } catch(e) {
            state.pantallas = [JSON.parse(JSON.stringify(pantallaDemo))];
        }
    } else {
        state.pantallas = [JSON.parse(JSON.stringify(pantallaDemo))];
    }
    
    if (state.pantallas.length === 0) {
        state.pantallas = [JSON.parse(JSON.stringify(pantallaDemo))];
    }
    
    state.pantallaActiva = 0;
    renderTodo();
    setupEventListeners();
    setupModalListeners();
}

function renderTodo() {
    renderCarousel();
    renderCanvas();
    updateWidgetsCount();
}

// ============ CARRUSEL ============
function renderCarousel() {
    const track = document.getElementById('carousel-track');
    
    track.innerHTML = state.pantallas.map((p, i) => `
        <div class="pantalla-chip ${i === state.pantallaActiva ? 'activa' : ''}"
             data-index="${i}">
            <span class="chip-nombre">${p.nombre}</span>
            ${i === state.pantallaActiva ? '<span class="chip-badge">activa</span>' : ''}
        </div>
    `).join('');
    
    // Event listeners
    track.querySelectorAll('.pantalla-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            state.pantallaActiva = parseInt(chip.dataset.index);
            state.widgetSeleccionado = null;
            renderTodo();
        });
        
        // Long press para renombrar
        let longPress;
        chip.addEventListener('pointerdown', () => {
            longPress = setTimeout(() => {
                const i = parseInt(chip.dataset.index);
                const nuevo = prompt('Nombre:', state.pantallas[i].nombre);
                if (nuevo && nuevo.trim()) {
                    state.pantallas[i].nombre = nuevo.trim();
                    renderTodo();
                    saveLocal();
                }
            }, 800);
        });
        chip.addEventListener('pointerup', () => clearTimeout(longPress));
        chip.addEventListener('pointerleave', () => clearTimeout(longPress));
    });
    
    // Scroll al activo
    const activo = track.querySelector('.pantalla-chip.activa');
    if (activo) {
        activo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// ============ CANVAS ============
function renderCanvas() {
    const grid = document.getElementById('canvas-grid');
    const pantalla = state.pantallas[state.pantallaActiva];
    
    if (!pantalla) return;
    
    grid.innerHTML = pantalla.widgets.map((w, i) => `
        <div class="widget-elemento ${state.widgetSeleccionado === i ? 'seleccionado' : ''}"
             data-index="${i}"
             style="left:${w.x}px; top:${w.y}px; width:${w.w}px; height:${w.h}px; z-index:${state.widgetSeleccionado === i ? 100 : i};">
            <div class="widget-contenido">
                ${renderWidgetContent(w)}
            </div>
            <div class="widget-borde"></div>
            ${state.widgetSeleccionado === i ? '<div class="widget-resize"></div><button class="widget-edit-btn">✎</button>' : ''}
        </div>
    `).join('');
    
    setupWidgetInteractions();
}

function renderWidgetContent(w) {
    switch(w.tipo) {
        case 'texto':
            const fontSize = w.fuente === 'grande' ? '18px' : w.fuente === 'normal' ? '13px' : '10px';
            const textAlign = w.alineacion || 'centro';
            const textoFormateado = (w.formato || '')
                .replace(/\{hora\}/g, '14')
                .replace(/\{minutos\}/g, '32')
                .replace(/\{segundos\}/g, '45')
                .replace(/\{temp\}/g, '23')
                .replace(/\{humedad\}/g, '54')
                .replace(/\{bateria\}/g, '85')
                .replace(/\{(\w+)\}/g, '--');
            return `<span style="font-size:${fontSize}; color:${w.color}; display:block; width:100%; text-align:${textAlign}; line-height:1.2; word-break:break-word;">${textoFormateado}</span>`;
        case 'icono':
            return `<span style="font-size:${Math.min(w.w, w.h) * 0.65}px; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">${getIconEmoji(w.icono || 'sol')}</span>`;
        case 'grafico':
            return `<svg width="${w.w}" height="${w.h}" viewBox="0 0 ${w.w} ${w.h}" style="display:block;">
                <rect width="100%" height="100%" fill="transparent"/>
                <polyline points="${5},${w.h*0.8} ${w.w*0.2},${w.h*0.5} ${w.w*0.4},${w.h*0.3} ${w.w*0.6},${w.h*0.6} ${w.w*0.8},${w.h*0.15} ${w.w-5},${w.h*0.4}" 
                    stroke="${w.color || '#4ade80'}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        case 'barra':
            return `<div style="width:100%; height:100%; background:${w.color || '#4ade80'}; border-radius:${Math.min(w.h/2, 6)}px; opacity:0.85;"></div>`;
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
        
        let isDragging = false;
        let hasMoved = false;
        let startX, startY, origX, origY;
        let pointerDownTime = 0;
        
        // Pointer down: preparar para drag O selección
        widget.addEventListener('pointerdown', (e) => {
            // No iniciar si es el botón de editar o el resize
            if (e.target.closest('.widget-edit-btn') || e.target.closest('.widget-resize')) {
                return;
            }
            
            e.preventDefault();
            pointerDownTime = Date.now();
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            origX = w.x;
            origY = w.y;
            
            // Seleccionar al hacer tap
            state.widgetSeleccionado = index;
            renderCanvas();
            
            widget.setPointerCapture(e.pointerId);
        });
        
        widget.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Umbral de movimiento: si se mueve más de 3px, es drag
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                const scaleX = 200 / grid.clientWidth;
                const scaleY = 267 / grid.clientHeight;
                
                w.x = Math.round(Math.max(0, Math.min(200 - w.w, origX + dx * scaleX)));
                w.y = Math.round(Math.max(0, Math.min(267 - w.h, origY + dy * scaleY)));
                
                widget.style.left = w.x + 'px';
                widget.style.top = w.y + 'px';
            }
        });
        
        widget.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            // Si fue un tap (no drag) y no han pasado más de 300ms
            const elapsed = Date.now() - pointerDownTime;
            if (!hasMoved && elapsed < 300) {
                // Es un tap: seleccionar el widget
                state.widgetSeleccionado = index;
                renderCanvas();
            } else if (hasMoved) {
                // Fue drag: guardar posición
                saveLocal();
            }
        });
        
        // Botón de editar (solo visible en widget seleccionado)
        const editBtn = widget.querySelector('.widget-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                e.preventDefault();
            });
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                abrirEditorWidget(index);
            });
        }
        
        // Resize handle
        const resizeHandle = widget.querySelector('.widget-resize');
        if (resizeHandle) {
            resizeHandle.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const startRX = e.clientX;
                const startRY = e.clientY;
                const origW = w.w;
                const origH = w.h;
                
                function onMove(ev) {
                    ev.preventDefault();
                    const scaleX = 200 / grid.clientWidth;
                    const scaleY = 267 / grid.clientHeight;
                    w.w = Math.round(Math.max(24, origW + (ev.clientX - startRX) * scaleX));
                    w.h = Math.round(Math.max(24, origH + (ev.clientY - startRY) * scaleY));
                    widget.style.width = w.w + 'px';
                    widget.style.height = w.h + 'px';
                }
                
                function onUp() {
                    document.removeEventListener('pointermove', onMove);
                    document.removeEventListener('pointerup', onUp);
                    saveLocal();
                    renderCanvas();
                }
                
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp);
            });
        }
    });
    
    // Click en canvas vacío = deseleccionar
    grid.addEventListener('pointerdown', (e) => {
        if (e.target === grid || e.target.classList.contains('canvas-grid')) {
            state.widgetSeleccionado = null;
            renderCanvas();
        }
    });
}

// ============ MODAL EDITOR ============
function setupModalListeners() {
    document.getElementById('modal-close').addEventListener('click', cerrarModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    
    document.getElementById('btn-eliminar').addEventListener('click', () => {
        const index = document.getElementById('btn-eliminar')._widgetIndex;
        if (index !== undefined) {
            state.pantallas[state.pantallaActiva].widgets.splice(index, 1);
            state.widgetSeleccionado = null;
            cerrarModal();
            renderTodo();
            saveLocal();
            showToast('Widget eliminado');
        }
    });
    
    document.getElementById('btn-ok').addEventListener('click', () => {
        const index = document.getElementById('btn-ok')._widgetIndex;
        if (index !== undefined) {
            guardarCambiosWidget(index);
        }
        cerrarModal();
        renderTodo();
        saveLocal();
    });
}

function abrirEditorWidget(index) {
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    
    // Guardar referencia del índice
    document.getElementById('btn-eliminar')._widgetIndex = index;
    document.getElementById('btn-ok')._widgetIndex = index;
    
    const tituloMap = { texto: 'Editar Texto', icono: 'Editar Icono', grafico: 'Editar Gráfico', barra: 'Editar Barra' };
    document.getElementById('modal-titulo').textContent = tituloMap[w.tipo] || 'Editar Widget';
    
    body.innerHTML = generarFormulario(w, index);
    
    overlay.classList.add('visible');
    
    // Scroll al inicio del modal
    body.scrollTop = 0;
}

function generarFormulario(w, index) {
    let html = `
        <div class="form-grupo">
            <label>Tipo de widget</label>
            <select id="edit-tipo" onchange="cambiarTipoWidget(${index})">
                <option value="texto" ${w.tipo === 'texto' ? 'selected' : ''}>📝 Texto</option>
                <option value="icono" ${w.tipo === 'icono' ? 'selected' : ''}>🎨 Icono</option>
                <option value="grafico" ${w.tipo === 'grafico' ? 'selected' : ''}>📈 Gráfico</option>
                <option value="barra" ${w.tipo === 'barra' ? 'selected' : ''}>📊 Barra</option>
            </select>
        </div>
    `;
    
    if (w.tipo === 'texto') {
        html += `
            <div class="form-grupo">
                <label>Texto (usa {variables})</label>
                <input type="text" id="edit-formato" value="${w.formato || ''}" 
                       placeholder="{hora}:{minutos}">
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
                    ${variablesDisponibles.map(v => 
                        `<button type="button" class="var-chip" onclick="insertarVariable('${v}')">{${v}}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="form-grupo">
                <label>Tamaño</label>
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
        `;
    } else if (w.tipo === 'icono') {
        html += `
            <div class="form-grupo">
                <label>Selecciona un icono</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                    ${iconosDisponibles.map(ic => 
                        `<button type="button" class="icono-chip ${w.icono === ic ? 'selected' : ''}" 
                                 onclick="seleccionarIcono('${ic}')" style="font-size:24px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:2px solid ${w.icono === ic ? 'var(--accent)' : 'var(--border)'};background:var(--bg);cursor:pointer;">
                            ${getIconEmoji(ic)}
                        </button>`
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
        `;
    } else if (w.tipo === 'barra') {
        html += `
            <div class="form-grupo">
                <label>Origen del dato</label>
                <select id="edit-origen-barra">
                    <option value="bateria" ${w.origen === 'bateria' ? 'selected' : ''}>🔋 Batería</option>
                    <option value="humedad" ${w.origen === 'humedad' ? 'selected' : ''}>💧 Humedad</option>
                    <option value="temp" ${w.origen === 'temp' ? 'selected' : ''}>🌡️ Temperatura</option>
                </select>
            </div>
        `;
    } else if (w.tipo === 'grafico') {
        html += `
            <div class="form-grupo">
                <label>Color de línea</label>
                <input type="color" id="edit-color-grafico" value="${w.color || '#4ade80'}">
            </div>
        `;
    }
    
    html += `
        <div class="form-grupo">
            <label>Color</label>
            <input type="color" id="edit-color" value="${w.color || '#ffffff'}">
        </div>
    `;
    
    return html;
}

function insertarVariable(variable) {
    const input = document.getElementById('edit-formato');
    if (!input) return;
    const start = input.selectionStart || input.value.length;
    const end = input.selectionEnd || input.value.length;
    const text = input.value;
    input.value = text.substring(0, start) + `{${variable}}` + text.substring(end);
    input.focus();
    const newPos = start + variable.length + 2;
    input.setSelectionRange(newPos, newPos);
}

function seleccionarIcono(nombre) {
    document.getElementById('edit-icono').value = nombre;
    // Actualizar visual
    document.querySelectorAll('.icono-chip').forEach(chip => {
        chip.style.borderColor = 'var(--border)';
    });
    const seleccionado = document.querySelector(`.icono-chip[onclick*="${nombre}"]`);
    if (seleccionado) {
        seleccionado.style.borderColor = 'var(--accent)';
    }
}

function cambiarTipoWidget(index) {
    const nuevoTipo = document.getElementById('edit-tipo').value;
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    w.tipo = nuevoTipo;
    
    // Valores por defecto según tipo
    if (nuevoTipo === 'texto' && !w.formato) w.formato = '{hora}:{minutos}';
    if (nuevoTipo === 'icono' && !w.icono) w.icono = 'sol';
    if (nuevoTipo === 'barra' && !w.origen) w.origen = 'bateria';
    if (nuevoTipo === 'grafico' && !w.color) w.color = '#4ade80';
    
    // Re-abrir el modal con el nuevo tipo
    abrirEditorWidget(index);
}

function guardarCambiosWidget(index) {
    const w = state.pantallas[state.pantallaActiva].widgets[index];
    
    w.tipo = document.getElementById('edit-tipo')?.value || w.tipo;
    w.color = document.getElementById('edit-color')?.value || w.color;
    
    if (w.tipo === 'texto') {
        w.formato = document.getElementById('edit-formato')?.value || '';
        w.fuente = document.getElementById('edit-fuente')?.value || 'normal';
        w.alineacion = document.getElementById('edit-alineacion')?.value || 'centro';
    }
    if (w.tipo === 'icono') {
        w.icono = document.getElementById('edit-icono')?.value || 'sol';
        w.origen = document.getElementById('edit-origen-icono')?.value || 'temp';
    }
    if (w.tipo === 'barra') {
        w.origen = document.getElementById('edit-origen-barra')?.value || 'bateria';
    }
    if (w.tipo === 'grafico') {
        w.color = document.getElementById('edit-color-grafico')?.value || '#4ade80';
    }
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('visible');
    // Limpiar referencias
    document.getElementById('btn-eliminar')._widgetIndex = undefined;
    document.getElementById('btn-ok')._widgetIndex = undefined;
}

// ============ TOOLBAR ============
function setupEventListeners() {
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
        saveLocal();
        showToast('Nueva pantalla');
    });
}

function agregarWidget(tipo) {
    const pantalla = state.pantallas[state.pantallaActiva];
    const defaults = {
        texto: { w: 140, h: 40, formato: '{hora}:{minutos}', fuente: 'normal', color: '#ffffff', alineacion: 'centro' },
        icono: { w: 40, h: 40, icono: 'sol', origen: 'temp', color: '#ffffff' },
        grafico: { w: 180, h: 60, color: '#4ade80' },
        barra: { w: 160, h: 8, origen: 'bateria', color: '#4ade80' }
    };
    
    const nuevo = {
        id: 'w' + Date.now(),
        tipo,
        x: Math.floor(Math.random() * 60 + 20),
        y: Math.floor(Math.random() * 80 + 40),
        ...defaults[tipo]
    };
    
    pantalla.widgets.push(nuevo);
    state.widgetSeleccionado = pantalla.widgets.length - 1;
    renderTodo();
    saveLocal();
    showToast('Widget añadido');
    
    // Abrir editor
    setTimeout(() => abrirEditorWidget(state.widgetSeleccionado), 500);
}

// ============ GUARDAR ============
function guardarConfiguracion() {
    const json = JSON.stringify({ pantallas: state.pantallas }, null, 2);
    
    if (state.conectado && window._enviarDispositivo) {
        window._enviarDispositivo(json);
    } else {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dasky_pantallas.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Archivo descargado ✓');
    }
}

function saveLocal() {
    try {
        localStorage.setItem('dasky_pantallas', JSON.stringify(state.pantallas));
    } catch(e) {}
}

// ============ UTILIDADES ============
function updateWidgetsCount() {
    const count = state.pantallas[state.pantallaActiva]?.widgets?.length || 0;
    const el = document.getElementById('widgets-count');
    if (el) el.textContent = count + ' widget' + (count !== 1 ? 's' : '');
}

function showToast(mensaje) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 2000);
}

// ============ ARRANCAR ============
document.addEventListener('DOMContentLoaded', init);
