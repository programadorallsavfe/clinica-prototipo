'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, CheckCircle, XCircle, Clock, AlertTriangle, 
  User, Search, Filter, Download, Upload, Plus,
  ChevronLeft, ChevronRight, CalendarDays, Users
} from 'lucide-react';

interface Personal {
  id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  estado: string;
}

interface RegistroAsistencia {
  id: string;
  personalId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  horasTrabajadas: number;
  minutosTrabajados: number;
  tardanza: number;
  falta: boolean;
  observaciones?: string;
  fechaRegistro: string;
}

interface AsistenciasTableProps {
  personal: Personal[];
  asistencias: RegistroAsistencia[];
}

// Función para generar asistencias mock
const generateAsistenciasMock = (personal: Personal[], fechaInicio: Date, fechaFin: Date): RegistroAsistencia[] => {
  const asistencias: RegistroAsistencia[] = [];
  const fechaActual = new Date(fechaInicio);
  
  while (fechaActual <= fechaFin) {
    // Solo días laborables (lunes a viernes)
    if (fechaActual.getDay() >= 1 && fechaActual.getDay() <= 5) {
      personal.forEach(persona => {
        if (persona.estado === 'activo') {
          // 90% de asistencia
          if (Math.random() < 0.9) {
            const horaEntrada = new Date(fechaActual);
            horaEntrada.setHours(8, Math.floor(Math.random() * 30), 0, 0); // 8:00-8:30
            
            const horaSalida = new Date(fechaActual);
            horaSalida.setHours(17, Math.floor(Math.random() * 30), 0, 0); // 17:00-17:30
            
            const tardanza = Math.floor(Math.random() * 20); // 0-20 minutos
            const horasTrabajadas = Math.floor((horaSalida.getTime() - horaEntrada.getTime()) / (1000 * 60 * 60));
            const minutosTrabajados = Math.floor(((horaSalida.getTime() - horaEntrada.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
            
            asistencias.push({
              id: `asist-${persona.id}-${fechaActual.toISOString().split('T')[0]}`,
              personalId: persona.id,
              fecha: fechaActual.toISOString().split('T')[0],
              horaEntrada: horaEntrada.toTimeString().slice(0, 5),
              horaSalida: horaSalida.toTimeString().slice(0, 5),
              horasTrabajadas,
              minutosTrabajados,
              tardanza,
              falta: false,
              observaciones: tardanza > 0 ? `Tardanza: ${tardanza} min` : undefined,
              fechaRegistro: new Date().toISOString()
            });
          } else {
            // 10% de faltas
            asistencias.push({
              id: `falta-${persona.id}-${fechaActual.toISOString().split('T')[0]}`,
              personalId: persona.id,
              fecha: fechaActual.toISOString().split('T')[0],
              horaEntrada: '',
              horaSalida: '',
              horasTrabajadas: 0,
              minutosTrabajados: 0,
              tardanza: 0,
              falta: true,
              observaciones: 'Falta sin justificar',
              fechaRegistro: new Date().toISOString()
            });
          }
        }
      });
    }
    
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return asistencias;
};

export default function AsistenciasTable({ personal, asistencias }: AsistenciasTableProps) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [filtroPersonal, setFiltroPersonal] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  // Generar asistencias mock para el mes actual
  const asistenciasMock = useMemo(() => {
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const finMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    return generateAsistenciasMock(personal, inicioMes, finMes);
  }, [personal, fechaActual]);

  // Obtener días del mes
  const diasDelMes = useMemo(() => {
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const dias = [];
    
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fecha = new Date(year, month, i);
      dias.push({
        numero: i,
        fecha: fecha.toISOString().split('T')[0],
        esLaborable: fecha.getDay() >= 1 && fecha.getDay() <= 5,
        diaSemana: fecha.toLocaleDateString('es-PE', { weekday: 'short' })
      });
    }
    
    return dias;
  }, [fechaActual]);

  // Filtrar personal
  const personalFiltrado = personal.filter(persona => {
    const cumpleBusqueda = busqueda === '' || 
      persona.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      persona.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      persona.cargo.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleFiltro = filtroPersonal === 'todos' || persona.id === filtroPersonal;
    
    return cumpleBusqueda && cumpleFiltro;
  });

  // Obtener asistencia de una persona en una fecha específica
  const getAsistencia = (personalId: string, fecha: string) => {
    return asistenciasMock.find(a => a.personalId === personalId && a.fecha === fecha);
  };

  // Estadísticas del mes
  const estadisticas = useMemo(() => {
    const totalAsistencias = asistenciasMock.filter(a => !a.falta).length;
    const totalFaltas = asistenciasMock.filter(a => a.falta).length;
    const totalTardanzas = asistenciasMock.filter(a => a.tardanza > 0).length;
    const totalHorasTrabajadas = asistenciasMock.reduce((sum, a) => sum + a.horasTrabajadas, 0);
    
    return {
      totalAsistencias,
      totalFaltas,
      totalTardanzas,
      totalHorasTrabajadas
    };
  }, [asistenciasMock]);

  const getEstadoBadge = (asistencia: RegistroAsistencia | undefined) => {
    if (!asistencia) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">-</Badge>;
    }
    
    if (asistencia.falta) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Falta</Badge>;
    }
    
    if (asistencia.tardanza > 0) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Tardanza</Badge>;
    }
    
    return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Puntual</Badge>;
  };

  const getCargoIcon = (cargo: string) => {
    switch (cargo) {
      case 'medico': return <User className="h-3 w-3" />;
      case 'enfermero': return <User className="h-3 w-3" />;
      case 'recepcionista': return <User className="h-3 w-3" />;
      case 'administrador': return <User className="h-3 w-3" />;
      case 'contador': return <User className="h-3 w-3" />;
      case 'limpieza': return <User className="h-3 w-3" />;
      case 'seguridad': return <User className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    setFechaActual(nuevaFecha);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Control de Asistencias
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Registro diario de asistencias, tardanzas y faltas del personal
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.totalAsistencias}</p>
                <p className="text-sm text-muted-foreground">Asistencias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.totalFaltas}</p>
                <p className="text-sm text-muted-foreground">Faltas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.totalTardanzas}</p>
                <p className="text-sm text-muted-foreground">Tardanzas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.totalHorasTrabajadas}</p>
                <p className="text-sm text-muted-foreground">Horas Trabajadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Navegación */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Navegación del mes */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => cambiarMes('anterior')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {fechaActual.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => cambiarMes('siguiente')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFechaActual(new Date())}>
                Hoy
              </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar personal..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={filtroPersonal} onValueChange={setFiltroPersonal}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {personal.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.nombres} {persona.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Asistencias */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground sticky left-0 bg-muted/50 z-10">
                    Personal
                  </th>
                  {diasDelMes.map(dia => (
                    <th key={dia.numero} className="px-2 py-3 text-center text-sm font-medium text-muted-foreground min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">{dia.diaSemana}</span>
                        <span className={`text-sm font-medium ${!dia.esLaborable ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {dia.numero}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    Resumen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {personalFiltrado.map(persona => {
                  const asistenciasPersona = asistenciasMock.filter(a => a.personalId === persona.id);
                  const totalAsistencias = asistenciasPersona.filter(a => !a.falta).length;
                  const totalFaltas = asistenciasPersona.filter(a => a.falta).length;
                  const totalTardanzas = asistenciasPersona.filter(a => a.tardanza > 0).length;
                  
                  return (
                    <tr key={persona.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getCargoIcon(persona.cargo)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {persona.nombres} {persona.apellidos}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {persona.cargo}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {diasDelMes.map(dia => {
                        const asistencia = getAsistencia(persona.id, dia.fecha);
                        return (
                          <td key={dia.numero} className="px-2 py-3 text-center">
                            {dia.esLaborable ? (
                              <div className="space-y-1">
                                {getEstadoBadge(asistencia)}
                                {asistencia && !asistencia.falta && (
                                  <div className="text-xs text-muted-foreground">
                                    {asistencia.horaEntrada}
                                  </div>
                                )}
                                {asistencia && asistencia.tardanza > 0 && (
                                  <div className="text-xs text-yellow-600">
                                    +{asistencia.tardanza}min
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">-</div>
                            )}
                          </td>
                        );
                      })}
                      
                      <td className="px-4 py-3 text-center">
                        <div className="space-y-1">
                          <div className="text-xs text-green-600">
                            ✓ {totalAsistencias}
                          </div>
                          <div className="text-xs text-red-600">
                            ✗ {totalFaltas}
                          </div>
                          <div className="text-xs text-yellow-600">
                            ⚠ {totalTardanzas}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Puntual</Badge>
              <span className="text-muted-foreground">Asistencia puntual</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Tardanza</Badge>
              <span className="text-muted-foreground">Llegó tarde</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Falta</Badge>
              <span className="text-muted-foreground">No asistió</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">-</Badge>
              <span className="text-muted-foreground">Día no laborable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
