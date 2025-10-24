/**
 * Tabla de datos reutilizable con paginación y ordenamiento
 */

'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';

export interface Columna<T> {
  key: string;
  titulo: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columnas: Columna<T>[];
  itemsPorPagina?: number;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columnas,
  itemsPorPagina = 10,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [ordenamiento, setOrdenamiento] = useState<{
    columna: string;
    direccion: 'asc' | 'desc';
  } | null>(null);

  // Ordenar datos
  const datosOrdenados = ordenamiento
    ? [...data].sort((a, b) => {
        const valorA = a[ordenamiento.columna] as string | number;
        const valorB = b[ordenamiento.columna] as string | number;

        if (valorA === valorB) return 0;

        const comparacion = valorA > valorB ? 1 : -1;
        return ordenamiento.direccion === 'asc' ? comparacion : -comparacion;
      })
    : data;

  // Paginación
  const totalPaginas = Math.ceil(datosOrdenados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const datosPagina = datosOrdenados.slice(inicio, fin);

  const handleOrdenar = (columna: string) => {
    setOrdenamiento(prev => {
      if (!prev || prev.columna !== columna) {
        return { columna, direccion: 'asc' };
      }
      if (prev.direccion === 'asc') {
        return { columna, direccion: 'desc' };
      }
      return null;
    });
  };

  const irAPagina = (pagina: number) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columnas.map((columna) => (
                <th
                  key={columna.key}
                  style={{ width: columna.width }}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  {columna.sortable ? (
                    <button
                      onClick={() => handleOrdenar(columna.key)}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {columna.titulo}
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  ) : (
                    columna.titulo
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {datosPagina.length === 0 ? (
              <tr>
                <td
                  colSpan={columnas.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              datosPagina.map((item, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(item) : index}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}
                >
                  {columnas.map((columna) => (
                    <td key={columna.key} className="px-4 py-3 text-sm text-foreground">
                      {columna.render
                        ? columna.render(item)
                        : String(item[columna.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {inicio + 1} - {Math.min(fin, data.length)} de {data.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => irAPagina(1)}
              disabled={paginaActual === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPaginas)].map((_, i) => {
                const pagina = i + 1;
                // Mostrar solo páginas cercanas
                if (
                  pagina === 1 ||
                  pagina === totalPaginas ||
                  (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
                ) {
                  return (
                    <Button
                      key={pagina}
                      variant={paginaActual === pagina ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => irAPagina(pagina)}
                    >
                      {pagina}
                    </Button>
                  );
                } else if (
                  pagina === paginaActual - 2 ||
                  pagina === paginaActual + 2
                ) {
                  return <span key={pagina}>...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => irAPagina(totalPaginas)}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
