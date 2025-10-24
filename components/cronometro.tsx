/**
 * Componente Cronómetro para control de tiempo de citas
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface CronometroProps {
  onStart?: (horaInicio: string) => void;
  onPause?: (duracionSegundos: number) => void;
  onStop?: (horaFin: string, duracionSegundos: number) => void;
  horaInicio?: string; // Si ya está iniciado
  autoInicio?: boolean;
}

export function Cronometro({ 
  onStart, 
  onPause, 
  onStop, 
  horaInicio,
  autoInicio = false 
}: CronometroProps) {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si hay una hora de inicio previa, calcular tiempo transcurrido
    if (horaInicio && !activo && !pausado) {
      const inicio = new Date(horaInicio);
      const ahora = new Date();
      const diferencia = Math.floor((ahora.getTime() - inicio.getTime()) / 1000);
      setSegundos(diferencia);
      
      if (autoInicio) {
        setActivo(true);
      }
    }
  }, [horaInicio, autoInicio, activo, pausado]);

  useEffect(() => {
    if (activo && !pausado) {
      intervalRef.current = setInterval(() => {
        setSegundos(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activo, pausado]);

  const formatearTiempo = (totalSegundos: number): string => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segs = totalSegundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleIniciar = () => {
    const ahora = new Date().toISOString();
    setActivo(true);
    setPausado(false);
    onStart?.(ahora);
  };

  const handlePausar = () => {
    setPausado(!pausado);
    if (!pausado) {
      onPause?.(segundos);
    }
  };

  const handleDetener = () => {
    const ahora = new Date().toISOString();
    setActivo(false);
    setPausado(false);
    onStop?.(ahora, segundos);
  };

  const getEstadoColor = (): string => {
    if (!activo) return 'text-gray-600';
    if (pausado) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
      <div className={`text-4xl font-mono font-bold ${getEstadoColor()}`}>
        {formatearTiempo(segundos)}
      </div>
      
      <div className="flex gap-2">
        {!activo ? (
          <Button onClick={handleIniciar} size="sm" variant="default">
            <Play className="h-4 w-4 mr-2" />
            Iniciar
          </Button>
        ) : (
          <>
            <Button 
              onClick={handlePausar} 
              size="sm" 
              variant={pausado ? "default" : "outline"}
            >
              {pausado ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {pausado ? 'Reanudar' : 'Pausar'}
            </Button>
            <Button onClick={handleDetener} size="sm" variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Detener
            </Button>
          </>
        )}
      </div>

   
    </div>
  );
}
