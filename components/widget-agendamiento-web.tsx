'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Code,
  Copy,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import Image from 'next/image';

// Mock data para el widget
const especialidades = [
  { id: '1', nombre: 'Ginecología', icono: '👩‍⚕️', color: 'bg-pink-500' },
  { id: '2', nombre: 'Obstetricia', icono: '🤱', color: 'bg-blue-500' },
  { id: '3', nombre: 'Pediatría', icono: '👶', color: 'bg-green-500' },
  { id: '4', nombre: 'Cardiología', icono: '❤️', color: 'bg-red-500' },
  { id: '5', nombre: 'Dermatología', icono: '🧴', color: 'bg-purple-500' }
];

const doctores = [
  { id: '1', nombre: 'Dr. María González', especialidad: '1', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  { id: '2', nombre: 'Dr. Carlos Ruiz', especialidad: '2', horarios: ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00'] },
  { id: '3', nombre: 'Dra. Ana López', especialidad: '3', horarios: ['09:00', '10:30', '12:00', '15:00', '16:30'] },
  { id: '4', nombre: 'Dr. Pedro Martínez', especialidad: '4', horarios: ['08:30', '10:00', '11:30', '14:00', '15:30'] },
  { id: '5', nombre: 'Dra. Laura Sánchez', especialidad: '5', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] }
];

const precios = {
  '1': 120, '2': 150, '3': 100, '4': 180, '5': 110
};

interface WidgetConfig {
  tema: 'claro' | 'oscuro' | 'personalizado';
  colorPrimario: string;
  mostrarPrecios: boolean;
  mostrarDisponibilidad: boolean;
  idioma: 'es' | 'en';
  tamaño: 'pequeño' | 'mediano' | 'grande';
}

export function WidgetAgendamientoWeb() {
  const [config, setConfig] = useState<WidgetConfig>({
    tema: 'claro',
    colorPrimario: '#0EA5A8',
    mostrarPrecios: true,
    mostrarDisponibilidad: true,
    idioma: 'es',
    tamaño: 'mediano'
  });

  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [doctorSeleccionado, setDoctorSeleccionado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [datosPaciente, setDatosPaciente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  // Generar fechas disponibles
  const fechasDisponibles = useMemo(() => {
    const fechas = [];
    const hoy = new Date();
    for (let i = 1; i <= 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      fechas.push({
        fecha: fecha.toISOString().split('T')[0],
        label: fecha.toLocaleDateString('es-ES', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return fechas;
  }, []);

  const doctoresFiltrados = useMemo(() => {
    if (!especialidadSeleccionada) return [];
    return doctores.filter(doctor => doctor.especialidad === especialidadSeleccionada);
  }, [especialidadSeleccionada]);

  const horariosDisponibles = useMemo(() => {
    if (!doctorSeleccionado || !fechaSeleccionada) return [];
    const doctor = doctores.find(d => d.id === doctorSeleccionado);
    return doctor ? doctor.horarios : [];
  }, [doctorSeleccionado, fechaSeleccionada]);

  const especialidad = especialidades.find(e => e.id === especialidadSeleccionada);
  const doctor = doctores.find(d => d.id === doctorSeleccionado);
  const precio = especialidad ? precios[especialidad.id as keyof typeof precios] : 0;

  // Generar código del widget
  const codigoWidget = `
<!-- Widget de Agendamiento FEMINIS SALUD -->
<div id="feminis-widget" style="
  width: ${config.tamaño === 'pequeño' ? '300px' : config.tamaño === 'mediano' ? '400px' : '500px'};
  background: ${config.tema === 'claro' ? '#ffffff' : config.tema === 'oscuro' ? '#1a1a1a' : '#ffffff'};
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
">
  <div style="text-align: center; margin-bottom: 20px;">
    <h3 style="color: ${config.colorPrimario}; margin: 0; font-size: 18px;">
      🏥 FEMINIS SALUD
    </h3>
    <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
      Agenda tu cita online
    </p>
  </div>
  
  <!-- Contenido del widget se cargaría dinámicamente -->
  <div id="widget-content">
    <!-- Aquí se renderizaría el formulario de agendamiento -->
  </div>
</div>

<script>
  // Script para cargar el widget
  (function() {
    const script = document.createElement('script');
    script.src = 'https://feminis-salud.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigoWidget);
    alert('Código del widget copiado al portapapeles');
  };

  const handleDescargarCodigo = () => {
    const blob = new Blob([codigoWidget], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feminis-widget.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Widget de Agendamiento para Página Web
          </CardTitle>
          <CardDescription>
            Genera un widget embebible para tu página web de FEMINIS SALUD
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración del Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Configuración del Widget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tema */}
            <div>
              <Label>Tema</Label>
              <Select 
                value={config.tema} 
                onValueChange={(value) => 
                  setConfig(prev => ({ ...prev, tema: value as 'claro' | 'oscuro' | 'personalizado' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claro">Claro</SelectItem>
                  <SelectItem value="oscuro">Oscuro</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Primario */}
            <div>
              <Label>Color Primario</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={config.colorPrimario}
                  onChange={(e) => setConfig(prev => ({ ...prev, colorPrimario: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={config.colorPrimario}
                  onChange={(e) => setConfig(prev => ({ ...prev, colorPrimario: e.target.value }))}
                  placeholder="#0EA5A8"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <Label>Tamaño del Widget</Label>
              <Select 
                value={config.tamaño} 
                onValueChange={(value) => 
                  setConfig(prev => ({ ...prev, tamaño: value as 'pequeño' | 'mediano' | 'grande' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño (300px)</SelectItem>
                  <SelectItem value="mediano">Mediano (400px)</SelectItem>
                  <SelectItem value="grande">Grande (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Opciones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mostrar Precios</Label>
                <input
                  type="checkbox"
                  checked={config.mostrarPrecios}
                  onChange={(e) => setConfig(prev => ({ ...prev, mostrarPrecios: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar Disponibilidad</Label>
                <input
                  type="checkbox"
                  checked={config.mostrarDisponibilidad}
                  onChange={(e) => setConfig(prev => ({ ...prev, mostrarDisponibilidad: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vista Previa del Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 mx-auto"
              style={{
                width: config.tamaño === 'pequeño' ? '300px' : config.tamaño === 'mediano' ? '400px' : '500px',
                backgroundColor: config.tema === 'claro' ? '#ffffff' : config.tema === 'oscuro' ? '#1a1a1a' : '#ffffff',
                color: config.tema === 'oscuro' ? '#ffffff' : '#000000'
              }}
            >
              {/* Header del Widget */}
              <div className="text-center mb-4">
                <h3 
                  className="text-lg font-bold mb-1"
                  style={{ color: config.colorPrimario }}
                >
                  🏥 FEMINIS SALUD
                </h3>
                <p className="text-sm text-gray-600">Agenda tu cita online</p>
              </div>

              {/* Formulario Simplificado */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Especialidad</label>
                  <select className="w-full p-2 border rounded text-sm">
                    <option>Selecciona una especialidad</option>
                    {especialidades.map(esp => (
                      <option key={esp.id} value={esp.id}>
                        {esp.icono} {esp.nombre}
                        {config.mostrarPrecios && ` - S/ ${precios[esp.id as keyof typeof precios]}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Doctor</label>
                  <select className="w-full p-2 border rounded text-sm">
                    <option>Selecciona un doctor</option>
                    {doctoresFiltrados.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Fecha</label>
                    <select className="w-full p-2 border rounded text-sm">
                      <option>Fecha</option>
                      {fechasDisponibles.slice(0, 3).map(fecha => (
                        <option key={fecha.fecha} value={fecha.fecha}>
                          {fecha.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Hora</label>
                    <select className="w-full p-2 border rounded text-sm">
                      <option>Hora</option>
                      {horariosDisponibles.slice(0, 3).map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  style={{ backgroundColor: config.colorPrimario }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Cita
                </Button>
              </div>

              {config.mostrarDisponibilidad && (
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Disponibilidad en tiempo real</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Código del Widget */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Código del Widget
              </CardTitle>
              <CardDescription>
                Copia este código e intégralo en tu página web
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopiarCodigo}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDescargarCodigo}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>{codigoWidget}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones de Integración */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-4">
            📋 Instrucciones de Integración
          </h4>
          <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-start gap-3">
              <span className="font-bold">1.</span>
              <span>Copia el código HTML del widget</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">2.</span>
              <span>Pega el código en la sección donde quieres que aparezca el widget</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">3.</span>
              <span>El script se cargará automáticamente y mostrará el formulario de agendamiento</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">4.</span>
              <span>Los pacientes podrán agendar citas directamente desde tu página web</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">5.</span>
              <span>Las citas se sincronizarán automáticamente con el sistema interno</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características del Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Responsive
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Se adapta automáticamente a dispositivos móviles y tablets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              Tiempo Real
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Muestra disponibilidad actualizada en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <ExternalLink className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">
              Integración
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Se integra perfectamente con el sistema de gestión
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
