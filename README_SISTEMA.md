# 🏥 Sistema de Gestión Clínica - Prototype

Sistema integral de gestión para clínicas médicas con control de pacientes, citas, historia clínica, inventario y facturación. **Completamente funcional con LocalStorage** (sin base de datos externa).

## 📋 Características Principales

### ✅ **Sistema Implementado**

#### 🔐 **Autenticación y Permisos (ACL)**
- Login con usuario y contraseña
- Recuperación de contraseña simulada
- Control de sesión con timeout (30 min inactividad)
- Sistema de permisos por rol (CRUD granular)
- Auditoría completa de acciones

#### 👥 **4 Roles del Sistema**

1. **Paciente (Cliente)**
   - Dashboard con próxima cita
   - Historial completo de citas
   - Vista de resultados y recetas (solo información pública)
   - Gestión de perfil personal
   - Órdenes y comprobantes

2. **Recepcionista**
   - Gestión de leads (contactos externos)
   - Creación de cotizaciones manuales
   - Gestión completa de citas
   - **Cronómetro para control de tiempo** de atención
   - Registro de pagos externos (Yape/otros)
   - Creación de pacientes con generación automática de credenciales
   - Ventas auxiliares (medicamentos/exámenes)

3. **Médico** *(Estructura implementada, UI en desarrollo)*
   - Agenda personal del día/semana
   - Historia clínica completa del paciente
   - Registro durante la cita (diagnóstico, recetas, indicaciones)
   - Control de visibilidad (público/privado)
   - Plantillas rápidas de recetas e indicaciones
   - Órdenes de exámenes

4. **Administrador** *(Estructura implementada, UI en desarrollo)*
   - Configuración del sistema
   - Gestión de especialidades, doctores, consultorios
   - Control de inventario (medicamentos/insumos)
   - Reportes y métricas (embudo, tiempos, ingresos)
   - Auditoría completa del sistema
   - Gestión de permisos

---

## 🎯 Funcionalidades Core

### ✅ **Implementadas**

#### **Gestión de Citas**
- Creación con validación de disponibilidad del doctor
- **Validación de double-booking** (evita citas superpuestas)
- Estados: Programada → En curso → Atendida / Cancelada / No asistió
- **Cronómetro integrado** para medir tiempo real de atención
- Control de pagos (Pendiente, Pagado, Externo validado)

#### **Historia Clínica Digital**
- Registro completo: motivo, diagnóstico, signos vitales
- Recetas con posología detallada
- Indicaciones post-consulta
- Órdenes de exámenes
- **Visibilidad configurable**: público (paciente ve) vs privado (solo médico)
- Sistema de adjuntos (PDFs, imágenes)
- **Bloqueo de edición** al cerrar el registro

#### **Inventario Inteligente**
- Productos: medicamentos, exámenes, insumos
- Control de stock en tiempo real
- **Descuento automático** al confirmar pago de orden
- Alertas de stock bajo
- Control de lotes y fechas de vencimiento
- Movimientos de inventario con trazabilidad

#### **Sistema de Cotizaciones**
- Creación desde leads de contacto
- Fecha de caducidad automática (7 días)
- Estados: Enviada → Aceptada / Rechazada / Vencida
- **Conversión a cita en un clic**
- Simulación de envío por WhatsApp

#### **Auditoría Completa**
- Log de todas las acciones (quién, qué, cuándo)
- Registro de cambios en entidades
- Control de versiones en historia clínica
- Trazabilidad de inventario

---

## 🚀 Instalación y Uso

### **Requisitos**
- Node.js 18+
- npm o yarn

### **Instalación**

```bash
# Clonar o ubicarse en el directorio del proyecto
cd c:\mounstrocreativo\clinica-prototype\clinica-prototype

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### **Acceso**

Abrir el navegador en: `http://localhost:3000`

**Ruta de Login**: `/auth`

---

## 👤 Usuarios de Prueba

| Rol | Usuario | Contraseña | Ruta |
|-----|---------|------------|------|
| **Administrador** | `admin` | `admin123` | `/administrador` |
| **Recepcionista** | `recepcion` | `recep123` | `/recepcionista` |
| **Médico** | `dr.sanchez` | `doctor123` | `/medico` |
| **Paciente** | `jperez` | `paciente123` | `/paciente` |

---

## 📊 Datos Inicializados

El sistema se inicializa automáticamente con:

✅ 4 usuarios (uno por cada rol)  
✅ 1 paciente de ejemplo  
✅ 1 doctor (Dr. Carlos Sánchez, Medicina General)  
✅ 4 especialidades (Medicina General, Pediatría, Cardiología, Dermatología)  
✅ 2 consultorios  
✅ 2 productos de inventario (Paracetamol, Ibuprofeno)  
✅ Plantillas de WhatsApp (cotizaciones, recordatorios)  
✅ Permisos por defecto (ACL)

---

## 🔑 Validaciones y Reglas de Negocio

### ✅ **Citas**
- ❌ **No doble booking**: Evita citas superpuestas del mismo doctor
- ✅ **Validación de disponibilidad**: Verifica horarios del doctor
- ⏱️ **Cronómetro obligatorio**: Requiere iniciar/detener para cambiar estados
- 📋 **Registro clínico obligatorio**: No se puede cerrar cita sin diagnóstico

### ✅ **Inventario**
- 📦 **Solo descuenta stock** cuando orden pasa a estado "Pagado"
- ⚠️ **Alertas automáticas** de stock bajo y productos próximos a vencer
- 🔒 **Validación de stock disponible** antes de crear órdenes
- 📝 **Trazabilidad completa** de movimientos

### ✅ **Historia Clínica**
- 🔒 **Inmutable**: Registros cerrados no pueden editarse
- 👁️ **Visibilidad controlada**: Paciente solo ve información pública
- 📋 **Campos obligatorios**: Motivo y diagnóstico para cerrar

### ✅ **Cotizaciones**
- ⏰ **Caducidad automática** (7 días)
- 🔄 **Conversión directa** a cita si es aceptada
- ❌ **Estados finales** no se pueden modificar

---

## 🏗️ Arquitectura del Sistema

### **Estructura de Archivos**

```
lib/
├── types.ts              # 📝 Definición de todas las entidades
├── storage.ts            # 💾 Servicio de LocalStorage (CRUD)
├── auth.ts               # 🔐 Autenticación y permisos (ACL)
├── validations.ts        # ✅ Reglas de negocio y validaciones
└── utils.ts              # 🛠️ Utilidades generales

components/
├── cronometro.tsx        # ⏱️ Control de tiempo de citas
├── data-table.tsx        # 📊 Tabla con paginación y ordenamiento
├── filtros.tsx           # 🔍 Componente de filtros reutilizable
└── ui/                   # 🎨 Componentes de shadcn/ui

app/
├── auth/                 # 🔐 Login y recuperación
├── paciente/             # 👤 Portal del paciente
├── recepcionista/        # 📋 Gestión de citas y leads
├── medico/               # 👨‍⚕️ Atención clínica (en desarrollo)
└── administrador/        # ⚙️ Administración (en desarrollo)
```

### **Servicios de Storage**

Todos los datos se gestionan mediante servicios type-safe:

```typescript
// Ejemplos de uso
citasStorage.create(nuevaCita)
pacientesStorage.getById(id)
productosStorage.find(p => p.stockActual < p.stockMinimo)
auditoriaStorage.getAll()
```

---

## 🎨 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Iconos**: Lucide React
- **Storage**: LocalStorage (persistencia del lado del cliente)
- **Validaciones**: Custom validators con TypeScript

---

## 📈 Reportes Disponibles *(En desarrollo)*

El sistema está preparado para generar:

- 📊 **Embudo de conversión**: Leads → Cotizaciones → Citas → Atendidas
- ⏱️ **Tiempos promedio**: Por doctor, especialidad y turno
- 📅 **No shows y cancelaciones**: Tasas y tendencias
- 💰 **Ingresos**: Por especialidad, doctor, método de pago
- 📦 **Inventario**: Rotación, ventas, quiebres de stock

---

## 🔮 Próximos Pasos

### **Módulos a Completar**

1. **Médico - UI Completa**
   - Agenda visual (calendario)
   - Editor de historia clínica con todas las funciones
   - Plantillas de recetas e indicaciones
   - Vista de pacientes del día

2. **Administrador - UI Completa**
   - Dashboard con métricas
   - Gestión de especialidades y doctores
   - Control de inventario con gráficos
   - Reportes interactivos
   - Gestión de permisos

3. **Integraciones** *(Opcional)*
   - API de WhatsApp (envío real de mensajes)
   - Integración con Yape (validación de pagos)
   - Email para notificaciones
   - Generación de PDFs (recetas, comprobantes)

4. **Mejoras**
   - Exportación de datos (Excel, CSV)
   - Impresión de recetas y órdenes
   - Calendario interactivo para agendar citas
   - Notificaciones en tiempo real

---

## 🛡️ Seguridad

⚠️ **NOTA IMPORTANTE**: Este es un **prototipo educativo**. En producción:

- 🔐 Hashear contraseñas (bcrypt)
- 🔑 Usar JWT para autenticación
- 🗄️ Migrar a base de datos real (PostgreSQL, MySQL)
- 🔒 Implementar HTTPS
- 🛡️ Validación y sanitización de inputs
- 📝 Logs de seguridad
- 🚫 Rate limiting

---

## 📝 Licencia

Este proyecto es un prototipo educativo.

---

## 👨‍💻 Desarrollo

### **Comandos Útiles**

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm start

# Linter
npm run lint

# Reiniciar todos los datos
# (En consola del navegador)
localStorage.clear()
```

### **Resetear Datos**

Para reiniciar el sistema a su estado inicial, ejecutar en la consola del navegador:

```javascript
localStorage.clear()
location.reload()
```

---

## ✅ Estado del Proyecto

| Módulo | Estado | Completado |
|--------|--------|------------|
| **Tipos y Entidades** | ✅ Completo | 100% |
| **Storage Services** | ✅ Completo | 100% |
| **Autenticación** | ✅ Completo | 100% |
| **Validaciones** | ✅ Completo | 100% |
| **UI Components** | ✅ Completo | 100% |
| **Paciente** | ✅ Completo | 100% |
| **Recepcionista** | ✅ Completo | 95% |
| **Médico** | 🚧 En progreso | 40% |
| **Administrador** | 🚧 En progreso | 30% |
| **Reportes** | 🚧 Pendiente | 20% |
| **Notificaciones** | 🚧 Pendiente | 10% |

---

## 🎯 Características Destacadas

✅ **100% funcional sin backend** (LocalStorage)  
✅ **Validación de double-booking**  
✅ **Cronómetro integrado para citas**  
✅ **Control de inventario automático**  
✅ **Sistema de permisos granular (ACL)**  
✅ **Auditoría completa**  
✅ **Historia clínica con visibilidad configurable**  
✅ **Generación automática de credenciales**  
✅ **Cotizaciones con conversión a cita**  

---

## 📞 Soporte

Para dudas o sugerencias sobre el sistema:

- Revisar el código en `lib/` para entender la lógica de negocio
- Verificar las validaciones en `lib/validations.ts`
- Consultar los tipos en `lib/types.ts`

---

**🏥 Sistema de Gestión Clínica - Prototype v1.0**
