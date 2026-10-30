const STORAGE_KEY = 'consumoAutoElectrico_registros';

const form = document.getElementById('formCarga');
const fechaInput = document.getElementById('fecha');
const kmInput = document.getElementById('kilometraje');
const kwInput = document.getElementById('kw');
const costoCargaInput = document.getElementById('costoCarga');
const conexionInput = document.getElementById('costoConexion');
const ivaInput = document.getElementById('iva');

const resultado = document.getElementById('resultado');
const valSubtotal = document.getElementById('valSubtotal');
const valIva = document.getElementById('valIva');
const valTotal = document.getElementById('valTotal');
const valCostoKw = document.getElementById('valCostoKw');

const lista = document.getElementById('listaHistorial');
const totales = document.getElementById('totalesAcumulados');
const btnExportar = document.getElementById('btnExportar');
const inputImportar = document.getElementById('archivoImportar');

// Inicializar fecha de hoy por defecto
const hoy = new Date().toISOString().split('T')[0];
fechaInput.value = hoy;

let registros = cargarRegistros();

function cargarRegistros() {
const datos = localStorage.getItem(STORAGE_KEY);
return datos ? JSON.parse(datos) : [];
}

function guardarRegistros() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function formatearMoneda(n) {
return n.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
}

function formatearNumero(n, decimales = 2) {
return n.toFixed(decimales);
}

function calcular(costoCarga, costoConexion, iva, kw) {
const subtotal = costoCarga + costoConexion;
const ivaMonto = subtotal * (iva / 100);
const total = subtotal + ivaMonto;
const costoPorKw = kw > 0 ? costoCarga / kw : 0;
return { subtotal, ivaMonto, total, costoPorKw };
}

function renderizar() {
lista.innerHTML = '';
let totalGeneral = 0;
let kwTotal = 0;

// Ordenar más reciente primero
const ordenados = [...registros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

ordenados.forEach(reg => {
const c = calcular(reg.costoCarga, reg.costoConexion, reg.iva, reg.kw);
totalGeneral += c.total;
kwTotal += reg.kw;

const item = document.createElement('div');
item.className = 'historial-item';
item.innerHTML = `
<div>
<div class="valor">${reg.fecha}</div>
<div class="etiqueta">Fecha</div>
</div>
<div>
<div class="valor">${formatearNumero(reg.kilometraje)} km</div>
<div class="etiqueta">Kilometraje</div>
</div>
<div>
<div class="valor">${formatearMoneda(c.total)}</div>
<div class="etiqueta">Total</div>
</div>
<div>
<div class="valor">${formatearNumero(reg.kw)} kW</div>
<div class="etiqueta">Carga</div>
</div>
`;
lista.appendChild(item);
});

totales.textContent = `Acumulado: ${ordenados.length} carga(s) | ${formatearNumero(kwTotal)} kW totales | ${formatearMoneda(totalGeneral)} gastado en total`;
}

function mostrarResultado(reg) {
const c = calcular(reg.costoCarga, reg.costoConexion, reg.iva, reg.kw);
valSubtotal.textContent = formatearMoneda(c.subtotal);
valIva.textContent = formatearMoneda(c.ivaMonto);
valTotal.textContent = formatearMoneda(c.total);
valCostoKw.textContent = formatearMoneda(c.costoPorKw);
resultado.style.display = 'block';
resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', (e) => {
e.preventDefault();

const registro = {
id: Date.now().toString(),
fecha: fechaInput.value,
kilometraje: parseFloat(kmInput.value) || 0,
kw: parseFloat(kwInput.value) || 0,
costoCarga: parseFloat(costoCargaInput.value) || 0,
costoConexion: parseFloat(conexionInput.value) || 0,
iva: parseFloat(ivaInput.value) || 0
};

registros.push(registro);
guardarRegistros();
renderizar();
mostrarResultado(registro);

form.reset();
fechaInput.value = hoy;
});

btnExportar.addEventListener('click', () => {
const blob = new Blob([JSON.stringify(registros, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `consumo-auto-electrico-respaldos-${new Date().toISOString().slice(0,10)}.json`;
a.click();
URL.revokeObjectURL(url);
});

inputImportar.addEventListener('change', (e) => {
const archivo = e.target.files[0];
if (!archivo) return;
const lector = new FileReader();
lector.onload = (ev) => {
try {
const importados = JSON.parse(ev.target.result);
if (!Array.isArray(importados)) throw new Error('Formato inválido');
registros = importados;
guardarRegistros();
renderizar();
alert('Datos importados correctamente');
} catch (err) {
alert('Error al importar: ' + err.message);
}
};
lector.readAsText(archivo);
e.target.value = '';
});

renderizar();