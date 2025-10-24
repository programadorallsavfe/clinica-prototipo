'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Stethoscope, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Interfaces para el módulo de especialidades
interface Especialidad {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // en minutos
  estado: 'activa' | 'inactiva';
  doctoresAsignados: number;
  citasRealizadas: number;
  ingresosGenerados: number;
  fechaCreacion: string;
  ultimaModificacion: string;
}

interface DoctorEspecialidad {
  id: string;
  nombre: string;
  apellidos: string;
  cmp: string;
  especialidad: string;
  estado: 'activo' | 'inactivo';
}

export const EspecialidadesPage = () => {
  const [activeTab, setActiveTab] = useState('especialidades');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEspecialidad, setNewEspecialidad] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 30
  });

  // Mock data para especialidades
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([
    {
      id: '1',
      nombre: 'Medicina General',
      descripcion: 'Atención médica integral para pacientes de todas las edades',
      precio: 80,
      duracion: 30,
      estado: 'activa',
      doctoresAsignados: 3,
      citasRealizadas: 245,
      ingresosGenerados: 19600,
      fechaCreacion: '2024-01-15',
      ultimaModificacion: '2024-01-20'
    },
    {
      id: '2',
      nombre: 'Ginecología y Obstetricia',
      descripcion: 'Especialidad en salud reproductiva femenina y embarazo',
      precio: 120,
      duracion: 45,
      estado: 'activa',
      doctoresAsignados: 2,
      citasRealizadas: 189,
      ingresosGenerados: 22680,
      fechaCreacion: '2024-01-10',
      ultimaModificacion: '2024-01-18'
    },
    {
      id: '3',
      nombre: 'Pediatría',
      descripcion: 'Atención médica especializada para niños y adolescentes',
      precio: 100,
      duracion: 35,
      estado: 'activa',
      doctoresAsignados: 2,
      citasRealizadas: 156,
      ingresosGenerados: 15600,
      fechaCreacion: '2024-01-12',
      ultimaModificacion: '2024-01-19'
    },
    {
      id: '4',
      nombre: 'Cardiología',
      descripcion: 'Diagnóstico y tratamiento de enfermedades del corazón',
      precio: 150,
      duracion: 50,
      estado: 'activa',
      doctoresAsignados: 1,
      citasRealizadas: 98,
      ingresosGenerados: 14700,
      fechaCreacion: '2024-01-08',
      ultimaModificacion: '2024-01-17'
    },
    {
      id: '5',
      nombre: 'Dermatología',
      descripcion: 'Tratamiento de enfermedades de la piel, pelo y uñas',
      precio: 130,
      duracion: 40,
      estado: 'inactiva',
      doctoresAsignados: 0,
      citasRealizadas: 0,
      ingresosGenerados: 0,
      fechaCreacion: '2024-01-05',
      ultimaModificacion: '2024-01-16'
    }
  ]);

  // Mock data para doctores por especialidad
  const [doctoresEspecialidad, setDoctoresEspecialidad] = useState<DoctorEspecialidad[]>([
    {
      id: '1',
      nombre: 'Carlos',
      apellidos: 'Sánchez López',
      cmp: '12345',
      especialidad: 'Medicina General',
      estado: 'activo'
    },
    {
      id: '2',
      nombre: 'María',
      apellidos: 'González Pérez',
      cmp: '23456',
      especialidad: 'Ginecología y Obstetricia',
      estado: 'activo'
    },
    {
      id: '3',
      nombre: 'Ana',
      apellidos: 'Rodríguez Silva',
      cmp: '34567',
      especialidad: 'Pediatría',
      estado: 'activo'
    }
  ]);

  // Funciones de manejo
  const handleCreateEspecialidad = () => {
    if (newEspecialidad.nombre && newEspecialidad.descripcion && newEspecialidad.precio > 0) {
      const nuevaEspecialidad: Especialidad = {
        id: Date.now().toString(),
        ...newEspecialidad,
        estado: 'activa',
        doctoresAsignados: 0,
        citasRealizadas: 0,
        ingresosGenerados: 0,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimaModificacion: new Date().toISOString().split('T')[0]
      };
      
      setEspecialidades([...especialidades, nuevaEspecialidad]);
      setNewEspecialidad({ nombre: '', descripcion: '', precio: 0, duracion: 30 });
      setIsCreating(false);
    }
  };

  const handleEditEspecialidad = (id: string) => {
    setEditingId(id);
  };

  const handleDeleteEspecialidad = (id: string) => {
    setEspecialidades(especialidades.filter(esp => esp.id !== id));
  };

  const handleToggleEstado = (id: string) => {
    setEspecialidades(especialidades.map(esp => 
      esp.id === id 
        ? { ...esp, estado: esp.estado === 'activa' ? 'inactiva' : 'activa' }
        : esp
    ));
  };

  // Filtros
  const especialidadesFiltradas = especialidades.filter(esp =>
    esp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    esp.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const especialidadesActivas = especialidades.filter(esp => esp.estado === 'activa');
  const totalIngresos = especialidades.reduce((sum, esp) => sum + esp.ingresosGenerados, 0);
  const totalCitas = especialidades.reduce((sum, esp) => sum + esp.citasRealizadas, 0);

    return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Especialidades Médicas</h1>
          <p className="text-muted-foreground">
            Gestión de especialidades médicas y asignación de doctores
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Plus className="h-4 w-4" />
          Nueva Especialidad
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Especialidades</p>
                <p className="text-2xl font-bold text-foreground">{especialidades.length}</p>
              </div>
              <Stethoscope className="h-8 w-8" style={{ color: 'var(--primary)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Especialidades Activas</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                  {especialidadesActivas.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: 'var(--success)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
                  {totalCitas}
                </p>
              </div>
              <Users className="h-8 w-8" style={{ color: 'var(--info)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                  S/ {totalIngresos.toLocaleString('es-ES')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8" style={{ color: 'var(--warning)' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="especialidades" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Especialidades</span>
          </TabsTrigger>
          <TabsTrigger value="doctores" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Doctores</span>
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Estadísticas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Especialidades */}
        <TabsContent value="especialidades" className="mt-6">
          <div className="space-y-6">
            {/* Filtros y Búsqueda */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar especialidades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Modal de Creación */}
            {isCreating && (
              <Card>
                <CardHeader>
                  <CardTitle>Nueva Especialidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la Especialidad</Label>
                      <Input
                        id="nombre"
                        value={newEspecialidad.nombre}
                        onChange={(e) => setNewEspecialidad({...newEspecialidad, nombre: e.target.value})}
                        placeholder="Ej: Cardiología"
                      />
                    </div>
                    <div>
                      <Label htmlFor="precio">Precio (S/)</Label>
                      <Input
                        id="precio"
                        type="number"
                        value={newEspecialidad.precio}
                        onChange={(e) => setNewEspecialidad({...newEspecialidad, precio: Number(e.target.value)})}
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duracion">Duración (minutos)</Label>
                      <Input
                        id="duracion"
                        type="number"
                        value={newEspecialidad.duracion}
                        onChange={(e) => setNewEspecialidad({...newEspecialidad, duracion: Number(e.target.value)})}
                        placeholder="30"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Input
                        id="descripcion"
                        value={newEspecialidad.descripcion}
                        onChange={(e) => setNewEspecialidad({...newEspecialidad, descripcion: e.target.value})}
                        placeholder="Descripción de la especialidad..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateEspecialidad}>
                      Crear Especialidad
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Especialidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Doctores</TableHead>
                        <TableHead>Citas</TableHead>
                        <TableHead>Ingresos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {especialidadesFiltradas.map((especialidad) => (
                        <TableRow key={especialidad.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{especialidad.nombre}</p>
                              <p className="text-sm text-muted-foreground">
                                {especialidad.descripcion}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              S/ {especialidad.precio}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {especialidad.duracion} min
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {especialidad.doctoresAsignados} doctores
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {especialidad.citasRealizadas}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium" style={{ color: 'var(--success)' }}>
                              S/ {especialidad.ingresosGenerados.toLocaleString('es-ES')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={especialidad.estado === 'activa' ? 'default' : 'secondary'}
                              style={{
                                backgroundColor: especialidad.estado === 'activa' 
                                  ? 'var(--success)' 
                                  : 'var(--muted)',
                                color: especialidad.estado === 'activa' 
                                  ? 'var(--success-foreground)' 
                                  : 'var(--muted-foreground)'
                              }}
                            >
                              {especialidad.estado === 'activa' ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEspecialidad(especialidad.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleEstado(especialidad.id)}
                              >
                                {especialidad.estado === 'activa' ? (
                                  <XCircle className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEspecialidad(especialidad.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Doctores por Especialidad */}
        <TabsContent value="doctores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Doctores por Especialidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>CMP</TableHead>
                      <TableHead>Especialidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctoresEspecialidad.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Dr. {doctor.nombre} {doctor.apellidos}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doctor.cmp}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{doctor.especialidad}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={doctor.estado === 'activo' ? 'default' : 'secondary'}
                            style={{
                              backgroundColor: doctor.estado === 'activo' 
                                ? 'var(--success)' 
                                : 'var(--muted)',
                              color: doctor.estado === 'activo' 
                                ? 'var(--success-foreground)' 
                                : 'var(--muted-foreground)'
                            }}
                          >
                            {doctor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Estadísticas */}
        <TabsContent value="estadisticas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Especialidades Más Rentables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {especialidades
                    .sort((a, b) => b.ingresosGenerados - a.ingresosGenerados)
                    .slice(0, 5)
                    .map((esp, index) => (
                      <div key={esp.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: `var(--chart-${index + 1})` }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{esp.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {esp.citasRealizadas} citas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: 'var(--success)' }}>
                            S/ {esp.ingresosGenerados.toLocaleString('es-ES')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            S/ {esp.precio} por cita
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                    <div>
                      <p className="text-sm text-muted-foreground">Especialidades Activas</p>
                      <p className="text-2xl font-bold text-foreground">
                        {especialidadesActivas.length} / {especialidades.length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8" style={{ color: 'var(--success)' }} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                    <div>
                      <p className="text-sm text-muted-foreground">Promedio de Precio</p>
                      <p className="text-2xl font-bold text-foreground">
                        S/ {Math.round(especialidades.reduce((sum, esp) => sum + esp.precio, 0) / especialidades.length)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8" style={{ color: 'var(--warning)' }} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                    <div>
                      <p className="text-sm text-muted-foreground">Promedio de Duración</p>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(especialidades.reduce((sum, esp) => sum + esp.duracion, 0) / especialidades.length)} min
                      </p>
                    </div>
                    <Clock className="h-8 w-8" style={{ color: 'var(--info)' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EspecialidadesPage;  