'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Columna } from '@/components/data-table';
import { 
  FileText, Search, Filter, Eye, Edit, Plus, Download, Copy, 
  Trash2, RefreshCw, File, FileImage, FileSpreadsheet, FileCode,
  Calendar, User, Stethoscope, HeartPulse, Pill, FlaskConical,
  Activity, AlertTriangle, CheckCircle, XCircle, Settings
} from 'lucide-react';

// Tipo para las plantillas de documentos
interface Plantilla {
  id: string;
  nombre: string;
  tipo: 'receta' | 'indicaciones' | 'historia' | 'orden' | 'certificado' | 'control' | 'referencia';
  categoria: string;
  descripcion: string;
  contenido: string;
  fechaCreacion: string;
  fechaModificacion: string;
  creadoPor: string;
  modificadoPor: string;
  estado: 'activa' | 'inactiva';
  usoFrecuente: boolean;
  tags: string[];
}

// Mock data para plantillas de documentos
const plantillasMock = [
  {
    id: '1',
    nombre: 'Receta Médica Estándar',
    tipo: 'receta',
    categoria: 'Medicamentos',
    descripcion: 'Plantilla estándar para prescripción de medicamentos con posología detallada',
    contenido: `RECETA MÉDICA

Paciente: [NOMBRE_PACIENTE]
Documento: [DOCUMENTO]
Fecha: [FECHA]
Médico: [NOMBRE_MEDICO]
CMP: [CMP]

Medicamentos:
1. [MEDICAMENTO_1] - [DOSIS] - [FRECUENCIA] - [DURACION]
2. [MEDICAMENTO_2] - [DOSIS] - [FRECUENCIA] - [DURACION]

Indicaciones:
- [INDICACIONES_ESPECIALES]

Próxima cita: [PROXIMA_CITA]

Firma: _________________
Dr. [NOMBRE_MEDICO]`,
    fechaCreacion: '2024-01-15',
    fechaModificacion: '2024-10-20',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: true,
    tags: ['medicamentos', 'posología', 'receta']
  },
  {
    id: '2',
    nombre: 'Indicaciones Post-Operatorio',
    tipo: 'indicaciones',
    categoria: 'Cirugía',
    descripcion: 'Plantilla para indicaciones post-operatorias generales',
    contenido: `INDICACIONES POST-OPERATORIAS

Paciente: [NOMBRE_PACIENTE]
Procedimiento: [PROCEDIMIENTO]
Fecha de cirugía: [FECHA_CIRUGIA]
Cirujano: [NOMBRE_CIRUJANO]

CUIDADOS GENERALES:
- Reposo relativo por [DIAS_REPOSO] días
- No levantar peso mayor a [PESO_LIMITE] kg
- Mantener herida limpia y seca
- Cambio de vendaje cada [FRECUENCIA_VENDAJE]

MEDICAMENTOS:
- Analgésicos: [ANALGESICO] cada [FRECUENCIA_ANALGESICO]
- Antibióticos: [ANTIBIOTICO] cada [FRECUENCIA_ANTIBIOTICO]

SEÑALES DE ALARMA:
- Fiebre > 38°C
- Dolor intenso no controlado
- Enrojecimiento o secreción de la herida

Control: [FECHA_CONTROL]`,
    fechaCreacion: '2024-02-10',
    fechaModificacion: '2024-09-15',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: true,
    tags: ['cirugía', 'post-operatorio', 'cuidados']
  },
  {
    id: '3',
    nombre: 'Historia Clínica Ginecológica',
    tipo: 'historia',
    categoria: 'Ginecología',
    descripcion: 'Plantilla completa para historia clínica ginecológica',
    contenido: `HISTORIA CLÍNICA GINECOLÓGICA

DATOS PERSONALES:
Nombre: [NOMBRE_PACIENTE]
Edad: [EDAD] años
Documento: [DOCUMENTO]
Estado civil: [ESTADO_CIVIL]
Ocupación: [OCUPACION]

ANTECEDENTES GINECOLÓGICOS:
Menarquia: [EDAD_MENARQUIA] años
Ciclo menstrual: [CICLO_MENSTRUAL]
Última menstruación: [ULTIMA_MENSTRUACION]
Gestaciones: [NUMERO_GESTACIONES]
Partos: [NUMERO_PARTOS]
Abortos: [NUMERO_ABORTOS]
Cesáreas: [NUMERO_CESAREAS]

ANTECEDENTES OBSTÉTRICOS:
[ANTECEDENTES_OBSTETRICOS]

EXAMEN FÍSICO:
Peso: [PESO] kg
Talla: [TALLA] cm
IMC: [IMC]
Presión arterial: [PRESION_ARTERIAL]
Frecuencia cardíaca: [FRECUENCIA_CARDIACA]

EXAMEN GINECOLÓGICO:
[EXAMEN_GINECOLOGICO]

DIAGNÓSTICO:
[DIAGNOSTICO]

PLAN DE TRATAMIENTO:
[PLAN_TRATAMIENTO]`,
    fechaCreacion: '2024-01-20',
    fechaModificacion: '2024-10-15',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: true,
    tags: ['ginecología', 'historia', 'obstetricia']
  },
  {
    id: '4',
    nombre: 'Orden de Exámenes de Laboratorio',
    tipo: 'orden',
    categoria: 'Laboratorio',
    descripcion: 'Plantilla para solicitud de exámenes de laboratorio',
    contenido: `ORDEN DE EXÁMENES DE LABORATORIO

Paciente: [NOMBRE_PACIENTE]
Documento: [DOCUMENTO]
Edad: [EDAD] años
Fecha: [FECHA]
Médico: [NOMBRE_MEDICO]
CMP: [CMP]

EXÁMENES SOLICITADOS:
□ Hemograma completo
□ Glicemia en ayunas
□ Perfil lipídico
□ Función renal (creatinina, BUN)
□ Función hepática (TGO, TGP, bilirrubina)
□ Perfil tiroideo (TSH, T3, T4)
□ Examen general de orina
□ Coprológico
□ Otros: [OTROS_EXAMENES]

INDICACIONES ESPECIALES:
- Ayuno de 12 horas para perfil lipídico
- [INDICACIONES_ESPECIALES]

Diagnóstico presuntivo: [DIAGNOSTICO_PRESUNTIVO]

Firma: _________________
Dr. [NOMBRE_MEDICO]`,
    fechaCreacion: '2024-03-05',
    fechaModificacion: '2024-08-20',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: false,
    tags: ['laboratorio', 'exámenes', 'sangre']
  },
  {
    id: '5',
    nombre: 'Certificado Médico',
    tipo: 'certificado',
    categoria: 'Certificados',
    descripcion: 'Plantilla para certificados médicos generales',
    contenido: `CERTIFICADO MÉDICO

Por medio del presente certifico que la señorita/señora [NOMBRE_PACIENTE], 
identificada con DNI N° [DOCUMENTO], de [EDAD] años de edad, se encuentra 
bajo mi atención médica.

DIAGNÓSTICO: [DIAGNOSTICO]

RECOMENDACIONES MÉDICAS:
- [RECOMENDACION_1]
- [RECOMENDACION_2]
- [RECOMENDACION_3]

TIEMPO DE REPOSO: [TIEMPO_REPOSO] días

El presente certificado es válido por 30 días a partir de la fecha de emisión.

Lima, [FECHA]

_________________
Dr. [NOMBRE_MEDICO]
CMP: [CMP]`,
    fechaCreacion: '2024-02-28',
    fechaModificacion: '2024-07-10',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: false,
    tags: ['certificado', 'reposo', 'justificación']
  },
  {
    id: '6',
    nombre: 'Control Prenatal',
    tipo: 'control',
    categoria: 'Obstetricia',
    descripcion: 'Plantilla para control prenatal de embarazadas',
    contenido: `CONTROL PRENATAL

Paciente: [NOMBRE_PACIENTE]
Documento: [DOCUMENTO]
Edad: [EDAD] años
Fecha: [FECHA]
Semana de gestación: [SEMANA_GESTACION]

ANTECEDENTES:
Gestaciones previas: [GESTACIONES_PREVIAS]
Partos previos: [PARTOS_PREVIOS]
Abortos: [ABORTOS]

EXAMEN FÍSICO:
Peso: [PESO] kg
Talla: [TALLA] cm
IMC: [IMC]
Presión arterial: [PRESION_ARTERIAL]
Altura uterina: [ALTURA_UTERINA] cm
FCF: [FCF] lpm

EXÁMENES:
□ Hemograma
□ Glicemia
□ VDRL
□ VIH
□ Grupo sanguíneo
□ Ecografía obstétrica

MEDICAMENTOS:
- Ácido fólico: [DOSIS_ACIDO_FOLICO]
- Hierro: [DOSIS_HIERRO]
- Calcio: [DOSIS_CALCIO]

PRÓXIMO CONTROL: [PROXIMO_CONTROL]

Firma: _________________
Dr. [NOMBRE_MEDICO]`,
    fechaCreacion: '2024-01-30',
    fechaModificacion: '2024-10-10',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: true,
    tags: ['prenatal', 'embarazo', 'obstetricia']
  },
  {
    id: '7',
    nombre: 'Referencia Médica',
    tipo: 'referencia',
    categoria: 'Referencias',
    descripcion: 'Plantilla para referencias médicas a especialistas',
    contenido: `REFERENCIA MÉDICA

Para: Dr. [ESPECIALISTA]
Especialidad: [ESPECIALIDAD]
Institución: [INSTITUCION]

Paciente: [NOMBRE_PACIENTE]
Documento: [DOCUMENTO]
Edad: [EDAD] años
Teléfono: [TELEFONO]

MOTIVO DE REFERENCIA:
[MOTIVO_REFERENCIA]

ANTECEDENTES:
[ANTECEDENTES_PACIENTE]

EXAMEN FÍSICO ACTUAL:
[EXAMEN_FISICO]

EXÁMENES REALIZADOS:
[EXAMENES_REALIZADOS]

DIAGNÓSTICO PRESUNTIVO:
[DIAGNOSTICO_PRESUNTIVO]

TRATAMIENTO INICIADO:
[TRATAMIENTO_INICIADO]

CONSULTA SOLICITADA:
[CONSULTA_SOLICITADA]

Urgencia: [URGENCIA]

Lima, [FECHA]

_________________
Dr. [NOMBRE_MEDICO]
CMP: [CMP]
Teléfono: [TELEFONO_MEDICO]`,
    fechaCreacion: '2024-04-12',
    fechaModificacion: '2024-09-05',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'activa',
    usoFrecuente: false,
    tags: ['referencia', 'especialista', 'derivación']
  },
  {
    id: '8',
    nombre: 'Plantilla Inactiva',
    tipo: 'receta',
    categoria: 'Medicamentos',
    descripcion: 'Plantilla desactivada para pruebas',
    contenido: 'Contenido de plantilla inactiva',
    fechaCreacion: '2024-01-01',
    fechaModificacion: '2024-01-01',
    creadoPor: 'Dr. Carlos Sánchez',
    modificadoPor: 'Dr. Carlos Sánchez',
    estado: 'inactiva',
    usoFrecuente: false,
    tags: ['inactiva', 'prueba']
  }
];

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState(plantillasMock);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<Plantilla | null>(null);
  const [showDetallePlantilla, setShowDetallePlantilla] = useState(false);
  const [showNuevaPlantilla, setShowNuevaPlantilla] = useState(false);

  // Filtrar plantillas
  const plantillasFiltradas = plantillas.filter(plantilla => {
    const cumpleTipo = filtroTipo === 'todos' || plantilla.tipo === filtroTipo;
    const cumpleCategoria = filtroCategoria === 'todos' || plantilla.categoria === filtroCategoria;
    const cumpleEstado = filtroEstado === 'todos' || plantilla.estado === filtroEstado;
    
    if (!cumpleTipo || !cumpleCategoria || !cumpleEstado) return false;
    
    if (filtroBusqueda) {
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        plantilla.nombre.toLowerCase().includes(textoBusqueda) ||
        plantilla.descripcion.toLowerCase().includes(textoBusqueda) ||
        plantilla.categoria.toLowerCase().includes(textoBusqueda) ||
        plantilla.tags.some((tag: string) => tag.toLowerCase().includes(textoBusqueda))
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: plantillas.length,
    activas: plantillas.filter(p => p.estado === 'activa').length,
    inactivas: plantillas.filter(p => p.estado === 'inactiva').length,
    usoFrecuente: plantillas.filter(p => p.usoFrecuente).length,
    recetas: plantillas.filter(p => p.tipo === 'receta').length,
    historias: plantillas.filter(p => p.tipo === 'historia').length,
    ordenes: plantillas.filter(p => p.tipo === 'orden').length,
    certificados: plantillas.filter(p => p.tipo === 'certificado').length
  };

  const getIconoTipo = (tipo: string) => {
    const iconos: Record<string, React.ReactNode> = {
      receta: <Pill className="h-4 w-4" />,
      indicaciones: <FileText className="h-4 w-4" />,
      historia: <Stethoscope className="h-4 w-4" />,
      orden: <FlaskConical className="h-4 w-4" />,
      certificado: <File className="h-4 w-4" />,
      control: <HeartPulse className="h-4 w-4" />,
      referencia: <FileCode className="h-4 w-4" />,
    };
    return iconos[tipo] || <FileText className="h-4 w-4" />;
  };

  const getColorTipo = (tipo: string) => {
    const colores: Record<string, string> = {
      receta: 'bg-green-100 text-green-800',
      indicaciones: 'bg-blue-100 text-blue-800',
      historia: 'bg-purple-100 text-purple-800',
      orden: 'bg-orange-100 text-orange-800',
      certificado: 'bg-yellow-100 text-yellow-800',
      control: 'bg-pink-100 text-pink-800',
      referencia: 'bg-indigo-100 text-indigo-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  };

  const columnas: Columna<Plantilla>[] = [
    {
      key: 'nombre',
      titulo: 'Nombre',
      render: (plantilla: Plantilla) => (
        <div className="flex items-center gap-2">
          {getIconoTipo(plantilla.tipo)}
          <div>
            <div className="font-medium">{plantilla.nombre}</div>
            <div className="text-xs text-muted-foreground">{plantilla.categoria}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      titulo: 'Tipo',
      render: (plantilla: Plantilla) => (
        <Badge className={getColorTipo(plantilla.tipo)}>
          {plantilla.tipo}
        </Badge>
      ),
    },
    {
      key: 'descripcion',
      titulo: 'Descripción',
      render: (plantilla: Plantilla) => (
        <div className="max-w-xs">
          <p className="text-sm truncate">{plantilla.descripcion}</p>
        </div>
      ),
    },
    {
      key: 'usoFrecuente',
      titulo: 'Uso Frecuente',
      render: (plantilla: Plantilla) => (
        <div className="flex items-center gap-1">
          {plantilla.usoFrecuente ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">{plantilla.usoFrecuente ? 'Sí' : 'No'}</span>
        </div>
      ),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (plantilla: Plantilla) => (
        <Badge className={plantilla.estado === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {plantilla.estado}
        </Badge>
      ),
    },
    {
      key: 'fechaModificacion',
      titulo: 'Última Modificación',
      render: (plantilla: Plantilla) => (
        <div className="text-sm">
          <div>{new Date(plantilla.fechaModificacion).toLocaleDateString('es-PE')}</div>
          <div className="text-xs text-muted-foreground">por {plantilla.modificadoPor}</div>
        </div>
      ),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (plantilla: Plantilla) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPlantillaSeleccionada(plantilla);
              setShowDetallePlantilla(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plantillas de Documentos</h1>
          <p className="text-muted-foreground">
            Gestión de plantillas para documentos médicos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowNuevaPlantilla(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.inactivas}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uso Frecuente</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.usoFrecuente}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recetas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.recetas}</p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Historias</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.historias}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Órdenes</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.ordenes}</p>
              </div>
              <FlaskConical className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificados</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.certificados}</p>
              </div>
              <File className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receta">Recetas</SelectItem>
                  <SelectItem value="indicaciones">Indicaciones</SelectItem>
                  <SelectItem value="historia">Historias</SelectItem>
                  <SelectItem value="orden">Órdenes</SelectItem>
                  <SelectItem value="certificado">Certificados</SelectItem>
                  <SelectItem value="control">Controles</SelectItem>
                  <SelectItem value="referencia">Referencias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoría</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="Cirugía">Cirugía</SelectItem>
                  <SelectItem value="Ginecología">Ginecología</SelectItem>
                  <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                  <SelectItem value="Certificados">Certificados</SelectItem>
                  <SelectItem value="Obstetricia">Obstetricia</SelectItem>
                  <SelectItem value="Referencias">Referencias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="inactiva">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, descripción o tags..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiltroTipo('todos');
                  setFiltroCategoria('todos');
                  setFiltroEstado('todos');
                  setFiltroBusqueda('');
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Plantillas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Plantillas</CardTitle>
          <CardDescription>
            {plantillasFiltradas.length} plantilla{plantillasFiltradas.length !== 1 ? 's' : ''} encontrada{plantillasFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={plantillasFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(plantilla: Record<string, unknown>) => plantilla.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Detalle Plantilla */}
      {showDetallePlantilla && plantillaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIconoTipo(plantillaSeleccionada.tipo)}
                {plantillaSeleccionada.nombre}
              </CardTitle>
              <CardDescription>{plantillaSeleccionada.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <div className="mt-1">
                    <Badge className={getColorTipo(plantillaSeleccionada.tipo)}>
                      {plantillaSeleccionada.tipo}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <p className="text-sm text-muted-foreground">{plantillaSeleccionada.categoria}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge className={plantillaSeleccionada.estado === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {plantillaSeleccionada.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Uso Frecuente</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {plantillaSeleccionada.usoFrecuente ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">{plantillaSeleccionada.usoFrecuente ? 'Sí' : 'No'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Creado por</Label>
                  <p className="text-sm text-muted-foreground">{plantillaSeleccionada.creadoPor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Modificado por</Label>
                  <p className="text-sm text-muted-foreground">{plantillaSeleccionada.modificadoPor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Creación</Label>
                  <p className="text-sm text-muted-foreground">{new Date(plantillaSeleccionada.fechaCreacion).toLocaleDateString('es-PE')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Última Modificación</Label>
                  <p className="text-sm text-muted-foreground">{new Date(plantillaSeleccionada.fechaModificacion).toLocaleDateString('es-PE')}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {plantillaSeleccionada.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contenido de la Plantilla */}
              <div>
                <Label className="text-sm font-medium">Contenido de la Plantilla</Label>
                <div className="mt-2 p-4 bg-accent/50 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {plantillaSeleccionada.contenido}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetallePlantilla(false)}>
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Usar Plantilla
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Nueva Plantilla */}
      {showNuevaPlantilla && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Crear Nueva Plantilla</CardTitle>
              <CardDescription>Crear una nueva plantilla de documento médico</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input placeholder="Nombre de la plantilla" />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receta">Receta</SelectItem>
                        <SelectItem value="indicaciones">Indicaciones</SelectItem>
                        <SelectItem value="historia">Historia</SelectItem>
                        <SelectItem value="orden">Orden</SelectItem>
                        <SelectItem value="certificado">Certificado</SelectItem>
                        <SelectItem value="control">Control</SelectItem>
                        <SelectItem value="referencia">Referencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <Input placeholder="Categoría" />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activa">Activa</SelectItem>
                        <SelectItem value="inactiva">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea placeholder="Descripción de la plantilla" />
                </div>
                <div>
                  <Label>Contenido</Label>
                  <Textarea 
                    placeholder="Contenido de la plantilla con variables entre corchetes [VARIABLE]"
                    className="min-h-[200px] font-mono"
                  />
                </div>
                <div>
                  <Label>Tags (separados por comas)</Label>
                  <Input placeholder="tag1, tag2, tag3" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaPlantilla(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Plantilla</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}