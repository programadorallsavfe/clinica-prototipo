# Estructura de Datos Centralizados

## Archivo: `mockData.ts`

Este archivo centraliza toda la información de pacientes y citas de la aplicación, proporcionando una fuente única de verdad para ambas vistas (pacientes y agendas).

### Estructuras de Datos

#### `Paciente`
Interface que define la estructura completa de un paciente, incluyendo:
- **Información básica**: ID, nombre, apellidos, documento, teléfono, email
- **Datos médicos**: atenciones, especialidad, doctor, consultorio
- **Estado financiero**: deuda, saldo, estado de cuenta, pagos
- **Información adicional**: verificación, origen, fechas de actualización
- **Campos del formulario**: extranjero, convenio, sexo, fecha de nacimiento, etc.

#### `Cita`
Interface que define la estructura de una cita médica:
- **Identificación**: ID único y referencia al paciente
- **Programación**: hora, fecha
- **Atención**: doctor, tipo (Consulta/Examen), especialidad
- **Estado**: programada, confirmada, en espera, atendida, etc.
- **Situación**: pagada, no pagada, parcial
- **Información adicional**: fecha de llegada, observaciones, monto

### Funciones Utilitarias

#### `getPacienteById(id: number)`
Retorna un paciente específico por su ID.

#### `getCitasByPacienteId(pacienteId: number)`
Retorna todas las citas de un paciente específico.

#### `getCitasByFecha(fecha: string)`
Retorna todas las citas de una fecha específica.

#### `getCitasWithPacienteInfo(fecha?: string)`
Retorna citas con información completa del paciente incluida.

#### `getKPIs()`
Calcula y retorna los KPIs principales del sistema:
- Total de pacientes
- Pacientes activos y verificados
- Estadísticas de citas
- Ingresos del mes

#### `getEstadisticasAgenda(fecha?: string)`
Calcula estadísticas específicas para la agenda:
- Total de citas
- Citas atendidas, en espera, confirmadas
- Pendientes y anulaciones

### Uso en las Vistas

#### Página de Pacientes (`/administrador/pacientes`)
```typescript
import { pacientesData, getKPIs } from '@/lib/mockData';

// KPIs calculados automáticamente
const kpis = getKPIs();

// Lista de pacientes
const pacientes = pacientesData;
```

#### Página de Agendas (`/administrador/agendas`)
```typescript
import { citasData, getEstadisticasAgenda, getCitasWithPacienteInfo } from '@/lib/mockData';

// Estadísticas de la agenda
const estadisticas = getEstadisticasAgenda(fecha);

// Citas con información de pacientes
const citas = getCitasWithPacienteInfo(fecha);
```

### Ventajas de esta Estructura

1. **Consistencia**: Una sola fuente de verdad para todos los datos
2. **Mantenibilidad**: Cambios en un solo lugar se reflejan en toda la aplicación
3. **Escalabilidad**: Fácil agregar nuevas funciones y campos
4. **Reutilización**: Las funciones utilitarias pueden ser usadas en cualquier componente
5. **Tipado**: TypeScript garantiza la consistencia de tipos en toda la aplicación

### Futuras Mejoras

- Integración con API real
- Persistencia en base de datos
- Cache de datos
- Sincronización en tiempo real
- Validaciones de datos más robustas
