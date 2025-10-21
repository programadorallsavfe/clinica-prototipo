# 🚀 Guía Rápida de Inicio

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ **Instalar Dependencias**

```bash
cd c:\mounstrocreativo\clinica-prototype\clinica-prototype
npm install
```

### 2️⃣ **Iniciar el Servidor**

```bash
npm run dev
```

### 3️⃣ **Abrir en el Navegador**

```
http://localhost:3000/auth
```

---

## 👥 **Probar el Sistema**

### **Opción 1: Como Recepcionista (Recomendado para empezar)**

1. Ir a `/auth`
2. Login: `recepcion` / `recep123`
3. Explorar:
   - ✅ Crear un nuevo Lead (contacto externo)
   - ✅ Crear un nuevo Paciente (con generación de credenciales)
   - ✅ Crear una Cita
   - ✅ Usar el Cronómetro para medir tiempo de atención

### **Opción 2: Como Paciente**

1. Ir a `/auth`
2. Login: `jperez` / `paciente123`
3. Ver:
   - Dashboard con información personal
   - Historial de citas (vacío al inicio)
   - Perfil y datos

### **Opción 3: Como Administrador**

1. Ir a `/auth`
2. Login: `admin` / `admin123`
3. Acceso completo al sistema

---

## 🎯 **Flujo Típico de Uso**

### **📞 Escenario 1: Cliente Nuevo (Web/WhatsApp)**

**Como Recepcionista:**

1. **Crear Lead**
   - Ir a tab "Leads"
   - Click "Nuevo Lead"
   - Llenar: nombre, teléfono, canal (whatsapp), motivo
   - Guardar

2. **Crear Cotización**
   - Click en "Cotizar" en el lead
   - Seleccionar: especialidad, doctor, fecha, hora, precio
   - Enviar (simula envío por WhatsApp)

3. **Si Acepta → Crear Paciente**
   - Tab "Pacientes"
   - Click "Nuevo Paciente"
   - Llenar datos básicos
   - **El sistema genera automáticamente usuario y contraseña**
   - Copiar credenciales para enviar por WhatsApp

4. **Crear Cita**
   - Tab "Citas del Día"
   - Click "Nueva Cita"
   - Seleccionar paciente, especialidad, doctor, fecha/hora
   - Guardar
   - ✅ **El sistema valida automáticamente**:
     - Disponibilidad del doctor
     - No hay doble booking
     - Horario dentro del rango disponible

### **⏱️ Escenario 2: Atención del Día**

**Como Recepcionista:**

1. Ver "Citas del Día"
2. Cuando el paciente llega:
   - Click "Iniciar" → Se activa el cronómetro
   - Estado cambia a "En curso"
3. Cuando termina la atención:
   - Click "Detener" → Se guarda la duración
   - El médico puede registrar la historia clínica

---

## 🔍 **Funcionalidades Clave**

### ✅ **Cronómetro Automático**

- **Inicia**: Click en botón "Iniciar" (cita pasa a "En curso")
- **Pausar**: Si necesitas interrumpir
- **Detener**: Guarda la duración total en minutos
- **Uso**: Ver estadísticas de tiempos promedio por doctor

### ✅ **Validación de Citas**

El sistema **automáticamente previene**:

- ❌ Doble booking (mismo doctor, horario superpuesto)
- ❌ Citas fuera del horario del doctor
- ❌ Citas en días que el doctor no trabaja

### ✅ **Generación de Credenciales**

Al crear un paciente:

1. El sistema genera automáticamente:
   - **Usuario**: Primera letra del nombre + apellido + número aleatorio
   - **Contraseña**: 8 caracteres aleatorios
2. Se muestra un alert con las credenciales
3. **Copiar y enviar por WhatsApp**

Ejemplo:
```
Usuario: jperez42
Contraseña: AbC12xyz
```

### ✅ **Auditoría Completa**

Todas las acciones quedan registradas:

- Quién hizo la acción
- Qué entidad modificó
- Cuándo lo hizo
- Valores antes y después

Consultar en consola del navegador:
```javascript
JSON.parse(localStorage.getItem('clinica_auditoria'))
```

---

## 🛠️ **Comandos de Desarrollo**

### **Ver todos los datos**

Abrir consola del navegador (F12):

```javascript
// Ver todas las citas
JSON.parse(localStorage.getItem('clinica_citas'))

// Ver todos los pacientes
JSON.parse(localStorage.getItem('clinica_pacientes'))

// Ver usuarios
JSON.parse(localStorage.getItem('clinica_usuarios'))

// Ver sesión actual
JSON.parse(localStorage.getItem('clinica_session'))

// Ver auditoría
JSON.parse(localStorage.getItem('clinica_auditoria'))
```

### **Reiniciar el Sistema**

```javascript
// Eliminar todos los datos
localStorage.clear()

// Recargar la página (se reinicializan datos por defecto)
location.reload()
```

---

## 📊 **Datos de Ejemplo Pre-cargados**

El sistema inicia con:

### **Usuarios**
- Admin: `admin` / `admin123`
- Recepción: `recepcion` / `recep123`
- Doctor: `dr.sanchez` / `doctor123`
- Paciente: `jperez` / `paciente123`

### **Especialidades**
- Medicina General (S/ 80, 30 min)
- Pediatría (S/ 100, 30 min)
- Cardiología (S/ 150, 40 min)
- Dermatología (S/ 120, 25 min)

### **Doctor**
- Dr. Carlos Sánchez López
- CMP: 12345
- Medicina General
- Horarios:
  - Lunes: 9:00-13:00, 15:00-19:00
  - Miércoles: 9:00-13:00
  - Viernes: 9:00-13:00

### **Productos**
- Paracetamol 500mg (Stock: 100, Precio: S/ 10)
- Ibuprofeno 400mg (Stock: 80, Precio: S/ 15)

---

## ⚠️ **Problemas Comunes**

### **1. No se ve la página**

✅ **Solución**:
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Verificar puerto (debe ser 3000)
# Abrir: http://localhost:3000/auth
```

### **2. Error de módulos**

✅ **Solución**:
```bash
# Reinstalar dependencias
rm -rf node_modules
rm package-lock.json
npm install
```

### **3. Los datos no se guardan**

✅ **Causa**: Modo incógnito del navegador  
✅ **Solución**: Usar navegador normal (LocalStorage no funciona en incógnito)

### **4. Ruta no encontrada**

✅ **Rutas válidas**:
- `/auth` - Login
- `/paciente` - Portal del paciente
- `/recepcionista` - Panel de recepción
- `/medico` - Panel médico (en desarrollo)
- `/administrador` - Panel admin (en desarrollo)

---

## 🎓 **Para Desarrolladores**

### **Estructura del Código**

```
lib/
├── types.ts        → Todas las interfaces TypeScript
├── storage.ts      → CRUD de LocalStorage
├── auth.ts         → Login, permisos, sesión
├── validations.ts  → Reglas de negocio
```

### **Agregar una Nueva Entidad**

1. Definir en `lib/types.ts`:
```typescript
export interface MiEntidad {
  id: string;
  nombre: string;
  // ... campos
}
```

2. Crear storage en `lib/storage.ts`:
```typescript
export const miEntidadStorage = new StorageService<MiEntidad>('clinica_mi_entidad');
```

3. Usar en componentes:
```typescript
import { miEntidadStorage } from '@/lib/storage';

// Crear
miEntidadStorage.create({ id: '...', nombre: '...' });

// Leer
const entidad = miEntidadStorage.getById('id');

// Listar
const todas = miEntidadStorage.getAll();

// Actualizar
miEntidadStorage.update('id', { nombre: 'Nuevo nombre' });

// Eliminar
miEntidadStorage.delete('id');
```

---

## 📱 **Próximos Pasos**

1. ✅ **Explorar el módulo de Recepcionista** (completo)
2. ✅ **Probar el cronómetro** en citas
3. ✅ **Crear pacientes** y ver generación de credenciales
4. 🚧 **Esperar módulos de Médico y Admin** (en desarrollo)

---

## 🆘 **Ayuda**

Para entender mejor el sistema:

1. **Leer**: `README_SISTEMA.md` (documentación completa)
2. **Ver código**: `lib/types.ts` (todas las entidades)
3. **Explorar**: Consola del navegador (F12) para ver datos

---

**✨ ¡Listo para empezar!**

Ejecuta `npm run dev` y accede a `http://localhost:3000/auth`
