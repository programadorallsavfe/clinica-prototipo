'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  Calendar, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  Users,
  Timer
} from 'lucide-react';

interface DisponibilidadTiempoRealProps {
  doctorId: string;
  doctorName: string;
  fecha: string;
  onHorarioSeleccionado?: (hora: string) => void;
}

interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  ocupado: boolean;
  reservado: boolean;
  tiempoRestante?: number; // minutos hasta que expire la reserva
}

export function DisponibilidadTiempoReal({ 
  doctorId, 
  doctorName, 
  fecha,
  onHorarioSeleccionado 
}: DisponibilidadTiempoRealProps) {
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [isActualizando, setIsActualizando] = useState(false);

  // Simular horarios disponibles
  const horariosBase = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Simular estado de disponibilidad
  const simularDisponibilidad = () => {
    const horariosSimulados: HorarioDisponible[] = horariosBase.map(hora => {
      const random = Math.random();
      let estado: 'disponible' | 'ocupado' | 'reservado' = 'disponible';
      let tiempoRestante: number | undefined;

      if (random < 0.3) {
        estado = 'ocupado';
      } else if (random < 0.5) {
        estado = 'reservado';
        tiempoRestante = Math.floor(Math.random() * 15) + 1; // 1-15 minutos
      }

      return {
        hora,
        disponible: estado === 'disponible',
        ocupado: estado === 'ocupado',
        reservado: estado === 'reservado',
        tiempoRestante
      };
    });

    setHorarios(horariosSimulados);
    setUltimaActualizacion(new Date());
  };

  // Actualizar disponibilidad cada 30 segundos
  useEffect(() => {
    simularDisponibilidad();
    
    const interval = setInterval(() => {
      if (isOnline) {
        simularDisponibilidad();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [doctorId, fecha, isOnline]);

  // Simular conexión/desconexión
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% del tiempo online
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleActualizar = async () => {
    setIsActualizando(true);
    // Simular delay de actualización
    await new Promise(resolve => setTimeout(resolve, 1000));
    simularDisponibilidad();
    setIsActualizando(false);
  };

  const getEstadoColor = (horario: HorarioDisponible) => {
    if (horario.ocupado) return 'bg-red-500';
    if (horario.reservado) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getEstadoTexto = (horario: HorarioDisponible) => {
    if (horario.ocupado) return 'Ocupado';
    if (horario.reservado) return 'Reservado';
    return 'Disponible';
  };

  const getEstadoIcon = (horario: HorarioDisponible) => {
    if (horario.ocupado) return <XCircle className="h-4 w-4" />;
    if (horario.reservado) return <Timer className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const horariosDisponibles = horarios.filter(h => h.disponible).length;
  const horariosOcupados = horarios.filter(h => h.ocupado).length;
  const horariosReservados = horarios.filter(h => h.reservado).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Disponibilidad en Tiempo Real
            </CardTitle>
            <CardDescription>
              {doctorName} • {new Date(fecha).toLocaleDateString('es-ES')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleActualizar}
              disabled={isActualizando}
            >
              <RefreshCw className={`h-4 w-4 ${isActualizando ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Disponibles
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">{horariosDisponibles}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Reservados
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{horariosReservados}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  Ocupados
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600">{horariosOcupados}</p>
            </CardContent>
          </Card>
        </div>

        {/* Información de Estado */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{horarios.length} horarios totales</span>
          </div>
        </div>

        {/* Grid de Horarios */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {horarios.map((horario) => (
            <Button
              key={horario.hora}
              variant={horario.disponible ? "default" : "outline"}
              size="sm"
              className={`h-auto p-3 flex flex-col items-center gap-1 ${
                horario.disponible 
                  ? 'hover:bg-primary/90' 
                  : horario.ocupado 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-not-allowed'
              }`}
              disabled={!horario.disponible}
              onClick={() => horario.disponible && onHorarioSeleccionado?.(horario.hora)}
            >
              <div className="flex items-center gap-1">
                {getEstadoIcon(horario)}
                <span className="text-xs font-medium">{horario.hora}</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getEstadoColor(horario)} text-white border-0`}
              >
                {getEstadoTexto(horario)}
              </Badge>
              {horario.reservado && horario.tiempoRestante && (
                <span className="text-xs text-yellow-600 font-medium">
                  {horario.tiempoRestante}min
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Reservado (temporal)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground">Ocupado</span>
          </div>
        </div>

        {/* Alerta de Conexión */}
        {!isOnline && (
          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-800 dark:text-orange-200">
                  Sin conexión. Los horarios mostrados pueden no estar actualizados.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
