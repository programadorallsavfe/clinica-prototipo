# Sistema de Gestión de Atenciones Médicas

## Descripción General

Este módulo implementa un sistema completo para la gestión de atenciones médicas con soporte especial para controles de embarazo y etiquetas personalizables. Todos los datos se persisten en `localStorage` para funcionamiento offline.

## Características Principales

### 1. Tipos de Atenciones
- **Consulta**: Primera consulta o consulta general
- **Control**: Seguimiento regular (ideal para controles prenatales)
- **Procedimiento**: Intervenciones o procedimientos médicos
- **Emergencia**: Atenciones urgentes

### 2. Control de Embarazo
El sistema incluye soporte específico para el seguimiento de embarazos con:
- **Fases de control** (1, 2, 3, 4, 5, etc.)
- **Semanas de gestación**
- **Trimestre actual**
- **Fecha última regla (FUR)**
- **Fecha probable de parto (FPP)**
- **Próximo control programado**
- **Observaciones específicas**

### 3. Etiquetas Personalizables
Cada atención puede tener múltiples etiquetas que facilitan:
- Búsqueda y filtrado rápido
- Categorización visual
- Identificación de patrones de atención

### 4. Estados de Atención
- `programada`: Cita agendada pero no realizada
- `en_curso`: Atención actualmente en progreso
- `atendida`: Atención completada exitosamente
- `cancelada`: Atención cancelada
- `no_asiste`: Paciente no asistió a la cita

## Estructura de Datos

### AtencionMedica Interface

```typescript
interface AtencionMedica {
  id: string
  numero: string // Número de atención (ej: "15798")
  pacienteId: string
  tipo: string // Descripción del tipo de atención
  tipoCategoria?: 'consulta' | 'control' | 'procedimiento' | 'emergencia'
  fecha: string
  hora: string
  profesional: string
  profesionalId?: string
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada' | 'no_asiste'
  recurso: string // Consultorio, sala, equipo
  sucursal: string
  convenio: string
  progreso: number // 0-100
  totalAtenciones: number // Total de atenciones en el plan
  atencionActual: number // Número de atención actual
  
  // Control de embarazo (opcional)
  controlEmbarazo?: {
    fase: number
    semanas?: number
    trimestre?: 1 | 2 | 3
    fechaUltimaRegla?: string
    fechaProbableParto?: string
    proximoControl?: string
    observaciones?: string
  }
  
  // Etiquetas personalizables
  etiquetas?: string[]
  
  // Información clínica
  evolucionClinica?: string
  ordenesMedicas?: OrdenMedica[]
  prescripciones?: Prescripcion[]
  
  // Metadatos
  fechaCreacion: string
  creadoPor?: string
}
```

## Uso del Sistema

### 1. Inicializar Datos de Ejemplo

```typescript
import { initializeAtencionesData } from '@/lib/storage';

// En useEffect o al inicio de la aplicación
useEffect(() => {
  initializeAtencionesData();
}, []);
```

### 2. Obtener Atenciones de un Paciente

```typescript
import { getAtencionesByPaciente, getAtencionesHoy, getAtencionesRecientes } from '@/lib/storage';

// Todas las atenciones del paciente
const todasLasAtenciones = getAtencionesByPaciente(pacienteId);

// Atenciones de hoy
const atencionesHoy = getAtencionesHoy(pacienteId);

// Atenciones recientes (últimos 30 días)
const recientes = getAtencionesRecientes(pacienteId, 30);
```

### 3. Crear Nueva Atención

```typescript
import { atencionesStorage } from '@/lib/storage';

const nuevaAtencion: Omit<AtencionMedica, 'id'> = {
  numero: '15825',
  pacienteId: '1',
  tipo: 'Control Prenatal - Fase 4',
  tipoCategoria: 'control',
  fecha: '15 DIC 2025',
  hora: '10:00 hrs',
  profesional: 'DR. JOSE CARLOS CASTILLO',
  estado: 'programada',
  recurso: 'Consultorio 2',
  sucursal: 'FEMINIS SALUD',
  convenio: 'Sin convenio',
  progreso: 0,
  totalAtenciones: 5,
  atencionActual: 4,
  controlEmbarazo: {
    fase: 4,
    semanas: 22,
    trimestre: 2,
    proximoControl: '15 ENE 2026',
    observaciones: 'Control prenatal rutinario'
  },
  etiquetas: ['Control prenatal', 'Trimestre 2', 'Fase 4'],
  fechaCreacion: new Date().toISOString(),
  creadoPor: 'admin'
};

atencionesStorage.create(nuevaAtencion as AtencionMedica);
```

### 4. Actualizar Estado de Atención

```typescript
import { atencionesStorage } from '@/lib/storage';

// Marcar atención como completada
atencionesStorage.update(atencionId, {
  estado: 'atendida',
  progreso: 100
});
```

## Componente AtencionCard

El componente `AtencionCard` proporciona una visualización elegante y consistente de las atenciones médicas:

```typescript
import { AtencionCard } from '@/components/atencion-card';

<AtencionCard
  atencion={atencionData}
  pacienteId={pacienteId}
  onClick={() => handleAtencionClick(atencionData.id)}
  className="custom-class" // opcional
/>
```

### Características del Componente:
- ✅ Borde lateral colorido según el estado
- ✅ Badge de estado con iconos
- ✅ Información de control de embarazo destacada
- ✅ Etiquetas personalizables
- ✅ Círculo de progreso visual
- ✅ Animaciones suaves al hover
- ✅ Responsive design
- ✅ Accesibilidad completa

## Estilos y Diseño

El sistema utiliza las variables CSS definidas en `globals.css`:
- **Colores por rol**: `primary`, `success`, `warning`, `info`, `destructive`
- **Espaciado consistente**: Sistema de espaciado `--spacing`
- **Bordes redondeados**: `rounded-2xl` por defecto
- **Animaciones suaves**: Duraciones de 200-260ms
- **Temas claro/oscuro**: Soporte completo

## Ejemplos de Uso

### Ejemplo 1: Control Prenatal Completo

```typescript
{
  numero: '15798',
  pacienteId: '1',
  tipo: 'Examen ECOGRAFIA OBSTETRICA',
  tipoCategoria: 'control',
  fecha: '18 OCT 2025',
  hora: '09:30 hrs',
  profesional: 'DR. JOSE CARLOS CASTILLO',
  estado: 'atendida',
  progreso: 100,
  totalAtenciones: 5,
  atencionActual: 2,
  controlEmbarazo: {
    fase: 2,
    semanas: 14,
    trimestre: 2,
    fechaUltimaRegla: '15 JUL 2025',
    fechaProbableParto: '22 ABR 2026',
    proximoControl: '15 NOV 2025',
    observaciones: 'Control prenatal trimestre 2 - Ecografía morfológica'
  },
  etiquetas: ['Control prenatal', 'Trimestre 2', 'Ecografía']
}
```

### Ejemplo 2: Consulta General

```typescript
{
  numero: '15794',
  pacienteId: '1',
  tipo: 'Consulta Ginecológica',
  tipoCategoria: 'consulta',
  fecha: '18 OCT 2025',
  hora: '08:00 hrs',
  profesional: 'DR. JOSE CARLOS CASTILLO',
  estado: 'atendida',
  progreso: 100,
  totalAtenciones: 1,
  atencionActual: 1,
  etiquetas: ['Primera consulta', 'Confirmación embarazo']
}
```

## Integración con la Aplicación

### Página de Ficha del Paciente

La página `/administrador/pacientes/[id]/ficha` muestra:
1. **Atenciones de hoy**: Citas programadas para el día actual
2. **Atenciones recientes**: Historial de los últimos 30 días
3. **Navegación**: Click en cualquier tarjeta para ver detalles completos

### Flujo de Navegación

```
/administrador/pacientes/[id]/ficha
  └─> Click en AtencionCard
      └─> /administrador/pacientes/[id]/ficha/atencion/[atencionId]
```

## Mejores Prácticas

### 1. Consistencia en Datos
- Usar siempre el formato de fecha "DD MMM YYYY" (ej: "18 OCT 2025")
- Usar formato de hora "HH:MM hrs" (ej: "09:30 hrs")
- Mantener la numeración de atenciones correlativa

### 2. Etiquetas
- Usar máximo 3-4 etiquetas por atención
- Mantener nombres cortos y descriptivos
- Ser consistente con la nomenclatura

### 3. Control de Embarazo
- Actualizar siempre la fase y semanas en cada control
- Mantener la FUR y FPP consistentes
- Programar el próximo control en cada visita

### 4. Estados
- Actualizar el estado según el flujo real de atención
- Mantener el progreso sincronizado con el estado
- Registrar fechas de actualización

## Funcionalidades Futuras

- [ ] Recordatorios automáticos de próximos controles
- [ ] Gráficas de evolución del embarazo
- [ ] Exportación de reportes en PDF
- [ ] Notificaciones push para citas
- [ ] Integración con calendario
- [ ] Búsqueda y filtros avanzados
- [ ] Estadísticas de atenciones por periodo

## Soporte y Mantenimiento

Para reportar problemas o sugerir mejoras, contactar al equipo de desarrollo.

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0
