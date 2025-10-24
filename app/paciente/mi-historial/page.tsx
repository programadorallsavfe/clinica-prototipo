"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Calendar, 
  User, 
  Stethoscope, 
  Pill, 
  TestTube, 
  Heart, 
  Activity,
  Download,
  Eye,
  Search,
  Filter,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  FileImage,
  Microscope,
  Zap
} from 'lucide-react';

// Tipos para el historial médico
interface SignosVitales {
  presionArterial: string;
  frecuenciaCardiaca: number;
  temperatura: number;
  peso: number;
  talla: number;
  imc: number;
  saturacionOxigeno?: number;
  frecuenciaRespiratoria?: number;
}

interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  indicaciones?: string;
}

interface Examen {
  nombre: string;
  resultado: string;
  fecha: string;
  laboratorio?: string;
  observaciones?: string;
}

interface ExamenFisico {
  cabeza: string;
  cuello: string;
  torax: string;
  abdomen: string;
  extremidades: string;
  neurologico: string;
  ginecologico?: string;
}

interface ConsultaMedica {
  id: string;
  fecha: string;
  hora: string;
  especialidad: string;
  medico: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  signosVitales?: SignosVitales;
  medicamentos?: Medicamento[];
  examenes?: Examen[];
  examenFisico?: ExamenFisico;
  indicaciones?: string;
  proximaCita?: string;
  examenesSolicitados?: Array<{
    nombre: string;
    fecha: string;
    observaciones?: string;
  }>;
  estado: 'completada' | 'en_seguimiento' | 'urgente';
}

export default function MiHistorialPage() {
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todos');
  const [filtroAño, setFiltroAño] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Mock data para historial médico
  const historialMock: ConsultaMedica[] = [
    {
      id: '1',
      fecha: '2024-12-15',
      hora: '10:15',
      especialidad: 'Ginecología',
      medico: 'Dra. María González',
      motivoConsulta: 'Control prenatal - 28 semanas',
      sintomas: 'Náuseas ocasionales, fatiga leve',
      diagnostico: 'Embarazo normal de 28 semanas',
      tratamiento: 'Continuar vitaminas prenatales, reposo relativo',
      observaciones: 'Paciente en buen estado general, crecimiento fetal adecuado',
      signosVitales: {
        presionArterial: '110/70',
        frecuenciaCardiaca: 85,
        temperatura: 36.5,
        peso: 68,
        talla: 165,
        imc: 25.0,
        saturacionOxigeno: 98,
        frecuenciaRespiratoria: 16
      },
      medicamentos: [
        {
          nombre: 'Ácido Fólico',
          dosis: '400 mcg',
          frecuencia: '1 vez al día',
          duracion: 'Durante todo el embarazo',
          indicaciones: 'Tomar con el desayuno'
        },
        {
          nombre: 'Hierro',
          dosis: '60 mg',
          frecuencia: '1 vez al día',
          duracion: 'Hasta el parto',
          indicaciones: 'Tomar con jugo de naranja'
        }
      ],
      examenes: [
        {
          nombre: 'Hemograma Completo',
          resultado: 'Normal',
          fecha: '2024-12-10',
          laboratorio: 'Lab. Central',
          observaciones: 'Valores dentro de rangos normales'
        },
        {
          nombre: 'Glicemia en Ayunas',
          resultado: '85 mg/dL',
          fecha: '2024-12-10',
          laboratorio: 'Lab. Central',
          observaciones: 'Valor normal'
        }
      ],
      examenFisico: {
        cabeza: 'Normal',
        cuello: 'Sin adenopatías',
        torax: 'Ruidos cardíacos rítmicos',
        abdomen: 'Útero de 28 cm, movimientos fetales presentes',
        extremidades: 'Sin edema',
        neurologico: 'Normal',
        ginecologico: 'Cérvix cerrado, flujo normal'
      },
      indicaciones: 'Continuar control prenatal cada 2 semanas, dieta balanceada',
      proximaCita: '2024-12-29',
      examenesSolicitados: [
        {
          nombre: 'Ecografía Morfológica',
          fecha: '2024-12-20',
          observaciones: 'Para evaluación anatómica fetal'
        }
      ],
      estado: 'completada'
    },
    {
      id: '2',
      fecha: '2024-11-28',
      hora: '14:30',
      especialidad: 'Obstetricia',
      medico: 'Dr. Carlos Mendoza',
      motivoConsulta: 'Ecografía de control - 24 semanas',
      sintomas: 'Sin síntomas específicos',
      diagnostico: 'Embarazo normal de 24 semanas',
      tratamiento: 'Continuar control prenatal',
      observaciones: 'Ecografía normal, crecimiento fetal adecuado para la edad gestacional',
      signosVitales: {
        presionArterial: '115/75',
        frecuenciaCardiaca: 88,
        temperatura: 36.3,
        peso: 65,
        talla: 165,
        imc: 23.9,
        saturacionOxigeno: 99
      },
      examenes: [
        {
          nombre: 'Ecografía Obstétrica',
          resultado: 'Normal',
          fecha: '2024-11-28',
          laboratorio: 'Ecografía Clínica',
          observaciones: 'Feto de 24 semanas, anatomía normal, placenta anterior'
        }
      ],
      examenFisico: {
        cabeza: 'Normal',
        cuello: 'Normal',
        torax: 'Normal',
        abdomen: 'Útero de 24 cm, movimientos fetales activos',
        extremidades: 'Normal',
        neurologico: 'Normal'
      },
      indicaciones: 'Continuar vitaminas, control en 4 semanas',
      proximaCita: '2024-12-15',
      estado: 'completada'
    },
    {
      id: '3',
      fecha: '2024-10-15',
      hora: '09:00',
      especialidad: 'Ginecología',
      medico: 'Dra. María González',
      motivoConsulta: 'Control prenatal - 20 semanas',
      sintomas: 'Ligero aumento de peso, náuseas ocasionales',
      diagnostico: 'Embarazo normal de 20 semanas',
      tratamiento: 'Continuar ácido fólico y hierro',
      observaciones: 'Paciente adaptándose bien al embarazo',
      signosVitales: {
        presionArterial: '108/68',
        frecuenciaCardiaca: 82,
        temperatura: 36.4,
        peso: 62,
        talla: 165,
        imc: 22.8
      },
      medicamentos: [
        {
          nombre: 'Ácido Fólico',
          dosis: '400 mcg',
          frecuencia: '1 vez al día',
          duracion: 'Durante todo el embarazo'
        }
      ],
      examenes: [
        {
          nombre: 'Perfil Prenatal',
          resultado: 'Normal',
          fecha: '2024-10-10',
          laboratorio: 'Lab. Central',
          observaciones: 'Todos los valores dentro de rangos normales'
        }
      ],
      examenFisico: {
        cabeza: 'Normal',
        cuello: 'Normal',
        torax: 'Normal',
        abdomen: 'Útero de 20 cm, movimientos fetales percibidos',
        extremidades: 'Normal',
        neurologico: 'Normal'
      },
      indicaciones: 'Continuar control prenatal, dieta rica en hierro',
      proximaCita: '2024-11-28',
      estado: 'completada'
    },
    {
      id: '4',
      fecha: '2024-09-20',
      hora: '11:00',
      especialidad: 'Nutrición',
      medico: 'Lic. Ana Torres',
      motivoConsulta: 'Consulta nutricional prenatal',
      sintomas: 'Náuseas matutinas, cambios en apetito',
      diagnostico: 'Necesidades nutricionales aumentadas por embarazo',
      tratamiento: 'Plan nutricional personalizado',
      observaciones: 'Paciente con buen estado nutricional, requiere ajustes en dieta',
      signosVitales: {
        presionArterial: '105/65',
        frecuenciaCardiaca: 80,
        temperatura: 36.2,
        peso: 60,
        talla: 165,
        imc: 22.0
      },
      medicamentos: [
        {
          nombre: 'Multivitamínico Prenatal',
          dosis: '1 tableta',
          frecuencia: '1 vez al día',
          duracion: 'Durante todo el embarazo',
          indicaciones: 'Tomar con las comidas'
        }
      ],
      indicaciones: 'Aumentar ingesta de proteínas, ácido fólico y hierro',
      proximaCita: '2024-10-15',
      estado: 'completada'
    }
  ];

  // Filtrar historial
  const historialFiltrado = historialMock.filter(consulta => {
    const cumpleEspecialidad = filtroEspecialidad === 'todos' || consulta.especialidad === filtroEspecialidad;
    const cumpleAño = filtroAño === 'todos' || consulta.fecha.startsWith(filtroAño);
    const cumpleBusqueda = busqueda === '' || 
      consulta.medico.toLowerCase().includes(busqueda.toLowerCase()) ||
      consulta.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      consulta.diagnostico.toLowerCase().includes(busqueda.toLowerCase()) ||
      consulta.motivoConsulta.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleEspecialidad && cumpleAño && cumpleBusqueda;
  });

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      completada: 'bg-green-100 text-green-800 border-green-200',
      en_seguimiento: 'bg-blue-100 text-blue-800 border-blue-200',
      urgente: 'bg-red-100 text-red-800 border-red-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    const iconos: Record<string, React.ReactElement> = {
      completada: <CheckCircle className="h-4 w-4" />,
      en_seguimiento: <Clock className="h-4 w-4" />,
      urgente: <AlertTriangle className="h-4 w-4" />
    };
    return iconos[estado] || <FileText className="h-4 w-4" />;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Componente para mostrar signos vitales
  const SignosVitalesCard = ({ signos }: { signos: SignosVitales }) => (
    <Card className="bg-accent/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Signos Vitales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Presión Arterial:</span>
            <p className="font-medium">{signos.presionArterial} mmHg</p>
          </div>
          <div>
            <span className="text-muted-foreground">Frecuencia Cardíaca:</span>
            <p className="font-medium">{signos.frecuenciaCardiaca} lpm</p>
          </div>
          <div>
            <span className="text-muted-foreground">Temperatura:</span>
            <p className="font-medium">{signos.temperatura}°C</p>
          </div>
          <div>
            <span className="text-muted-foreground">Peso:</span>
            <p className="font-medium">{signos.peso} kg</p>
          </div>
          <div>
            <span className="text-muted-foreground">Talla:</span>
            <p className="font-medium">{signos.talla} cm</p>
          </div>
          <div>
            <span className="text-muted-foreground">IMC:</span>
            <p className="font-medium">{signos.imc}</p>
          </div>
          {signos.saturacionOxigeno && (
            <div>
              <span className="text-muted-foreground">Sat. O₂:</span>
              <p className="font-medium">{signos.saturacionOxigeno}%</p>
            </div>
          )}
          {signos.frecuenciaRespiratoria && (
            <div>
              <span className="text-muted-foreground">Frec. Respiratoria:</span>
              <p className="font-medium">{signos.frecuenciaRespiratoria} rpm</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Componente para mostrar medicamentos
  const MedicamentosCard = ({ medicamentos }: { medicamentos: Medicamento[] }) => (
    <Card className="bg-blue-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Pill className="h-4 w-4 text-blue-600" />
          Medicamentos Recetados
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {medicamentos.map((med, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{med.nombre}</h4>
                <Badge variant="outline" className="text-xs">
                  {med.dosis}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Frecuencia:</span> {med.frecuencia}
                </div>
                <div>
                  <span className="font-medium">Duración:</span> {med.duracion}
                </div>
                {med.indicaciones && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Indicaciones:</span> {med.indicaciones}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Componente para mostrar exámenes
  const ExamenesCard = ({ examenes }: { examenes: Examen[] }) => (
    <Card className="bg-green-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TestTube className="h-4 w-4 text-green-600" />
          Exámenes y Resultados
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {examenes.map((examen, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{examen.nombre}</h4>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{new Date(examen.fecha).toLocaleDateString('es-ES')}</p>
                  {examen.laboratorio && <p className="text-xs">{examen.laboratorio}</p>}
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium text-green-700">Resultado:</span>
                  <span className="ml-2 text-foreground">{examen.resultado}</span>
                </div>
                {examen.observaciones && (
                  <div>
                    <span className="font-medium text-muted-foreground">Observaciones:</span>
                    <span className="ml-2 text-foreground">{examen.observaciones}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Componente para mostrar una consulta
  const ConsultaCard = ({ consulta }: { consulta: ConsultaMedica }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {consulta.especialidad}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {consulta.medico}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatearFecha(consulta.fecha)} - {consulta.hora}
            </p>
          </div>
          <Badge className={`${getEstadoColor(consulta.estado)} flex items-center gap-1`}>
            {getEstadoIcon(consulta.estado)}
            {consulta.estado.charAt(0).toUpperCase() + consulta.estado.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Motivo y Diagnóstico */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-foreground mb-1">Motivo de Consulta</h4>
            <p className="text-sm text-muted-foreground">{consulta.motivoConsulta}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Síntomas</h4>
            <p className="text-sm text-muted-foreground">{consulta.sintomas}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Diagnóstico</h4>
            <p className="text-sm text-primary font-medium">{consulta.diagnostico}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Tratamiento</h4>
            <p className="text-sm text-muted-foreground">{consulta.tratamiento}</p>
          </div>
          {consulta.observaciones && (
            <div>
              <h4 className="font-medium text-foreground mb-1">Observaciones</h4>
              <p className="text-sm text-muted-foreground">{consulta.observaciones}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Signos Vitales */}
        {consulta.signosVitales && (
          <SignosVitalesCard signos={consulta.signosVitales} />
        )}

        {/* Medicamentos */}
        {consulta.medicamentos && consulta.medicamentos.length > 0 && (
          <MedicamentosCard medicamentos={consulta.medicamentos} />
        )}

        {/* Exámenes */}
        {consulta.examenes && consulta.examenes.length > 0 && (
          <ExamenesCard examenes={consulta.examenes} />
        )}

        {/* Examen Físico */}
        {consulta.examenFisico && (
          <Card className="bg-purple-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-purple-600" />
                Examen Físico
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Cabeza:</span>
                  <p className="font-medium">{consulta.examenFisico.cabeza}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cuello:</span>
                  <p className="font-medium">{consulta.examenFisico.cuello}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tórax:</span>
                  <p className="font-medium">{consulta.examenFisico.torax}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Abdomen:</span>
                  <p className="font-medium">{consulta.examenFisico.abdomen}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Extremidades:</span>
                  <p className="font-medium">{consulta.examenFisico.extremidades}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Neurológico:</span>
                  <p className="font-medium">{consulta.examenFisico.neurologico}</p>
                </div>
                {consulta.examenFisico.ginecologico && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Ginecológico:</span>
                    <p className="font-medium">{consulta.examenFisico.ginecologico}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicaciones y Próxima Cita */}
        <div className="space-y-3">
          {consulta.indicaciones && (
            <div>
              <h4 className="font-medium text-foreground mb-1">Indicaciones</h4>
              <p className="text-sm text-muted-foreground">{consulta.indicaciones}</p>
            </div>
          )}
          {consulta.proximaCita && (
            <div>
              <h4 className="font-medium text-foreground mb-1">Próxima Cita</h4>
              <p className="text-sm text-primary font-medium">
                {formatearFecha(consulta.proximaCita)}
              </p>
            </div>
          )}
        </div>

        {/* Exámenes Solicitados */}
        {consulta.examenesSolicitados && consulta.examenesSolicitados.length > 0 && (
          <Card className="bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Microscope className="h-4 w-4 text-orange-600" />
                Exámenes Solicitados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {consulta.examenesSolicitados.map((examen, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <p className="font-medium text-sm">{examen.nombre}</p>
                      {examen.observaciones && (
                        <p className="text-xs text-muted-foreground">{examen.observaciones}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(examen.fecha).toLocaleDateString('es-ES')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>+51 987 654 321</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>maria.gonzalez@clinica.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Ver Completo
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Historial Médico</h1>
          <p className="text-muted-foreground mt-1">
            Consulta tu historial médico completo y registros de consultas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar PDF
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Nueva Consulta
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por médico, especialidad, diagnóstico o motivo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filtroEspecialidad}
                onChange={(e) => setFiltroEspecialidad(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todas las especialidades</option>
                <option value="Ginecología">Ginecología</option>
                <option value="Obstetricia">Obstetricia</option>
                <option value="Nutrición">Nutrición</option>
              </select>
              <select
                value={filtroAño}
                onChange={(e) => setFiltroAño(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="todos">Todos los años</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Consultas</p>
                <p className="text-2xl font-bold text-foreground">
                  {historialFiltrado.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-foreground">
                  {historialFiltrado.filter(c => c.estado === 'completada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Seguimiento</p>
                <p className="text-2xl font-bold text-foreground">
                  {historialFiltrado.filter(c => c.estado === 'en_seguimiento').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Especialidades</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(historialFiltrado.map(c => c.especialidad)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de consultas */}
      <div className="space-y-4">
        {historialFiltrado.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron registros
              </h3>
              <p className="text-muted-foreground">
                No hay consultas que coincidan con los filtros seleccionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historialFiltrado.map((consulta) => (
              <ConsultaCard key={consulta.id} consulta={consulta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
