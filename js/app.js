// ============ GALERÍA DE PANTALLAS ============
const galeria = [
    {
        id: 'reloj_grande',
        nombre: 'Reloj',
        desc: 'Hora en grande con fecha',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:0, y:55, w:240, h:90, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'centro', peso:'bold' },
            { tipo:'texto', x:0, y:150, w:240, h:28, formato:'{dia}, {d} de {mes}', fuente:'normal', color:'#8b949e', alineacion:'centro', peso:'regular' },
            { tipo:'barra', x:60, y:270, w:120, h:4, origen:'bateria', color:'#3fb950' }
        ]
    },
    {
        id: 'clima',
        nombre: 'Clima',
        desc: 'Temperatura, humedad e icono',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:20, y:20, w:200, h:24, formato:'{hora}:{minutos}', fuente:'pequena', color:'#8b949e', alineacion:'derecha', peso:'regular' },
            { tipo:'icono', x:30, y:70, w:56, h:56, icono:'sol', origen:'temp', color:'#f0883e' },
            { tipo:'texto', x:100, y:62, w:120, h:70, formato:'{temp}°', fuente:'grande', color:'#ffffff', alineacion:'izquierda', peso:'bold' },
            { tipo:'texto', x:22, y:160, w:196, h:20, formato:'Humedad', fuente:'pequena', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'texto', x:22, y:178, w:196, h:32, formato:'{humedad}%', fuente:'normal', color:'#58a6ff', alineacion:'izquierda', peso:'medium' },
            { tipo:'grafico', x:15, y:225, w:210, h:55, color:'#58a6ff', relleno:'#58a6ff15' }
        ]
    },
    {
        id: 'minimal',
        nombre: 'Minimal',
        desc: 'Solo lo esencial',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:0, y:70, w:240, h:100, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:185, w:240, h:36, formato:'{temp}°C', fuente:'normal', color:'#8b949e', alineacion:'centro', peso:'light' },
            { tipo:'barra', x:80, y:280, w:80, h:3, origen:'bateria', color:'#30363d' }
        ]
    },
    {
        id: 'dashboard',
        nombre: 'Dashboard',
        desc: 'Toda la información de un vistazo',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:20, y:16, w:200, h:22, formato:'{dia} {d} {mes}', fuente:'pequena', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'texto', x:20, y:38, w:200, h:52, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'izquierda', peso:'bold' },
            { tipo:'linea', x:20, y:100, w:200, color:'#21262d' },
            { tipo:'icono', x:24, y:118, w:32, h:32, icono:'termometro', origen:'temp', color:'#f0883e' },
            { tipo:'texto', x:62, y:116, w:80, h:36, formato:'{temp}°', fuente:'normal', color:'#ffffff', alineacion:'izquierda', peso:'medium' },
            { tipo:'icono', x:140, y:118, w:32, h:32, icono:'gota', origen:'humedad', color:'#58a6ff' },
            { tipo:'texto', x:178, y:116, w:50, h:36, formato:'{humedad}%', fuente:'normal', color:'#ffffff', alineacion:'izquierda', peso:'medium' },
            { tipo:'linea', x:20, y:168, w:200, color:'#21262d' },
            { tipo:'texto', x:20, y:180, w:200, h:18, formato:'Últimas 24 horas', fuente:'pequena', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'grafico', x:15, y:202, w:210, h:70, color:'#f0883e', relleno:'#f0883e10', secundario:'#58a6ff' },
            { tipo:'barra', x:20, y:295, w:200, h:3, origen:'bateria', color:'#3fb950' }
        ]
    },
    {
        id: 'grande_temp',
        nombre: 'Temperatura',
        desc: 'Temperatura como protagonista',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:0, y:30, w:240, h:28, formato:'{hora}:{minutos}', fuente:'normal', color:'#8b949e', alineacion:'centro', peso:'regular' },
            { tipo:'icono', x:70, y:75, w:100, h:100, icono:'termometro', origen:'temp', color:'#f0883e' },
            { tipo:'texto', x:0, y:180, w:240, h:80, formato:'{temp}°C', fuente:'grande', color:'#ffffff', alineacion:'centro', peso:'bold' },
            { tipo:'texto', x:0, y:255, w:240, h:22, formato:'Humedad {humedad}%', fuente:'pequena', color:'#58a6ff', alineacion:'centro', peso:'regular' }
        ]
    },
    {
        id: 'noche',
        nombre: 'Modo noche',
        desc: 'Brillo tenue, ideal para mesilla',
        colorFondo: '#0a0a0f',
        widgets: [
            { tipo:'texto', x:0, y:80, w:240, h:100, formato:'{hora}:{minutos}', fuente:'grande', color:'#c9734a', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:185, w:240, h:26, formato:'{dia}, {d} {mes}', fuente:'normal', color:'#5a453a', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:250, w:240, h:22, formato:'{temp}°', fuente:'pequena', color:'#3a3530', alineacion:'centro', peso:'light' }
        ]
    }
];

// ============ ESTADO ============
const state = {
    misPantallas: [],
    conectado: false
};

// ============ FUENTES (simuladas con canvas) ============
const FUENTES = {
    grande: { size: 52, family: 'Inter, system-ui, sans-serif' },
    normal: { size: 22, family: 'Inter, system-ui, sans-serif' },
    pequena: { size: 14, family: 'Inter, system-ui, sans-serif' }
};

// ============ INICIALIZACIÓN ============
function init() {
    const saved = localStorage.getItem('dasky_mis_pantallas');
    if (saved) {
        try {
            state.misPantallas = JSON.parse(saved);
        } catch(e) {
            state.misPantallas = [galeria[0], galeria[1]];
        }
    } else {
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

// ============ RENDERIZADO DE PANTALLA (motor de preview) ============
function renderizarPantalla(canvas, widgets, colorFondo = '#0d1117') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const scaleX = W / 240;
    const scaleY = H / 320;
    
    // Fondo
    ctx.fillStyle = colorFondo;
    ctx.fillRect(0, 0, W, H);
    
    // Dibujar widgets en orden
    widgets.forEach(w => {
        ctx.save();
        
        const x = w.x * scaleX;
        const y = w.y * scaleY;
        const ww = w.w * scaleX;
        const wh = w.h * scaleY;
        
        switch(w.tipo) {
            case 'texto':
                renderizarTexto(ctx, x, y, ww, wh, w);
                break;
            case 'icono':
                renderizarIcono(ctx, x, y, ww, wh, w);
                break;
            case 'grafico':
                renderizarGrafico(ctx, x, y, ww, wh, w);
                break;
            case 'barra':
                renderizarBarra(ctx, x, y, ww, wh, w);
                break;
            case 'linea':
                renderizarLinea(ctx, x, y, ww, w);
                break;
        }
        
        ctx.restore();
    });
}

function renderizarTexto(ctx, x, y, ww, wh, w) {
    const fuenteConfig = FUENTES[w.fuente] || FUENTES.normal;
    const size = fuenteConfig.size * (ww / 200) * (ctx.canvas.width / 240);
    const family = fuenteConfig.family;
    const peso = w.peso || 'regular';
    const pesoMap = { light: '300', regular: '400', medium: '500', bold: '700' };
    
    ctx.fillStyle = w.color;
    ctx.font = `${pesoMap[peso] || '400'} ${size}px ${family}`;
    ctx.textAlign = w.alineacion || 'center';
    ctx.textBaseline = 'middle';
    
    let texto = (w.formato || '')
        .replace(/\{hora\}/g, '14')
        .replace(/\{minutos\}/g, '32')
        .replace(/\{segundos\}/g, '45')
        .replace(/\{temp\}/g, '23')
        .replace(/\{humedad\}/g, '54')
        .replace(/\{bateria\}/g, '85')
        .replace(/\{dia\}/g, 'Mié')
        .replace(/\{d\}/g, '11')
        .replace(/\{mes\}/g, 'Jun')
        .replace(/\{(\w+)\}/g, '--');
    
    const textX = w.alineacion === 'izquierda' ? x + size * 0.2 : 
                  w.alineacion === 'derecha' ? x + ww - size * 0.2 : 
                  x + ww / 2;
    
    // Limpiar: recortar texto si es muy largo
    ctx.fillText(texto, textX, y + wh / 2, ww - 8);
}

function renderizarIcono(ctx, x, y, ww, wh, w) {
    const cx = x + ww / 2;
    const cy = y + wh / 2;
    const r = Math.min(ww, wh) * 0.38;
    
    ctx.strokeStyle = w.color || '#ffffff';
    ctx.lineWidth = Math.max(1.5, r * 0.1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const iconName = w.icono || 'sol';
    
    switch(iconName) {
        case 'sol':
            // Círculo central
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
            ctx.stroke();
            // Rayos
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const innerX = cx + Math.cos(angle) * r * 0.55;
                const innerY = cy + Math.sin(angle) * r * 0.55;
                const outerX = cx + Math.cos(angle) * r * 0.9;
                const outerY = cy + Math.sin(angle) * r * 0.9;
                ctx.beginPath();
                ctx.moveTo(innerX, innerY);
                ctx.lineTo(outerX, outerY);
                ctx.stroke();
            }
            break;
        case 'termometro':
            // Bulbo
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.4, r * 0.3, 0, Math.PI * 2);
            ctx.stroke();
            // Tubo
            ctx.beginPath();
            ctx.moveTo(cx - r * 0.12, cy - r * 0.6);
            ctx.lineTo(cx - r * 0.12, cy + r * 0.15);
            ctx.lineTo(cx + r * 0.12, cy + r * 0.15);
            ctx.lineTo(cx + r * 0.12, cy - r * 0.6);
            ctx.stroke();
            // Nivel
            ctx.fillStyle = w.color;
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.15, r * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'gota':
            ctx.beginPath();
            ctx.moveTo(cx, cy - r * 0.8);
            ctx.bezierCurveTo(cx - r * 0.6, cy - r * 0.1, cx - r * 0.5, cy + r * 0.5, cx, cy + r * 0.7);
            ctx.bezierCurveTo(cx + r * 0.5, cy + r * 0.5, cx + r * 0.6, cy - r * 0.1, cx, cy - r * 0.8);
            ctx.stroke();
            break;
        default:
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
            ctx.stroke();
    }
}

function renderizarGrafico(ctx, x, y, ww, wh, w) {
    const padX = 4;
    const padY = 4;
    const gW = ww - padX * 2;
    const gH = wh - padY * 2;
    
    // Relleno
    const relleno = w.relleno || (w.color + '15');
    
    // Generar puntos de datos simulados
    const puntos = 20;
    const datos = [];
    for (let i = 0; i < puntos; i++) {
        datos.push(0.2 + Math.random() * 0.6);
    }
    // Suavizar
    for (let i = 1; i < datos.length - 1; i++) {
        datos[i] = (datos[i-1] + datos[i] + datos[i+1]) / 3;
    }
    
    // Dibujar relleno
    ctx.fillStyle = relleno;
    ctx.beginPath();
    ctx.moveTo(x + padX, y + padY + gH);
    for (let i = 0; i < puntos; i++) {
        const px = x + padX + (gW / (puntos - 1)) * i;
        const py = y + padY + gH - (datos[i] * gH);
        ctx.lineTo(px, py);
    }
    ctx.lineTo(x + padX + gW, y + padY + gH);
    ctx.closePath();
    ctx.fill();
    
    // Dibujar línea
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < puntos; i++) {
        const px = x + padX + (gW / (puntos - 1)) * i;
        const py = y + padY + gH - (datos[i] * gH);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // Línea secundaria si existe
    if (w.secundario) {
        const datos2 = datos.map(() => 0.15 + Math.random() * 0.4);
        ctx.strokeStyle = w.secundario;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        for (let i = 0; i < puntos; i++) {
            const px = x + padX + (gW / (puntos - 1)) * i;
            const py = y + padY + gH - (datos2[i] * gH);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

function renderizarBarra(ctx, x, y, ww, wh, w) {
    const nivel = w.origen === 'bateria' ? 0.72 : 0.55;
    const radio = wh / 2;
    
    // Fondo
    ctx.fillStyle = w.color + '20';
    ctx.beginPath();
    ctx.roundRect(x, y, ww, wh, radio);
    ctx.fill();
    
    // Nivel
    ctx.fillStyle = w.color;
    ctx.beginPath();
    ctx.roundRect(x, y, ww * nivel, wh, radio);
    ctx.fill();
}

function renderizarLinea(ctx, x, y, ww, w) {
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + ww, y);
    ctx.stroke();
}

// ============ GALERÍA ============
function renderGaleria() {
    const grid = document.getElementById('galeria-grid');
    
    grid.innerHTML = galeria.map(p => {
        const yaAgregada = state.misPantallas.some(m => m.id === p.id);
        return `
            <div class="galeria-card" data-id="${p.id}">
                <div class="galeria-preview">
                    <canvas id="preview-${p.id}" width="300" height="400"></canvas>
                </div>
                <div class="galeria-info">
                    <div class="galeria-nombre">${p.nombre}</div>
                    <div class="galeria-desc">${p.desc}${yaAgregada ? ' · ✓' : ''}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Dibujar previews
    requestAnimationFrame(() => {
        galeria.forEach(p => {
            const canvas = document.getElementById('preview-' + p.id);
            if (canvas) renderizarPantalla(canvas, p.widgets, p.colorFondo);
        });
    });
    
    // Click en card
    grid.querySelectorAll('.galeria-card').forEach(card => {
        card.addEventListener('click', () => {
            const pantalla = galeria.find(p => p.id === card.dataset.id);
            if (pantalla) abrirPreview(pantalla);
        });
    });
}

// ============ PREVIEW MODAL ============
function abrirPreview(pantalla) {
    const modal = document.getElementById('preview-modal');
    const screen = document.getElementById('preview-screen');
    const nombre = document.getElementById('preview-nombre');
    const btn = document.getElementById('btn-añadir');
    
    screen.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 320;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    screen.appendChild(canvas);
    
    renderizarPantalla(canvas, pantalla.widgets, pantalla.colorFondo);
    
    nombre.textContent = pantalla.nombre;
    
    const yaAgregada = state.misPantallas.some(p => p.id === pantalla.id);
    btn.textContent = yaAgregada ? 'Ya está en mis pantallas' : 'Añadir a mis pantallas';
    btn.classList.toggle('añadido', yaAgregada);
    
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
    document.getElementById('btn-guardar').addEventListener('click', guardarConfiguracion);
}

// ============ MIS PANTALLAS ============
function renderMisPantallas() {
    const lista = document.getElementById('pantallas-lista');
    
    if (state.misPantallas.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
                <p>No tienes pantallas todavía</p>
                <p class="sub">Explora la Galería para añadir algunas</p>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = state.misPantallas.map((p, i) => `
        <div class="pantalla-item" data-index="${i}" draggable="true">
            <span class="drag-handle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                    <circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/>
                    <circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>
                    <circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/>
                </svg>
            </span>
            <div class="pantalla-thumb">
                <canvas id="thumb-${i}" width="120" height="160"></canvas>
            </div>
            <div class="pantalla-info">
                <div class="nombre">${p.nombre}</div>
                <div class="meta">Posición ${i + 1} de ${state.misPantallas.length}</div>
            </div>
            <button class="btn-quitar" data-index="${i}" aria-label="Quitar pantalla">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Renderizar thumbs
    requestAnimationFrame(() => {
        state.misPantallas.forEach((p, i) => {
            const canvas = document.getElementById('thumb-' + i);
            if (canvas) renderizarPantalla(canvas, p.widgets, p.colorFondo);
        });
    });
    
    // Quitar pantalla
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
    
    // Click para preview
    lista.querySelectorAll('.pantalla-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-quitar') || e.target.closest('.drag-handle')) return;
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
        lista.querySelectorAll('.pantalla-item').forEach(el => el.classList.remove('dragging'));
    });
    
    lista.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = lista.querySelector('.dragging');
        if (!dragging) return;
        const after = getDragAfterElement(lista, e.clientY);
        if (after) lista.insertBefore(dragging, after);
        else lista.appendChild(dragging);
    });
    
    lista.addEventListener('drop', (e) => {
        e.preventDefault();
        const items = [...lista.querySelectorAll('.pantalla-item')];
        state.misPantallas = items.map(item => {
            const i = parseInt(item.dataset.index);
            return state.misPantallas[i];
        });
        saveLocal();
        renderMisPantallas();
    });
}

function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.pantalla-item:not(.dragging)')];
    return items.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
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
        showToast('Descargado ✓ Conecta el dispositivo para transferir');
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
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ============ ARRANCAR ============
document.addEventListener('DOMContentLoaded', init);
