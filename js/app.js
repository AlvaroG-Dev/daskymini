// ============ BARRA DE ESTADO (siempre presente) ============
const BARRA_ESTADO = [
    { tipo:'texto', x:16, y:6, w:60, h:18, formato:'{hora}:{minutos}', fuente:'estado', color:'#ffffff', alineacion:'izquierda', peso:'medium' },
    { tipo:'icono_estado', x:180, y:6, w:16, h:18, icono:'wifi', color:'#ffffff' },
    { tipo:'icono_estado', x:198, y:6, w:16, h:18, icono:'bluetooth', color:'#ffffff' },
    { tipo:'texto', x:216, y:6, w:24, h:18, formato:'{bateria}%', fuente:'estado', color:'#3fb950', alineacion:'derecha', peso:'medium' }
];

const ALTURA_BARRA = 28;

// ============ GALERÍA DE PANTALLAS ============
const galeria = [
    {
        id: 'reloj',
        nombre: 'Reloj',
        desc: 'Hora central con fecha',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:0, y:80, w:240, h:100, formato:'{hora}:{minutos}', fuente:'enorme', color:'#ffffff', alineacion:'centro', peso:'bold' },
            { tipo:'texto', x:0, y:185, w:240, h:30, formato:'{dia}, {d} de {mes}', fuente:'normal', color:'#8b949e', alineacion:'centro', peso:'regular' },
            { tipo:'barra', x:70, y:290, w:100, h:3, origen:'bateria', color:'#3fb950' }
        ]
    },
    {
        id: 'clima',
        nombre: 'Clima',
        desc: 'Icono meteorológico, temperatura y humedad',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'icono', x:50, y:60, w:140, h:110, icono:'sol', color:'#f0883e' },
            { tipo:'texto', x:0, y:175, w:240, h:55, formato:'{temp}°C', fuente:'grande', color:'#ffffff', alineacion:'centro', peso:'bold' },
            { tipo:'linea', x:60, y:240, w:120, color:'#21262d' },
            { tipo:'texto', x:30, y:250, w:85, h:22, formato:'Humedad', fuente:'pequena', color:'#8b949e', alineacion:'centro', peso:'regular' },
            { tipo:'texto', x:30, y:272, w:85, h:30, formato:'{humedad}%', fuente:'normal', color:'#58a6ff', alineacion:'centro', peso:'medium' },
            { tipo:'texto', x:125, y:250, w:85, h:22, formato:'Sensación', fuente:'pequena', color:'#8b949e', alineacion:'centro', peso:'regular' },
            { tipo:'texto', x:125, y:272, w:85, h:30, formato:'{temp}°C', fuente:'normal', color:'#f0883e', alineacion:'centro', peso:'medium' }
        ]
    },
    {
        id: 'dashboard',
        nombre: 'Dashboard',
        desc: 'Hora, fecha y métricas en tarjetas',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:16, y:42, w:208, h:50, formato:'{hora}:{minutos}', fuente:'grande', color:'#ffffff', alineacion:'izquierda', peso:'bold' },
            { tipo:'texto', x:16, y:90, w:208, h:20, formato:'{dia}, {d} de {mes}', fuente:'pequena', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'tarjeta', x:12, y:130, w:102, h:80, colorBorde:'#21262d', colorFondo:'#161b22' },
            { tipo:'icono', x:24, y:142, w:28, h:28, icono:'termometro', color:'#f0883e' },
            { tipo:'texto', x:56, y:140, w:56, h:28, formato:'{temp}°', fuente:'normal', color:'#ffffff', alineacion:'izquierda', peso:'medium' },
            { tipo:'texto', x:24, y:174, w:88, h:16, formato:'Temperatura', fuente:'mini', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'tarjeta', x:126, y:130, w:102, h:80, colorBorde:'#21262d', colorFondo:'#161b22' },
            { tipo:'icono', x:138, y:142, w:28, h:28, icono:'gota', color:'#58a6ff' },
            { tipo:'texto', x:170, y:140, w:56, h:28, formato:'{humedad}%', fuente:'normal', color:'#ffffff', alineacion:'izquierda', peso:'medium' },
            { tipo:'texto', x:138, y:174, w:88, h:16, formato:'Humedad', fuente:'mini', color:'#8b949e', alineacion:'izquierda', peso:'regular' },
            { tipo:'grafico', x:12, y:228, w:216, h:65, color:'#f0883e', relleno:'#f0883e10', secundario:'#58a6ff' }
        ]
    },
    {
        id: 'minimal',
        nombre: 'Minimal',
        desc: 'Solo hora y temperatura, máxima limpieza',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:0, y:100, w:240, h:90, formato:'{hora}:{minutos}', fuente:'enorme', color:'#ffffff', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:200, w:240, h:30, formato:'{temp}°C  ·  {humedad}%', fuente:'normal', color:'#8b949e', alineacion:'centro', peso:'light' }
        ]
    },
    {
        id: 'metrica_grande',
        nombre: 'Métrica grande',
        desc: 'Una métrica como protagonista',
        colorFondo: '#0d1117',
        widgets: [
            { tipo:'texto', x:16, y:42, w:208, h:22, formato:'{hora}:{minutos}', fuente:'pequena', color:'#8b949e', alineacion:'derecha', peso:'regular' },
            { tipo:'icono', x:60, y:90, w:120, h:100, icono:'termometro', color:'#f0883e' },
            { tipo:'texto', x:0, y:200, w:240, h:70, formato:'{temp}°C', fuente:'enorme', color:'#ffffff', alineacion:'centro', peso:'bold' },
            { tipo:'texto', x:0, y:270, w:240, h:20, formato:'Humedad {humedad}% · Batería {bateria}%', fuente:'mini', color:'#8b949e', alineacion:'centro', peso:'regular' }
        ]
    },
    {
        id: 'noche',
        nombre: 'Noche',
        desc: 'Brillo tenue para mesilla',
        colorFondo: '#0a0a12',
        widgets: [
            { tipo:'texto', x:0, y:90, w:240, h:100, formato:'{hora}:{minutos}', fuente:'enorme', color:'#c9734a', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:195, w:240, h:26, formato:'{dia}, {d} {mes}', fuente:'normal', color:'#5a453a', alineacion:'centro', peso:'light' },
            { tipo:'texto', x:0, y:260, w:240, h:22, formato:'{temp}°C', fuente:'pequena', color:'#3a3530', alineacion:'centro', peso:'light' }
        ]
    }
];

// ============ ESTADO ============
const state = {
    misPantallas: [],
    conectado: false
};

// ============ FUENTES ============
const FUENTES = {
    enorme: { size: 68, family: 'Inter, system-ui, -apple-system, sans-serif' },
    grande: { size: 42, family: 'Inter, system-ui, -apple-system, sans-serif' },
    normal: { size: 22, family: 'Inter, system-ui, -apple-system, sans-serif' },
    pequena: { size: 15, family: 'Inter, system-ui, -apple-system, sans-serif' },
    mini: { size: 11, family: 'Inter, system-ui, -apple-system, sans-serif' },
    estado: { size: 13, family: 'Inter, system-ui, -apple-system, sans-serif' }
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

// ============ MOTOR DE RENDERIZADO ============
function renderizarPantalla(canvas, widgets, colorFondo = '#0d1117') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const scaleX = W / 240;
    const scaleY = H / 320;
    
    // Fondo
    ctx.fillStyle = colorFondo;
    ctx.fillRect(0, 0, W, H);
    
    // Barra de estado
    ctx.fillStyle = colorFondo;
    ctx.fillRect(0, 0, W, ALTURA_BARRA * scaleY);
    
    BARRA_ESTADO.forEach(w => {
        dibujarWidget(ctx, w, scaleX, scaleY, W, H, true);
    });
    
    // Línea sutil bajo barra de estado
    ctx.strokeStyle = colorFondo === '#0a0a12' ? '#1a1a25' : '#21262d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, ALTURA_BARRA * scaleY);
    ctx.lineTo(W, ALTURA_BARRA * scaleY);
    ctx.stroke();
    
    // Widgets de la pantalla
    widgets.forEach(w => {
        // Ajustar widgets para que empiecen después de la barra
        const wAjustado = { ...w };
        if (w.y < ALTURA_BARRA + 8) {
            wAjustado.y = w.y + ALTURA_BARRA;
        }
        dibujarWidget(ctx, wAjustado, scaleX, scaleY, W, H, false);
    });
}

function dibujarWidget(ctx, w, scaleX, scaleY, W, H, esBarraEstado) {
    ctx.save();
    
    const x = Math.max(0, w.x * scaleX);
    const y = Math.max(0, w.y * scaleY);
    const ww = Math.min(W - x, w.w * scaleX);
    const wh = Math.min(H - y, w.h * scaleY);
    
    switch(w.tipo) {
        case 'texto':
            dibujarTexto(ctx, x, y, ww, wh, w, esBarraEstado);
            break;
        case 'icono':
            dibujarIcono(ctx, x, y, ww, wh, w);
            break;
        case 'icono_estado':
            dibujarIconoEstado(ctx, x, y, ww, wh, w);
            break;
        case 'grafico':
            dibujarGrafico(ctx, x, y, ww, wh, w);
            break;
        case 'barra':
            dibujarBarra(ctx, x, y, ww, wh, w);
            break;
        case 'linea':
            dibujarLinea(ctx, x, y, ww, w);
            break;
        case 'tarjeta':
            dibujarTarjeta(ctx, x, y, ww, wh, w);
            break;
    }
    
    ctx.restore();
}

function dibujarTexto(ctx, x, y, ww, wh, w, esBarraEstado) {
    const fuenteConfig = FUENTES[w.fuente] || FUENTES.normal;
    const size = fuenteConfig.size * (ctx.canvas.width / 240);
    const family = fuenteConfig.family;
    const pesoMap = { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700' };
    
    ctx.fillStyle = w.color;
    ctx.font = `${pesoMap[w.peso] || '400'} ${size}px ${family}`;
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
    
    const padding = size * 0.15;
    const textX = w.alineacion === 'izquierda' ? x + padding : 
                  w.alineacion === 'derecha' ? x + ww - padding : 
                  x + ww / 2;
    
    const maxWidth = ww - padding * 2;
    ctx.fillText(texto, textX, y + wh / 2, maxWidth > 0 ? maxWidth : ww);
}

function dibujarIcono(ctx, x, y, ww, wh, w) {
    const cx = x + ww / 2;
    const cy = y + wh / 2;
    const r = Math.min(ww, wh) * 0.4;
    
    ctx.strokeStyle = w.color || '#ffffff';
    ctx.lineWidth = Math.max(1.8, r * 0.08);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch(w.icono) {
        case 'sol':
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const inner = r * 0.42;
                const outer = r * 0.7;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
                ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
                ctx.stroke();
            }
            break;
        case 'termometro':
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.35, r * 0.28, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = w.color;
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.35, r * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = w.color + '30';
            ctx.fillRect(cx - r * 0.08, cy - r * 0.55, r * 0.16, r * 0.85);
            ctx.strokeStyle = w.color;
            ctx.strokeRect(cx - r * 0.08, cy - r * 0.55, r * 0.16, r * 0.85);
            break;
        case 'gota':
            ctx.beginPath();
            ctx.moveTo(cx, cy - r * 0.7);
            ctx.bezierCurveTo(cx - r * 0.55, cy - r * 0.1, cx - r * 0.45, cy + r * 0.45, cx, cy + r * 0.6);
            ctx.bezierCurveTo(cx + r * 0.45, cy + r * 0.45, cx + r * 0.55, cy - r * 0.1, cx, cy - r * 0.7);
            ctx.stroke();
            break;
        default:
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
            ctx.stroke();
    }
}

function dibujarIconoEstado(ctx, x, y, ww, wh, w) {
    const cx = x + ww / 2;
    const cy = y + wh / 2;
    const r = Math.min(ww, wh) * 0.35;
    
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    switch(w.icono) {
        case 'wifi':
            for (let i = 0; i < 3; i++) {
                const radius = r * (0.4 + i * 0.3);
                const startAngle = Math.PI * 0.25;
                const endAngle = Math.PI * 0.75;
                ctx.beginPath();
                ctx.arc(cx, cy + r * 0.3, radius, startAngle, endAngle);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.3, r * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = w.color;
            ctx.fill();
            break;
        case 'bluetooth':
            ctx.beginPath();
            ctx.moveTo(cx + r * 0.3, cy - r * 0.7);
            ctx.lineTo(cx - r * 0.3, cy + r * 0.7);
            ctx.moveTo(cx - r * 0.3, cy - r * 0.7);
            ctx.lineTo(cx + r * 0.3, cy + r * 0.7);
            ctx.moveTo(cx, cy - r * 0.5);
            ctx.lineTo(cx, cy + r * 0.5);
            ctx.stroke();
            break;
    }
}

function dibujarGrafico(ctx, x, y, ww, wh, w) {
    const padX = 6;
    const padY = 6;
    const gW = ww - padX * 2;
    const gH = wh - padY * 2;
    
    const puntos = 24;
    const datos = [];
    for (let i = 0; i < puntos; i++) {
        let val = 0.3 + Math.sin(i / 4) * 0.2 + Math.cos(i / 6) * 0.15 + Math.random() * 0.15;
        val = Math.max(0.1, Math.min(0.9, val));
        datos.push(val);
    }
    
    if (w.relleno) {
        ctx.fillStyle = w.relleno;
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
    }
    
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
    
    if (w.secundario) {
        const datos2 = datos.map(d => Math.max(0.05, d * 0.7 + Math.random() * 0.2));
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

function dibujarBarra(ctx, x, y, ww, wh, w) {
    const nivel = w.origen === 'bateria' ? 0.72 : 0.55;
    const radio = Math.min(wh / 2, 3);
    
    ctx.fillStyle = w.color + '25';
    ctx.beginPath();
    ctx.roundRect(x, y + wh/2 - wh/2, ww, wh, radio);
    ctx.fill();
    
    ctx.fillStyle = w.color;
    ctx.beginPath();
    ctx.roundRect(x, y + wh/2 - wh/2, ww * nivel, wh, radio);
    ctx.fill();
}

function dibujarLinea(ctx, x, y, ww, w) {
    ctx.strokeStyle = w.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + ww, y);
    ctx.stroke();
}

function dibujarTarjeta(ctx, x, y, ww, wh, w) {
    ctx.fillStyle = w.colorFondo || '#161b22';
    ctx.strokeStyle = w.colorBorde || '#21262d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, ww, wh, 8);
    ctx.fill();
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
                    <div class="galeria-desc">${p.desc}</div>
                    ${yaAgregada ? '<span class="badge-añadida">Añadida</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    requestAnimationFrame(() => {
        galeria.forEach(p => {
            const canvas = document.getElementById('preview-' + p.id);
            if (canvas) renderizarPantalla(canvas, p.widgets, p.colorFondo);
        });
    });
    
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
    screen.appendChild(canvas);
    
    renderizarPantalla(canvas, pantalla.widgets, pantalla.colorFondo);
    
    nombre.textContent = pantalla.nombre;
    
    const yaAgregada = state.misPantallas.some(p => p.id === pantalla.id);
    btn.textContent = yaAgregada ? 'Ya añadida' : 'Añadir a mis pantallas';
    btn.classList.toggle('añadido', yaAgregada);
    
    btn.onclick = () => {
        if (!yaAgregada) {
            state.misPantallas.push(JSON.parse(JSON.stringify(pantalla)));
            saveLocal();
            renderGaleria();
            renderMisPantallas();
            btn.textContent = '✓ Añadida';
            btn.classList.add('añadido');
            showToast(pantalla.nombre + ' añadida');
            setTimeout(() => modal.classList.remove('visible'), 500);
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
                <p>No tienes pantallas</p>
                <span>Ve a la Galería para añadir</span>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = state.misPantallas.map((p, i) => `
        <div class="pantalla-item" data-index="${i}" draggable="true">
            <span class="drag-handle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.25">
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
                <div class="meta">Posición ${i + 1}</div>
            </div>
            <button class="btn-quitar" data-index="${i}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    requestAnimationFrame(() => {
        state.misPantallas.forEach((p, i) => {
            const canvas = document.getElementById('thumb-' + i);
            if (canvas) renderizarPantalla(canvas, p.widgets, p.colorFondo);
        });
    });
    
    lista.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nombre = state.misPantallas[parseInt(btn.dataset.index)].nombre;
            state.misPantallas.splice(parseInt(btn.dataset.index), 1);
            saveLocal();
            renderGaleria();
            renderMisPantallas();
            showToast(nombre + ' eliminada');
        });
    });
    
    lista.querySelectorAll('.pantalla-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-quitar')) return;
            abrirPreview(state.misPantallas[parseInt(item.dataset.index)]);
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
    
    lista.addEventListener('dragend', () => {
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
        state.misPantallas = items.map(item => state.misPantallas[parseInt(item.dataset.index)]);
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
        showToast('Descargado. Conecta el dispositivo para transferir.');
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

document.addEventListener('DOMContentLoaded', init);
