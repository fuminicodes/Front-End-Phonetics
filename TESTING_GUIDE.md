# 🧪 Testing Guide - Server Actions

## Guía de Pruebas para las Nuevas Server Actions

Esta guía te ayudará a probar las Server Actions implementadas y verificar que funcionan correctamente.

---

## 📋 Pre-requisitos

Antes de comenzar las pruebas, asegúrate de que:

1. ✅ El servidor de desarrollo está corriendo: `npm run dev`
2. ✅ La API externa está disponible en `http://localhost:5005`
3. ✅ Tienes permisos de micrófono habilitados en el navegador
4. ✅ Tienes archivos de audio de prueba disponibles

---

## 🔧 Páginas de Prueba Disponibles

### 1. Test Básico: `/proxy-test-sa`

**URL:** http://localhost:3000/proxy-test-sa

**Qué prueba:**
- Server Action estándar con Clean Architecture
- Validación de formularios
- Manejo de errores
- Estados de carga
- Resultados de análisis

**Pasos:**
1. Navega a la URL
2. Sube un archivo de audio (o será generado automáticamente)
3. Opcionalmente, ingresa texto esperado
4. Selecciona el tipo de análisis
5. Haz clic en "Test Server Action"
6. Verifica los resultados

**Resultados esperados:**
```
✅ Analysis Successful
- Analysis ID: analysis_1234567890
- Accuracy: XX%
- Phonemes Detected: XX
- Feedback: [lista de sugerencias]
```

---

### 2. Comparación: `/comparison-sa`

**URL:** http://localhost:3000/comparison-sa

**Qué prueba:**
- Comparación lado a lado de Standard vs Direct Action
- Diferencias de rendimiento
- Diferencias de implementación
- Tabla comparativa de características

**Pasos:**
1. Navega a la URL
2. Prueba la "Standard Action" (lado izquierdo):
   - Sube archivo de audio
   - Configura parámetros
   - Envía el formulario
3. Prueba la "Direct Action" (lado derecho):
   - Sube archivo de audio
   - Configura parámetros
   - Envía el formulario
4. Compara los resultados y tiempos de respuesta

**Resultados esperados:**
- Ambas acciones deben funcionar correctamente
- Standard Action puede ser ligeramente más lenta (más capas)
- Ambas deben retornar datos similares

---

### 3. Debug: `/debug-sa`

**URL:** http://localhost:3000/debug-sa

**Qué prueba:**
- Logging detallado de Server Action
- Inspección de FormData
- Tracking de requests/responses
- Error debugging

**Pasos:**
1. Navega a la URL
2. Sube un archivo de audio
3. Haz clic en "Run Debug Analysis"
4. Revisa la información de debug detallada:
   - 📥 Received Form Data
   - 🎵 Audio File Details
   - 📤 Sent to External API
   - 🌐 External API Response
5. Si hay errores, revisa la sección de Error Details

**Resultados esperados:**
```
Debug Information:
- Received Form Data: [detalles del formulario]
- Audio File: [nombre, tamaño, tipo]
- Sent to API: [datos enviados]
- API Response: [status, headers]
```

---

## 🧪 Test Cases

### Test Case 1: Audio Válido
**Input:**
- Archivo: `test-audio.wav` (válido)
- Expected Text: "Hello World"
- Analysis Type: "pronunciation"

**Expected Output:**
- ✅ success: true
- ✅ accuracy: 60-100%
- ✅ phonemeCount: > 0
- ✅ feedback: array de sugerencias

### Test Case 2: Archivo Inválido
**Input:**
- Archivo: `document.pdf` (no es audio)

**Expected Output:**
- ❌ errors.audio: ["Invalid audio file format"]

### Test Case 3: Archivo Muy Grande
**Input:**
- Archivo: `huge-audio.wav` (> 10MB)

**Expected Output:**
- ❌ errors.\_form: ["Audio file is too large"]

### Test Case 4: Sin Archivo
**Input:**
- No se selecciona archivo

**Expected Output:**
- ❌ errors.audio: ["Audio file is required"]

### Test Case 5: API Externa Caída
**Input:**
- Archivo válido, pero API externa no disponible

**Expected Output:**
- ❌ errors.\_form: ["Cannot connect to external API server"]

---

## 🔍 Verificación de Características

### ✅ Checklist de Funcionalidad

Marca cada item mientras pruebas:

#### Server Actions
- [ ] `analyzeAudioAction()` funciona correctamente
- [ ] `analyzeAudioDirectAction()` funciona correctamente
- [ ] `analyzeAudioDebugAction()` funciona correctamente

#### Validación
- [ ] Validación de archivo de audio funciona
- [ ] Validación de tamaño de archivo funciona
- [ ] Validación de tipo de archivo funciona
- [ ] Validación de campos opcionales funciona

#### Estados UI
- [ ] Loading state se muestra durante procesamiento
- [ ] Botón se deshabilita durante loading
- [ ] Success state se muestra correctamente
- [ ] Error state se muestra correctamente

#### Manejo de Errores
- [ ] Errores de validación se muestran
- [ ] Errores de API se muestran con mensaje claro
- [ ] Errores de permisos se manejan correctamente
- [ ] Stack traces están disponibles en debug mode

#### RBAC
- [ ] Verificación de permisos funciona
- [ ] Mensaje de error correcto si sin permisos
- [ ] Permiso 'phoneme:analyze' se verifica

#### Logging
- [ ] Correlation IDs se generan
- [ ] Logs se escriben en terminal
- [ ] Logs incluyen contexto suficiente
- [ ] Logs de error incluyen stack traces

---

## 🐛 Troubleshooting

### Problema: "Server Action not found"
**Solución:**
- Verifica que el archivo tenga `'use server'` al inicio
- Reinicia el servidor de desarrollo
- Limpia cache: `rm -rf .next`

### Problema: "Permission denied for phoneme analysis"
**Solución:**
- Verifica que `checkResourceAccess()` esté implementado
- Revisa los permisos del usuario en sesión
- Temporalmente, comenta la verificación de permisos para testing

### Problema: "Cannot connect to external API server"
**Solución:**
- Verifica que la API esté corriendo en puerto 5005
- Prueba con: `curl http://localhost:5005/api/health`
- Revisa los logs de la API externa

### Problema: "FormData is undefined"
**Solución:**
- No uses `new FormData()` en el cliente
- El FormData se pasa automáticamente a la Server Action
- Usa `formData.get('fieldName')` en la Server Action

### Problema: Loading state no se actualiza
**Solución:**
- Asegúrate de usar `useFormStatus()` en un componente hijo
- Verifica que el componente con `useFormStatus()` esté dentro del `<form>`

---

## 📊 Métricas de Performance

Durante las pruebas, monitorea:

### Tiempos de Respuesta
- **Standard Action:** ~1-3 segundos (depende de API externa)
- **Direct Action:** ~0.8-2.5 segundos (ligeramente más rápida)
- **Debug Action:** ~1.5-4 segundos (más lenta por logging)

### Network
- **Antes (API Route):** 2 requests (cliente → API Route → API externa)
- **Después (Server Action):** 1 request (cliente → Server Action)

### Tamaño de Respuesta
- Similares entre Standard y Direct Action
- Debug Action incluye información adicional (~1-2KB extra)

---

## 📝 Reportar Problemas

Si encuentras problemas durante las pruebas:

1. **Captura la información:**
   - Navegador y versión
   - Mensaje de error completo
   - Steps to reproduce
   - Screenshots si es posible

2. **Revisa los logs:**
   - Terminal del servidor Next.js
   - Console del navegador
   - Network tab en DevTools

3. **Información de debug:**
   - Usa `/debug-sa` para obtener detalles
   - Copia el JSON de debug info
   - Incluye correlation ID del log

4. **Crea un issue o contacta al equipo**

---

## ✅ Criterios de Éxito

Las pruebas son exitosas si:

- ✅ Todas las páginas de prueba cargan correctamente
- ✅ Las 3 Server Actions funcionan sin errores
- ✅ La validación funciona correctamente
- ✅ Los estados de loading se muestran
- ✅ Los errores se manejan gracefully
- ✅ Los logs incluyen correlation IDs
- ✅ RBAC checks funcionan
- ✅ Los resultados son correctos y consistentes

---

## 🎉 Después de las Pruebas

Una vez completadas las pruebas exitosamente:

1. ✅ Marca los tests como pasados en el proyecto
2. ✅ Documenta cualquier finding o mejora
3. ✅ Comunica al equipo que la migración está verificada
4. ✅ Procede con la migración de componentes legacy

---

**Happy Testing! 🚀**

Si tienes preguntas, consulta:
- `MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md`
- `GUIDE_ARCHITECTURE.md`
- Equipo de Arquitectura
