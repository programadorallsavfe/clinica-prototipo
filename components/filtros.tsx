/**
 * Componente de filtros reutilizable
 */

'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, X } from 'lucide-react';

export interface FiltroDefinicion {
  nombre: string;
  tipo: 'texto' | 'select' | 'fecha' | 'rango-fecha';
  label: string;
  opciones?: { valor: string; etiqueta: string }[]; // Para select
  placeholder?: string;
}

interface FiltrosProps {
  definiciones: FiltroDefinicion[];
  onFiltrar: (filtros: Record<string, unknown>) => void;
  onLimpiar?: () => void;
}

export function Filtros({ definiciones, onFiltrar, onLimpiar }: FiltrosProps) {
  const [valores, setValores] = useState<Record<string, unknown>>({});

  const handleCambio = (nombre: string, valor: unknown) => {
    setValores(prev => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const handleBuscar = () => {
    // Filtrar valores vacíos
    const filtrosActivos = Object.entries(valores).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    onFiltrar(filtrosActivos);
  };

  const handleLimpiar = () => {
    setValores({});
    onLimpiar?.();
  };

  const renderCampo = (def: FiltroDefinicion) => {
    const valor = valores[def.nombre] || '';

    switch (def.tipo) {
      case 'texto':
        return (
          <Input
            type="text"
            placeholder={def.placeholder || def.label}
            value={String(valor)}
            onChange={(e) => handleCambio(def.nombre, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            value={String(valor)}
            onValueChange={(value) => handleCambio(def.nombre, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={def.placeholder || `Seleccionar ${def.label}`} />
            </SelectTrigger>
            <SelectContent>
              {def.opciones?.map((opcion) => (
                <SelectItem key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'fecha':
        return (
          <Input
            type="date"
            value={String(valor)}
            onChange={(e) => handleCambio(def.nombre, e.target.value)}
          />
        );

      case 'rango-fecha':
        return (
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Desde"
              value={String(valores[`${def.nombre}_desde`] || '')}
              onChange={(e) => handleCambio(`${def.nombre}_desde`, e.target.value)}
            />
            <Input
              type="date"
              placeholder="Hasta"
              value={String(valores[`${def.nombre}_hasta`] || '')}
              onChange={(e) => handleCambio(`${def.nombre}_hasta`, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {definiciones.map((def) => (
          <div key={def.nombre} className="space-y-2">
            <Label htmlFor={def.nombre}>{def.label}</Label>
            {renderCampo(def)}
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button onClick={handleLimpiar} variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
        <Button onClick={handleBuscar} size="sm">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
