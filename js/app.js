// ============ GALERÍA DE PANTALLAS PREDEFINIDAS ============
const galeria = [
    {
        id: 'reloj_grande',
        nombre: 'Reloj grande',
        desc: 'Hora en grande con fecha debajo',
        widgets: [
            { tipo:'texto', x:10, y:20, w:220, h:70, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'centro' },
            { tipo:'texto', x:10, y:95, w:220, h:30, formato:'{dia} {mes}', fuente:'normal', color:'#8899aa', alineacion:'centro' },
            { tipo:'barra', x:20, y:230, w:200, h:6, origen:'bateria', color:'#4ade80' }
        ]
    },
    {
        id: 'clima_completo',
        nombre: 'Clima completo',
        desc: 'Temperatura, humedad e icono del tiempo',
        widgets: [
            { tipo:'texto', x:20, y:10, w:200, h:30, formato:'{hora}:{minutos}', fuente:'normal', color:'#ffffff', alineacion:'izquierda' },
            { tipo:'icono', x:30, y:60, w:50, h:50, icono:'sol', origen:'temp' },
            { tipo:'texto', x:90, y:55, w:120, h:60, formato:'{temp}°C', fuente:'grande', color:'#e94560', alineacion:'izquierda' },
            { tipo:'texto', x:30, y:130, w:200, h:24, formato:'Humedad: {humedad}%', fuente:'pequena', color:'#60a5fa', alineacion:'izquierda' },
            { tipo:'grafico', x:20, y:170, w:200, h:50, color:'#4ade80' }
        ]
    },
    {
        id: 'minimal',
        nombre: 'Minimalista',
        desc: 'Solo lo esencial: hora y temperatura',
        widgets: [
            { tipo:'texto', x:10, y:40, w:220, h:80, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'centro' },
            { tipo:'texto', x:10, y:140, w:220, h:40, formato:'{temp}°C', fuente:'normal', color:'#8899aa', alineacion:'centro' }
        ]
    },
    {
        id: 'estadisticas',
        nombre: 'Estadísticas',
        desc: 'Gráficos de temperatura y humedad 24h',
        widgets: [
            { tipo:'texto', x:20, y:10, w:200, h:24, formato:'{hora}:{minutos}', fuente:'pequena', color:'#ffffff', alineacion:'derecha' },
            { tipo:'texto', x:20, y:40, w:200, h:20, formato:'Temperatura 24h', fuente:'pequena', color:'#e94560', alineacion:'izquierda' },
            { tipo:'grafico', x:10, y:65, w:220, h:60, color:'#e94560' },
            { tipo:'texto', x:20, y:135, w:200, h:20, formato:'Humedad 24h', fuente:'pequena', color:'#60a5fa', alineacion:'izquierda' },
            { tipo:'grafico', x:10, y:160, w:220, h:60, color:'#60a5fa' }
        ]
    },
    {
        id: 'productividad',
        nombre: 'Productividad',
        desc: 'Hora, fecha completa y batería',
        widgets: [
            { tipo:'texto', x:10, y:15, w:220, h:70, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'centro' },
            { tipo:'texto', x:10, y:90, w:220, h:30, formato:'{dia} de {mes}', fuente:'normal', color:'#8899aa', alineacion:'centro' },
            { tipo:'texto', x:10, y:120, w:220, h:24, formato:'{segundos}', fuente:'pequena', color:'#555', alineacion:'centro' },
            { tipo:'barra', x:40, y:200, w:160, h:8, origen:'bateria', color:'#4ade80' },
            { tipo:'texto', x:10, y:215, w:220, h:24, formato:'Batería {bateria}%', fuente:'pequena', color:'#4ade80', alineacion:'centro' }
        ]
    },
    {
        id: 'doble_info',
        nombre: 'Doble info',
        desc: 'Temperatura y humedad grandes',
        widgets: [
            { tipo:'icono', x:30, y:25, w:40, h:40, icono:'termometro', origen:'temp' },
            { tipo:'texto', x:80, y:20, w:130, h:50, formato:'{temp}°C', fuente:'grande', color:'#e94560', alineacion:'izquierda' },
            { tipo:'icono', x:30, y:120, w:40, h:40, icono:'gota', origen:'humedad' },
            { tipo:'texto', x:80, y:115, w:130, h:50, formato:'{humedad}%', fuente:'grande', color:'#60a5fa', alineacion:'izquierda' },
            { tipo:'texto', x:20, y:200, w:200, h:20, formato:'{hora}:{minutos}', fuente:'pequena', color:'#555', alineacion:'centro' }
        ]
    }
];

// ============ ESTADO ============
const state = {
    misPantallas: [],
    conectado: false
};

// ============ INICIALIZACIÓN ============
function init() {
    // Cargar pantallas guardadas
    const saved = localStorage.getItem('dasky_mis_pantallas');
    if (saved) {
        try {
            state.misPantallas = JSON.parse(saved);
        } catch(e) {
            state.misPantallas = [galeria[0], galeria[1]];
        }
    } else {
        // Por defecto: reloj y clima
        state.misPantallas = [galeria[0], galeria[1]];
    }
    
    renderGaleria();
    renderMisPantallas();
    setupTabs();
    setupModalListeners();
    setupDragAndDrop();
}

// ============ TABS ============
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
    });
}

// ============ GALERÍA ============
function renderGaleria() {
    const grid = document.getElementById('galeria-grid');
    
    grid.innerHTML = galeria.map(p => {
        const yaAgregada = state.misPantallas.some(m => m.id === p.id);
        return `
            <div class="galeria-card" data-id="${p.id}">
                <div class="galeria-preview">
                    <canvas id="preview-${p.id}" width="150" height="200"></canvas>
                </div>
                <div class="galeria-info">
                    <div class="galeria-nombre">${p.nombre}</div>
                    <div class="galeria-desc">${p.desc}${yaAgregada ? ' · Ya añadida' : ''}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Dibujar previews
    galeria.forEach(p => {
        const canvas = document.getElementById('preview-' + p.id);
        if (canvas) dibujarPreview(canvas, p.widgets);
    });
    
    // Event listeners
    grid.querySelectorAll('.galeria-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const pantalla = galeria.find(p => p.id === id);
            if (pantalla) abrirPreview(pantalla);
        });
    });
}

function dibujarPreview(canvas, widgets) {
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / 240;
    const scaleY = canvas.height / 320;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    widgets.forEach(w => {
        const x = w.x * scaleX;
        const y = w.y * scaleY;
        const ww = w.w * scaleX;
        const wh = w.h * scaleY;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, ww, wh);
        ctx.clip();
        
        if (w.tipo === 'texto') {
            const fontSize = w.fuente === 'grande' ? 16 : w.fuente === 'normal' ? 11 : 8;
            ctx.fillStyle = w.color;
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.textAlign = w.alineacion || 'center';
            const textX = w.alineacion === 'izquierda' ? x + 4 : w.alineacion === 'derecha' ? x + ww - 4 : x + ww/2;
            const textY = y + wh/2 + fontSize/3;
            let texto = (w.formato || '')
                .replace(/\{hora\}/g, '14').replace(/\{minutos\}/g, '32')
                .replace(/\{segundos\}/g, '45').replace(/\{temp\}/g, '23')
                .replace(/\{humedad\}/g, '54').replace(/\{bateria\}/g, '85')
                .replace(/\{dia\}/g, 'Lun').replace(/\{mes\}/g, 'Ene')
                .replace(/\{(\w+)\}/g, '--');
            ctx.fillText(texto, textX, textY);
        } else if (w.tipo === 'icono') {
            ctx.fillStyle = w.color || '#ffffff';
            ctx.font = `${wh * 0.6}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('●', x + ww/2, y + wh/2 + wh*0.2);
        } else if (w.tipo === 'grafico') {
            ctx.strokeStyle = w.color || '#4ade80';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const puntos = 6;
            for (let i = 0; i < puntos; i++) {
                const px = x + (ww / (puntos-1)) * i;
                const py = y + wh * (0.3 + Math.random() * 0.5);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        } else if (w.tipo === 'barra') {
            ctx.fillStyle = w.color || '#4ade80';
            const barWidth = ww * 0.7;
            ctx.beginPath();
            ctx.roundRect(x + (ww - barWidth)/2, y + wh*0.2, barWidth, wh*0.6, wh/2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// ============ PREVIEW MODAL ============
function abrirPreview(pantalla) {
    const modal = document.getElementById('preview-modal');
    const screen = document.getElementById('preview-screen');
    const nombre = document.getElementById('preview-nombre');
    const btn = document.getElementById('btn-añadir');
    
    // Limpiar y crear canvas
    screen.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 240;
    screen.appendChild(canvas);
    dibujarPreview(canvas, pantalla.widgets);
    
    nombre.textContent = pantalla.nombre;
    
    const yaAgregada = state.misPantallas.some(p => p.id === pantalla.id);
    if (yaAgregada) {
        btn.textContent = 'Ya está en mis pantallas';
        btn.classList.add('añadido');
    } else {
        btn.textContent = 'Añadir a mis pantallas';
        btn.classList.remove('añadido');
    }
    
    btn.onclick = () => {
        if (!yaAgregada) {
            state.misPantallas.push(JSON.parse(JSON.stringify(pantalla)));
            saveLocal();
            renderGaleria();
            renderMisPantallas();
            btn.textContent = 'Añadida ✓';
            btn.classList.add('añadido');
            showToast(pantalla.nombre + ' añadida');
            setTimeout(() => modal.classList.remove('visible'), 400);
        }
    };
    
    modal.classList.add('visible');
}

function setupModalListeners() {
    document.getElementById('preview-close').addEventListener('click', () => {
        document.getElementById('preview-modal').classList.remove('visible');
    });
    document.getElementById('preview-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('preview-modal').classList.remove('visible');
        }
    });
    
    // Guardar
    document.getElementById('btn-guardar').addEventListener('click', guardarConfiguracion);
}

// ============ MIS PANTALLAS ============
function renderMisPantallas() {
    const lista = document.getElementById('pantallas-lista');
    
    if (state.misPantallas.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:var(--text2);">
                <p style="font-size:40px; margin-bottom:12px;">📱</p>
                <p>Aún no tienes pantallas</p>
                <p style="font-size:12px;">Ve a la Galería para añadir algunas</p>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = state.misPantallas.map((p, i) => `
        <div class="pantalla-item" data-index="${i}" draggable="true">
            <span class="drag-handle">⋮⋮</span>
            <div class="pantalla-thumb">
                <canvas id="thumb-${i}" width="48" height="64"></canvas>
            </div>
            <div class="pantalla-info">
                <div class="nombre">${p.nombre}</div>
                <div class="meta">${p.widgets.length} bloques · Posición ${i + 1}</div>
            </div>
            <button class="btn-quitar" data-index="${i}" aria-label="Quitar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
    `).join('');
    
    // Dibujar thumbs
    state.misPantallas.forEach((p, i) => {
        const canvas = document.getElementById('thumb-' + i);
        if (canvas) dibujarPreview(canvas, p.widgets);
    });
    
    // Event listeners para quitar
    lista.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const nombre = state.misPantallas[index].nombre;
            state.misPantallas.splice(index, 1);
            saveLocal();
            renderGaleria();
            renderMisPantallas();
            showToast(nombre + ' eliminada');
        });
    });
    
    // Click en pantalla para previsualizar
    lista.querySelectorAll('.pantalla-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-quitar')) return;
            const index = parseInt(item.dataset.index);
            abrirPreview(state.misPantallas[index]);
        });
    });
}

// ============ DRAG & DROP ============
function setupDragAndDrop() {
    const lista = document.getElementById('pantallas-lista');
    
    lista.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.pantalla-item');
        if (!item) return;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.index);
    });
    
    lista.addEventListener('dragend', (e) => {
        const item = e.target.closest('.pantalla-item');
        if (item) item.classList.remove('dragging');
    });
    
    lista.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const dragging = lista.querySelector('.dragging');
        if (!dragging) return;
        
        const after = getDragAfterElement(lista, e.clientY);
        if (after) {
            lista.insertBefore(dragging, after);
        } else {
            lista.appendChild(dragging);
        }
    });
    
    lista.addEventListener('drop', (e) => {
        e.preventDefault();
        const items = [...lista.querySelectorAll('.pantalla-item')];
        const newOrder = items.map(item => parseInt(item.dataset.index));
        state.misPantallas = newOrder.map(i => state.misPantallas[i]);
        saveLocal();
        renderMisPantallas();
    });
}

function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.pantalla-item:not(.dragging)')];
    
    return items.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ============ GUARDAR ============
function guardarConfiguracion() {
    if (state.misPantallas.length === 0) {
        showToast('Añade al menos una pantalla');
        return;
    }
    
    const json = JSON.stringify({ pantallas: state.misPantallas }, null, 2);
    
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
    localStorage.setItem('dasky_mis_pantallas', JSON.stringify(state.misPantallas));
}

// ============ TOAST ============
function showToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 2200);
}

// ============ ARRANCAR ============
document.addEventListener('DOMContentLoaded', init);
