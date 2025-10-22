'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  Plus,
  Settings,
  Bell,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';

// Tipos de datos para la agenda
interface Cita {
  id: string;
  hora: string;
  paciente: {
    nombre: string;
    telefono: string;
  };
  atencion: {
    doctor: string;
    tipo: 'Consulta' | 'Examen';
  };
  estado: 'programada' | 'confirmada_whatsapp' | 'confirmada_telefono' | 'confirmada_email' | 'en_sala_espera' | 'atendiendose' | 'atendida' | 'no_asiste' | 'anulada';
  situacion: 'pagada' | 'no_pagada' | 'parcial';
  fechaLlegada?: string;
  observaciones?: string;
}

interface FiltrosAgenda {
  busqueda: string;
  profesional: string;
  estado: string;
  fecha: string;
  situacion: string;
}

interface EstadisticasAgenda {
  totalCitas: number;
  citasAtendidas: number;
  enEspera: number;
  confirmadas: number;
  pendientes: number;
  anulaciones: number;
}

export default function AgendasPage() {
  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosAgenda>({
    busqueda: '',
    profesional: 'todos',
    estado: 'todos',
    fecha: new Date().toISOString().split('T')[0],
    situacion: 'todos'
  });

  // Estado para controlar qué selector está abierto
  const [selectorAbierto, setSelectorAbierto] = useState<string | null>(null);

  // Datos de ejemplo para la agenda
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: '1',
      hora: '08:00',
      paciente: {
        nombre: 'FIAMA STEFANY CARBAJAL FLORES',
        telefono: '+51966468056'
      },
      atencion: {
        doctor: 'Dr. CASTILLO ROBLES, JOSE',
        tipo: 'Consulta'
      },
      estado: 'atendida',
      situacion: 'pagada'
    },
    {
      id: '2',
      hora: '08:00',
      paciente: {
        nombre: 'ADRIANA EVANGELINA TORREJON LAOS',
        telefono: '+51954097189'
      },
      atencion: {
        doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
        tipo: 'Examen'
      },
      estado: 'confirmada_telefono',
      situacion: 'no_pagada'
    },
    {
      id: '3',
      hora: '08:05',
      paciente: {
        nombre: 'VERONICA REQUEZ MENDOZA',
        telefono: '+51967457057'
      },
      atencion: {
        doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
        tipo: 'Examen'
      },
      estado: 'confirmada_telefono',
      situacion: 'no_pagada'
    },
    {
      id: '4',
      hora: '08:10',
      paciente: {
        nombre: 'MILAGROS CELESTE MARTINEZ RODRIGUEZ',
        telefono: '+51998588541'
      },
      atencion: {
        doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
        tipo: 'Examen'
      },
      estado: 'confirmada_telefono',
      situacion: 'no_pagada'
    },
    {
      id: '5',
      hora: '08:15',
      paciente: {
        nombre: 'ROSA ANGELA ELLEN MAGUIÑO',
        telefono: '+51954735878'
      },
      atencion: {
        doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
        tipo: 'Examen'
      },
      estado: 'atendida',
      situacion: 'pagada'
    },
    {
      id: '6',
      hora: '08:20',
      paciente: {
        nombre: 'CRISTINA LAVERIANO TAFUR',
        telefono: '+51987654321'
      },
      atencion: {
        doctor: 'Dr(a). SEGUIMIENTO. TOPICO',
        tipo: 'Examen'
      },
      estado: 'atendida',
      situacion: 'pagada'
    },
    {
      id: '7',
      hora: '10:30',
      paciente: {
        nombre: 'XIOMARA XIMENA VALLADARES AYALA',
        telefono: '0-51901453426'
      },
      atencion: {
        doctor: 'Dr(a). MEJIA GASTELO. JACKELINE',
        tipo: 'Consulta'
      },
      estado: 'en_sala_espera',
      situacion: 'pagada',
      fechaLlegada: '10:25'
    },
    {
      id: '8',
      hora: '11:00',
      paciente: {
        nombre: 'SHIRLEY GUISSELL RODRIGUEZ HUERTA',
        telefono: '+51961336414'
      },
      atencion: {
        doctor: 'Dr(a). MEJIA GASTELO. JACKELINE',
        tipo: 'Consulta'
      },
      estado: 'en_sala_espera',
      situacion: 'pagada',
      fechaLlegada: '10:58'
    }
  ]);

  // Filtrado de datos
  const citasFiltradas = useMemo(() => {
    return citas.filter(cita => {
      const coincideBusqueda = !filtros.busqueda || 
        cita.paciente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.paciente.telefono.includes(filtros.busqueda) ||
        cita.atencion.doctor.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideProfesional = filtros.profesional === 'todos' || 
        cita.atencion.doctor.includes(filtros.profesional);
      
      const coincideEstado = filtros.estado === 'todos' || cita.estado === filtros.estado;
      const coincideSituacion = filtros.situacion === 'todos' || cita.situacion === filtros.situacion;

      return coincideBusqueda && coincideProfesional && coincideEstado && coincideSituacion;
    });
  }, [citas, filtros]);

  // Estadísticas calculadas
  const estadisticas: EstadisticasAgenda = useMemo(() => {
    const totalCitas = citas.length;
    const citasAtendidas = citas.filter(c => c.estado === 'atendida').length;
    const enEspera = citas.filter(c => c.estado === 'en_sala_espera').length;
    const confirmadas = citas.filter(c => c.estado === 'atendida' || c.estado === 'confirmada_whatsapp').length;
    const pendientes = citas.filter(c => c.estado === 'confirmada_telefono' || c.estado === 'confirmada_email').length;
    const anulaciones = citas.filter(c => c.estado === 'anulada' || c.estado === 'no_asiste').length;

    return {
      totalCitas,
      citasAtendidas,
      enEspera,
      confirmadas,
      pendientes,
      anulaciones
    };
  }, [citas]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      profesional: 'todos',
      estado: 'todos',
      fecha: new Date().toISOString().split('T')[0],
      situacion: 'todos'
    });
  };

  const actualizarEstadoCita = (citaId: string, nuevoEstado: string) => {
    setCitas(prevCitas => 
      prevCitas.map(cita => 
        cita.id === citaId 
          ? { ...cita, estado: nuevoEstado as Cita['estado'] }
          : cita
      )
    );
    // Cerrar el selector después de seleccionar
    setSelectorAbierto(null);
  };

  const handleSelectorOpen = (citaId: string) => {
    setSelectorAbierto(citaId);
  };

  const handleSelectorClose = () => {
    setSelectorAbierto(null);
  };

  // Efecto para controlar que solo un selector esté abierto
  useEffect(() => {
    const handleSelectTriggerClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const trigger = target.closest('[data-radix-select-trigger]');
      
      if (trigger) {
        const citaId = trigger.getAttribute('data-cita-id');
        if (citaId) {
          // Si hay otro selector abierto, cerrarlo
          if (selectorAbierto && selectorAbierto !== citaId) {
            // Forzar el cierre del selector anterior
            const previousTrigger = document.querySelector(`[data-radix-select-trigger][data-cita-id="${selectorAbierto}"]`);
            if (previousTrigger) {
              (previousTrigger as HTMLElement).click();
            }
          }
          setSelectorAbierto(citaId);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-radix-select-trigger]') && !target.closest('[data-radix-select-content]')) {
        setSelectorAbierto(null);
      }
    };

    // Observar cambios en el estado de los selectores
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          const target = mutation.target as Element;
          if (target.getAttribute('data-state') === 'closed' && selectorAbierto) {
            setSelectorAbierto(null);
          }
        }
      });
    });

    // Observar todos los triggers de select
    const selectTriggers = document.querySelectorAll('[data-radix-select-trigger]');
    selectTriggers.forEach(trigger => {
      observer.observe(trigger, { attributes: true, attributeFilter: ['data-state'] });
    });

    document.addEventListener('click', handleSelectTriggerClick);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleSelectTriggerClick);
      document.removeEventListener('mousedown', handleClickOutside);
      observer.disconnect();
    };
  }, [selectorAbierto]);

  // Función para determinar si el dropdown debe abrirse hacia arriba
  const shouldOpenUpward = (index: number) => {
    const totalItems = citasFiltradas.length;
    // Si hay menos de 4 elementos restantes desde el índice actual, abrir hacia arriba
    // Esto asegura que el dropdown no se salga del viewport
    const remainingItems = totalItems - index;
    return remainingItems <= 4;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'atendida':
      case 'confirmada_whatsapp':
        return 'text-green-500 bg-green-500/10';
      case 'en_sala_espera':
      case 'programada':
        return 'text-cyan-500 bg-cyan-500/10';
      case 'confirmada_telefono':
      case 'confirmada_email':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'atendiendose':
        return 'text-blue-500 bg-blue-500/10';
      case 'no_asiste':
      case 'anulada':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getSituacionColor = (situacion: string) => {
    switch (situacion) {
      case 'pagada':
        return 'text-green-500 bg-green-500/10';
      case 'no_pagada':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'parcial':
        return 'text-cyan-500 bg-cyan-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getEstadoTexto = (estado: string, citaId?: string) => {
    switch (estado) {
      case 'programada':
        return 'Programada';
      case 'confirmada_whatsapp':
        return 'Confirmado por WhatsApp';
      case 'confirmada_telefono':
        return 'Confirmado por teléfono';
      case 'confirmada_email':
        return 'Confirmado por email';
      case 'en_sala_espera':
        const cita = citaId ? citas.find(c => c.id === citaId) : null;
        return cita?.fechaLlegada ? `En sala de espera desde las ${cita.fechaLlegada}` : 'En sala de espera';
      case 'atendiendose':
        return 'Atendiéndose';
      case 'atendida':
        return 'Atendido';
      case 'no_asiste':
        return 'No asiste';
      case 'anulada':
        return 'Anulado';
      default:
        return estado;
    }
  };

  const getSituacionTexto = (situacion: string) => {
    switch (situacion) {
      case 'pagada':
        return 'Saldada';
      case 'no_pagada':
        return '$ No hay saldo';
      case 'parcial':
        return 'Pago parcial';
      default:
        return situacion;
    }
  };

  return (
    <>
      <style jsx global>{`
        .select-dropdown-up {
          transform: translateY(-100%) !important;
          margin-top: -8px !important;
        }
        .select-dropdown-up[data-radix-popper-content-wrapper] {
          transform: translateY(-100%) !important;
          margin-top: -8px !important;
        }
        .select-dropdown-down {
          transform: translateY(0) !important;
          margin-top: 4px !important;
        }
        .select-dropdown-down[data-radix-popper-content-wrapper] {
          transform: translateY(0) !important;
          margin-top: 4px !important;
        }
        /* Asegurar que el dropdown no se salga del viewport */
        [data-radix-popper-content-wrapper] {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        /* Controlar que solo un selector esté abierto a la vez */
        [data-radix-select-content] {
          z-index: 9999 !important;
        }
        /* Ocultar selectores que no están activos */
        [data-radix-select-content]:not([data-state="open"]) {
          display: none !important;
        }
        /* Asegurar que solo el selector activo sea visible */
        [data-radix-select-trigger][data-state="open"] + [data-radix-select-content] {
          display: block !important;
        }
      `}</style>
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Agenda Médica
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de citas y programación médica
        </p>
      </div>

      {/* Panel de Filtros */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Filtra y busca citas específicas
              </CardDescription>
            </div>
            {/* Indicador de filtros activos */}
            {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Filtros activos
                </Badge>
                <Button 
                  onClick={limpiarFiltros} 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda general */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, doctor..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por profesional */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Profesional</label>
              <Select value={filtros.profesional} onValueChange={(value) => handleFiltroChange('profesional', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar profesional">
                    {filtros.profesional === 'todos' ? 'Todos los profesionales' :
                     filtros.profesional === 'CASTILLO' ? 'Dr. CASTILLO ROBLES' :
                     filtros.profesional === 'SEGUIMIENTO' ? 'Dr(a). SEGUIMIENTO' :
                     filtros.profesional === 'MEJIA' ? 'Dr(a). MEJIA GASTELO' :
                     'Seleccionar profesional'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los profesionales</SelectItem>
                  <SelectItem value="CASTILLO">Dr. CASTILLO ROBLES</SelectItem>
                  <SelectItem value="SEGUIMIENTO">Dr(a). SEGUIMIENTO</SelectItem>
                  <SelectItem value="MEJIA">Dr(a). MEJIA GASTELO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange('estado', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado">
                    {filtros.estado === 'todos' ? 'Todos los estados' :
                     filtros.estado === 'atendida' ? 'Atendido' :
                     filtros.estado === 'confirmada_whatsapp' ? 'Confirmado por WhatsApp' :
                     filtros.estado === 'en_sala_espera' ? 'En sala de espera' :
                     filtros.estado === 'programada' ? 'Programado' :
                     filtros.estado === 'confirmada_telefono' ? 'Confirmado por teléfono' :
                     filtros.estado === 'atendiendose' ? 'Atendiéndose' :
                     filtros.estado === 'no_asiste' ? 'No asiste' :
                     filtros.estado === 'anulada' ? 'Anulado' :
                     'Seleccionar estado'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="atendida">Atendido</SelectItem>
                  <SelectItem value="confirmada_whatsapp">Confirmado por WhatsApp</SelectItem>
                  <SelectItem value="en_sala_espera">En sala de espera</SelectItem>
                  <SelectItem value="programada">Programado</SelectItem>
                  <SelectItem value="confirmada_telefono">Confirmado por teléfono</SelectItem>
                  <SelectItem value="atendiendose">Atendiéndose</SelectItem>
                  <SelectItem value="no_asiste">No asiste</SelectItem>
                  <SelectItem value="anulada">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por situación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Situación</label>
              <Select value={filtros.situacion} onValueChange={(value) => handleFiltroChange('situacion', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar situación">
                    {filtros.situacion === 'todos' ? 'Todas las situaciones' :
                     filtros.situacion === 'pagada' ? 'Saldada' :
                     filtros.situacion === 'no_pagada' ? 'No hay saldo' :
                     filtros.situacion === 'parcial' ? 'Pago parcial' :
                     'Seleccionar situación'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las situaciones</SelectItem>
                  <SelectItem value="pagada">Saldada</SelectItem>
                  <SelectItem value="no_pagada">No hay saldo</SelectItem>
                  <SelectItem value="parcial">Pago parcial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha</label>
              <Input
                type="date"
                value={filtros.fecha}
                onChange={(e) => handleFiltroChange('fecha', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Acciones</label>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Cita
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Filtros activos */}
        {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filtros aplicados:</span>
              {filtros.busqueda && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Búsqueda: "{filtros.busqueda}"
                </Badge>
              )}
              {filtros.profesional !== 'todos' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Profesional: {filtros.profesional}
                </Badge>
              )}
              {filtros.estado !== 'todos' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Estado: {filtros.estado}
                </Badge>
              )}
              {filtros.situacion !== 'todos' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Situación: {filtros.situacion}
                </Badge>
              )}
              {filtros.fecha !== new Date().toISOString().split('T')[0] && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Fecha: {filtros.fecha}
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Citas</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.totalCitas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.citasAtendidas} atendidas
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Espera</CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-200">
              <Clock className="h-4 w-4 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.enEspera}</div>
            <p className="text-xs text-muted-foreground mt-1">En sala de espera</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmadas</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.confirmadas}</div>
            <p className="text-xs text-muted-foreground mt-1">Atendidas/Confirmadas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.pendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">Por confirmar</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Citas */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Citas del Día
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {citasFiltradas.length} citas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 dark:bg-muted/20">
                  <TableHead className="w-[100px] font-semibold text-foreground">Hora</TableHead>
                  <TableHead className="font-semibold text-foreground">Paciente</TableHead>
                  <TableHead className="font-semibold text-foreground">Atención</TableHead>
                  <TableHead className="font-semibold text-foreground">Estado de la cita</TableHead>
                  <TableHead className="font-semibold text-foreground">Situación</TableHead>
                  <TableHead className="w-[120px] font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citasFiltradas.map((cita, index) => (
                  <TableRow 
                    key={cita.id}
                    className={`hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors ${
                      cita.estado === 'atendida' || cita.estado === 'confirmada_whatsapp'
                        ? 'bg-gradient-to-r from-green-50/30 to-green-100/30 dark:from-green-900/20 dark:to-green-800/20' 
                        : cita.estado === 'en_sala_espera' || cita.estado === 'programada'
                        ? 'bg-gradient-to-r from-cyan-50/30 to-cyan-100/30 dark:from-cyan-900/20 dark:to-cyan-800/20'
                        : cita.estado === 'confirmada_telefono' || cita.estado === 'confirmada_email'
                        ? 'bg-gradient-to-r from-yellow-50/30 to-yellow-100/30 dark:from-yellow-900/20 dark:to-yellow-800/20'
                        : cita.estado === 'atendiendose'
                        ? 'bg-gradient-to-r from-blue-50/30 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/20'
                        : cita.estado === 'no_asiste' || cita.estado === 'anulada'
                        ? 'bg-gradient-to-r from-red-50/30 to-red-100/30 dark:from-red-900/20 dark:to-red-800/20'
                        : 'bg-background dark:bg-card'
                    }`}
                  >
                    {/* Hora */}
                    <TableCell className="bg-background dark:bg-card">
                      <div className={`p-3 rounded-lg text-center font-bold text-sm shadow-lg border-2 transition-all duration-200 ${
                        cita.estado === 'atendida' || cita.estado === 'confirmada_whatsapp'
                          ? 'bg-green-500 text-white border-green-600 shadow-green-200' 
                          : cita.estado === 'en_sala_espera' || cita.estado === 'programada'
                          ? 'bg-cyan-500 text-white border-cyan-600 shadow-cyan-200'
                          : cita.estado === 'confirmada_telefono' || cita.estado === 'confirmada_email'
                          ? 'bg-yellow-500 text-white border-yellow-600 shadow-yellow-200'
                          : cita.estado === 'atendiendose'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-blue-200'
                          : cita.estado === 'no_asiste' || cita.estado === 'anulada'
                          ? 'bg-red-500 text-white border-red-600 shadow-red-200'
                          : 'bg-gray-500 text-white border-gray-600 shadow-gray-200'
                      }`}>
                        {cita.hora}
                      </div>
                    </TableCell>

                    {/* Paciente */}
                    <TableCell className="bg-background dark:bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{cita.paciente.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{cita.paciente.telefono}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Atención */}
                    <TableCell className="bg-background dark:bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{cita.atencion.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{cita.atencion.tipo}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Estado de la cita - Editable */}
                    <TableCell className="bg-background dark:bg-card">
                      <Select 
                        value={cita.estado} 
                        onValueChange={(value) => actualizarEstadoCita(cita.id, value)}
                      >
                        <SelectTrigger 
                          data-cita-id={cita.id}
                          className={`w-full min-w-[200px] ${
                            cita.estado === 'atendida' || cita.estado === 'confirmada_whatsapp'
                              ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                              : cita.estado === 'en_sala_espera' || cita.estado === 'programada'
                              ? 'bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600'
                              : cita.estado === 'confirmada_telefono' || cita.estado === 'confirmada_email'
                              ? 'bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600'
                              : cita.estado === 'atendiendose'
                              ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                              : cita.estado === 'no_asiste' || cita.estado === 'anulada'
                              ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                              : 'bg-gray-500 text-white border-gray-600 hover:bg-gray-600'
                          }`}
                        >
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                cita.estado === 'atendida' || cita.estado === 'confirmada_whatsapp'
                                  ? 'bg-white' 
                                  : cita.estado === 'en_sala_espera' || cita.estado === 'programada'
                                  ? 'bg-white'
                                  : cita.estado === 'confirmada_telefono' || cita.estado === 'confirmada_email'
                                  ? 'bg-white'
                                  : cita.estado === 'atendiendose'
                                  ? 'bg-white'
                                  : cita.estado === 'no_asiste' || cita.estado === 'anulada'
                                  ? 'bg-white'
                                  : 'bg-white'
                              }`}></div>
                              <span className="font-semibold truncate">{getEstadoTexto(cita.estado, cita.id)}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent 
                          className={`max-h-[200px] overflow-y-auto z-[9999] ${
                            shouldOpenUpward(index) ? 'select-dropdown-up' : 'select-dropdown-down'
                          }`}
                        >
                          <SelectItem value="programada" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                              <span className="font-medium">Programada</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="confirmada_whatsapp" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="font-medium">Confirmado por WhatsApp</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="confirmada_telefono" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                              <span className="font-medium">Confirmado por teléfono</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="confirmada_email" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                              <span className="font-medium">Confirmado por email</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="en_sala_espera" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                              <span className="font-medium">En sala de espera</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="atendiendose" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <span className="font-medium">Atendiéndose</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="atendida" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="font-medium">Atendido</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="no_asiste" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                              <span className="font-medium">No asiste</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="anulada" className="cursor-pointer">
                            <div className="flex items-center gap-2 py-1">
                              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                              <span className="font-medium">Anulado</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Situación */}
                    <TableCell className="bg-background dark:bg-card">
                      <Badge 
                        className={`text-xs font-bold px-3 py-1 text-white ${
                          cita.situacion === 'pagada'
                            ? 'bg-green-500'
                            : cita.situacion === 'no_pagada'
                            ? 'bg-yellow-500'
                            : cita.situacion === 'parcial'
                            ? 'bg-cyan-500'
                            : 'bg-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {cita.situacion === 'pagada' && <CheckCircle className="h-3 w-3" />}
                          {cita.situacion === 'no_pagada' && <AlertCircle className="h-3 w-3" />}
                          {cita.situacion === 'parcial' && <Clock className="h-3 w-3" />}
                          {getSituacionTexto(cita.situacion)}
                        </div>
                      </Badge>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="bg-background dark:bg-card">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {citasFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No se encontraron citas</h3>
                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Funciones principales para la gestión de citas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
            >
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground">Nueva Cita</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Ver Calendario</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Ver Estadísticas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}