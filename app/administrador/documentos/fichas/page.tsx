'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, MoreHorizontal, FileText, Download, Eye } from 'lucide-react';

interface DocumentoClinico {
  id: string;
  nombre: string;
  slug: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaCreacion: string;
  ultimaModificacion: string;
  creadoPor: string;
}

export default function DocumentosClinicosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('activo');

  // Datos mock de documentos clínicos
  const documentosClinicos: DocumentoClinico[] = [
    {
      id: '1',
      nombre: 'CERTIFICADO PARA MATRIMONIO',
      slug: 'certificado-matrimonio',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      ultimaModificacion: '2024-01-20',
      creadoPor: 'Dr. María González'
    },
    {
      id: '2',
      nombre: 'CERTIFICADO DESCANSO MÉDICO',
      slug: 'certificado-descanso-medico',
      estado: 'activo',
      fechaCreacion: '2024-01-16',
      ultimaModificacion: '2024-01-22',
      creadoPor: 'Dr. Carlos Mendoza'
    },
    {
      id: '3',
      nombre: 'CERTIFICADO PARA TRABAJAR',
      slug: 'certificado-trabajar',
      estado: 'activo',
      fechaCreacion: '2024-01-17',
      ultimaModificacion: '2024-01-21',
      creadoPor: 'Dr. Ana Rodríguez'
    },
    {
      id: '4',
      nombre: 'INFORME COLPOSCOPIA',
      slug: 'informe-colposcopia',
      estado: 'activo',
      fechaCreacion: '2024-01-18',
      ultimaModificacion: '2024-01-23',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '5',
      nombre: 'CERTIFICADO ESSALUD',
      slug: 'certificado-essalud',
      estado: 'activo',
      fechaCreacion: '2024-01-19',
      ultimaModificacion: '2024-01-24',
      creadoPor: 'Dr. Miguel Torres'
    },
    {
      id: '6',
      nombre: 'ECOGRAFÍA PRIMER TRIMESTRE INICIAL',
      slug: 'ecografia-primer-trimestre-inicial',
      estado: 'activo',
      fechaCreacion: '2024-01-20',
      ultimaModificacion: '2024-01-25',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '7',
      nombre: 'ECOGRAFÍA PRIMER TRIMESTRE NO INICIAL',
      slug: 'ecografia-primer-trimestre-no-inicial',
      estado: 'activo',
      fechaCreacion: '2024-01-21',
      ultimaModificacion: '2024-01-26',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '8',
      nombre: 'ECOGRAFÍA GINECOLÓGICA CON TUMOR',
      slug: 'ecografia-ginecologica-con-tumor',
      estado: 'activo',
      fechaCreacion: '2024-01-22',
      ultimaModificacion: '2024-01-27',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '9',
      nombre: 'ECOGRAFÍA GINECOLÓGICA SIN TUMOR',
      slug: 'ecografia-ginecologica-sin-tumor',
      estado: 'activo',
      fechaCreacion: '2024-01-23',
      ultimaModificacion: '2024-01-28',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '10',
      nombre: 'ECOGRAFÍA ABDOMINAL',
      slug: 'ecografia-abdominal',
      estado: 'activo',
      fechaCreacion: '2024-01-24',
      ultimaModificacion: '2024-01-29',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '11',
      nombre: 'ECOGRAFÍA GENÉTICA',
      slug: 'ecografia-genetica',
      estado: 'activo',
      fechaCreacion: '2024-01-25',
      ultimaModificacion: '2024-01-30',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '12',
      nombre: 'ECOGRAFÍA MORFOLÓGICA',
      slug: 'ecografia-morfologica',
      estado: 'activo',
      fechaCreacion: '2024-01-26',
      ultimaModificacion: '2024-01-31',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '13',
      nombre: 'ECOGRAFÍA MAMA',
      slug: 'ecografia-mama',
      estado: 'activo',
      fechaCreacion: '2024-01-27',
      ultimaModificacion: '2024-02-01',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '14',
      nombre: 'ECOGRAFÍA PRÓSTATA',
      slug: 'ecografia-prostata',
      estado: 'activo',
      fechaCreacion: '2024-01-28',
      ultimaModificacion: '2024-02-02',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '15',
      nombre: 'ECOGRAFÍA RENAL Y VESICAL',
      slug: 'ecografia-renal-vesical',
      estado: 'activo',
      fechaCreacion: '2024-01-29',
      ultimaModificacion: '2024-02-03',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '16',
      nombre: 'ECOGRAFÍA OBSTÉTRICA',
      slug: 'ecografia-obstetrica',
      estado: 'activo',
      fechaCreacion: '2024-01-30',
      ultimaModificacion: '2024-02-04',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '17',
      nombre: 'ECOGRAFÍA TESTICULAR',
      slug: 'ecografia-testicular',
      estado: 'activo',
      fechaCreacion: '2024-01-31',
      ultimaModificacion: '2024-02-05',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '18',
      nombre: 'RADIÓLOGO ECOGRAFÍA ABDOMINAL COMPLETA',
      slug: 'radiologo-ecografia-abdominal-completa',
      estado: 'activo',
      fechaCreacion: '2024-02-01',
      ultimaModificacion: '2024-02-06',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '19',
      nombre: 'RADIÓLOGO ECOGRAFÍA ABDOMINAL SIMPLE',
      slug: 'radiologo-ecografia-abdominal-simple',
      estado: 'activo',
      fechaCreacion: '2024-02-02',
      ultimaModificacion: '2024-02-07',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '20',
      nombre: 'RADIÓLOGO ECOGRAFÍA HOMBRO',
      slug: 'radiologo-ecografia-hombro',
      estado: 'activo',
      fechaCreacion: '2024-02-03',
      ultimaModificacion: '2024-02-08',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '21',
      nombre: 'RADIÓLOGO ECOGRAFÍA PROSTÁTICA',
      slug: 'radiologo-ecografia-prostatica',
      estado: 'activo',
      fechaCreacion: '2024-02-04',
      ultimaModificacion: '2024-02-09',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '22',
      nombre: 'RADIÓLOGO ECOGRAFÍA MAMAS',
      slug: 'radiologo-ecografia-mamas',
      estado: 'activo',
      fechaCreacion: '2024-02-05',
      ultimaModificacion: '2024-02-10',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '23',
      nombre: 'RADIÓLOGO ECOGRAFÍA PARTES BLANDAS - MÚSCULO ESQUELÉTICO',
      slug: 'radiologo-ecografia-partes-blandas-musculo-esqueletico',
      estado: 'activo',
      fechaCreacion: '2024-02-06',
      ultimaModificacion: '2024-02-11',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '24',
      nombre: 'RADIÓLOGO ECOGRAFÍA DE TIROIDES',
      slug: 'radiologo-ecografia-tiroides',
      estado: 'activo',
      fechaCreacion: '2024-02-07',
      ultimaModificacion: '2024-02-12',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '25',
      nombre: 'MONITOREO DIABETES GESTACIONAL',
      slug: 'monitoreo-diabetes-gestacional',
      estado: 'activo',
      fechaCreacion: '2024-02-08',
      ultimaModificacion: '2024-02-13',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '26',
      nombre: 'RADIÓLOGO ECOGRAFÍA RENAL Y VESICAL',
      slug: 'radiologo-ecografia-renal-vesical',
      estado: 'activo',
      fechaCreacion: '2024-02-09',
      ultimaModificacion: '2024-02-14',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '27',
      nombre: 'RADIÓLOGO ECOGRAFÍA TESTICULAR',
      slug: 'radiologo-ecografia-testicular',
      estado: 'activo',
      fechaCreacion: '2024-02-10',
      ultimaModificacion: '2024-02-15',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '28',
      nombre: 'HOJA DE REFERENCIA',
      slug: 'hoja-referencia',
      estado: 'activo',
      fechaCreacion: '2024-02-11',
      ultimaModificacion: '2024-02-16',
      creadoPor: 'Dr. María González'
    },
    {
      id: '29',
      nombre: 'ECOGRAFÍA OBSTÉTRICA 2 - 3 TRIMESTRE GEMELAR',
      slug: 'ecografia-obstetrica-2-3-trimestre-gemelar',
      estado: 'activo',
      fechaCreacion: '2024-02-12',
      ultimaModificacion: '2024-02-17',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '30',
      nombre: 'ECOGRAFÍA GENÉTICA - GEMELAR',
      slug: 'ecografia-genetica-gemelar',
      estado: 'activo',
      fechaCreacion: '2024-02-13',
      ultimaModificacion: '2024-02-18',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '31',
      nombre: 'ECOGRAFÍA MORFOLÓGICA GEMELAR',
      slug: 'ecografia-morfologica-gemelar',
      estado: 'activo',
      fechaCreacion: '2024-02-14',
      ultimaModificacion: '2024-02-19',
      creadoPor: 'Dr. Elena Vargas'
    },
    {
      id: '32',
      nombre: 'INFORME DE URETROCISTOSCOPÍA',
      slug: 'informe-uretrocistoscopia',
      estado: 'activo',
      fechaCreacion: '2024-02-15',
      ultimaModificacion: '2024-02-20',
      creadoPor: 'Dr. Roberto Jiménez'
    },
    {
      id: '33',
      nombre: 'ECOGRAFÍA MAMARIA - NUEVO',
      slug: 'ecografia-mamaria-nuevo',
      estado: 'activo',
      fechaCreacion: '2024-02-16',
      ultimaModificacion: '2024-02-21',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '34',
      nombre: 'ESCALA MRS MENOPAUSIA',
      slug: 'escala-mrs-menopausia',
      estado: 'activo',
      fechaCreacion: '2024-02-17',
      ultimaModificacion: '2024-02-22',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '35',
      nombre: 'ECOGRAFÍA DE PISO PÉLVICO',
      slug: 'ecografia-piso-pelvico',
      estado: 'activo',
      fechaCreacion: '2024-02-18',
      ultimaModificacion: '2024-02-23',
      creadoPor: 'Dr. Laura Sánchez'
    },
    {
      id: '36',
      nombre: 'ECOGRAFÍA MAPEO ENDOMETRIÓSICO',
      slug: 'ecografia-mapeo-endometriosico',
      estado: 'activo',
      fechaCreacion: '2024-02-19',
      ultimaModificacion: '2024-02-24',
      creadoPor: 'Dr. Laura Sánchez'
    }
  ];

  // Filtrar documentos
  const filteredDocumentos = documentosClinicos.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || doc.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Activo</Badge>;
      case 'inactivo':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Inactivo</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleEstadoChange = (docId: string, newEstado: string) => {
    console.log(`Cambiar estado del documento ${docId} a ${newEstado}`);
    // Aquí implementarías la lógica para actualizar el estado
  };

  const handleAction = (action: string, docId: string, slug?: string) => {
    console.log(`Acción ${action} en documento ${docId}`);
    
    if (action === 'view' && slug) {
      // Navegar a la página individual del documento
      window.location.href = `/administrador/documentos/fichas/${slug}`;
    } else {
      // Aquí implementarías las otras acciones
      console.log(`Acción ${action} no implementada aún`);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documentos Clínicos</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de plantillas de documentos médicos
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Documentos Clínicos</span>
            <Badge variant="secondary">
              {filteredDocumentos.length} documentos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Nombre del Documento</TableHead>
                  <TableHead className="w-32">Estado</TableHead>
                  <TableHead className="w-32">Fecha Creación</TableHead>
                  <TableHead className="w-40">Última Modificación</TableHead>
                  <TableHead className="w-40">Creado Por</TableHead>
                  <TableHead className="w-32 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentos.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="max-w-xs">
                        <button 
                          onClick={() => handleAction('view', doc.id, doc.slug)}
                          className="text-sm text-primary hover:text-primary/80 hover:underline truncate text-left w-full cursor-pointer"
                        >
                          {doc.nombre}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={doc.estado}
                        onValueChange={(value) => handleEstadoChange(doc.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.fechaCreacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.ultimaModificacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.creadoPor}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('view', doc.id, doc.slug)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('edit', doc.id, doc.slug)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('download', doc.id, doc.slug)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('more', doc.id, doc.slug)}
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDocumentos.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
