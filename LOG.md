# LOG - Historial de cambios de ConsumoAutoElectrico

## 2026-10-30
- Creación del proyecto ConsumoAutoElectrico
- index.html: Formulario con campos de fecha, kilometraje actual, kW, costo de carga, costo de conexión e IVA
- style.css: Estilos de la aplicación
- app.js: Lógica de cálculo (subtotal, IVA, total, costo por kW), persistencia con localStorage, exportar/importar JSON
- agents.md: Requisitos del proyecto

## 2026-10-30 (actualización)
- index.html: Agregado campo "Kilómetros recorridos desde la última carga (km)" según requisito del agents.md
- app.js: Agregada variable kmRecorridosInput y campo kilometrosRecorridos al objeto de registro
- app.js: Agregado reset del campo kilometrosRecorridos al limpiar formulario
- app.js: Agregada columna "Recorridos" al historial de cargas
- LOG.md: Creado archivo de histórico de cambios importantes