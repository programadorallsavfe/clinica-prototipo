'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { getSession, generarUsername, generarPasswordTemporal } from '@/lib/auth';
import { 
  pacientesStorage, 
  usuariosStorage, 
  generateId, 
  getCurrentTimestamp, 
  logAuditoria 
} from '@/lib/storage';
import { Paciente as MockPaciente, Usuario } from '@/lib/types';
import { Paciente } from '@/lib/mockData';
import { UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AddPacientesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPacientesModal = ({ isOpen, onClose, onSuccess }: AddPacientesModalProps) => {
  const [formData, setFormData] = useState({
    nombreLegal: '',
    apellidos: '',
    dni: '',
    extranjero: false,
    email: '',
    convenio: 'sin-convenio',
    numeroInterno: '',
    sexo: 'masculino' as 'masculino' | 'femenino' | 'otro',
    fechaNacimiento: {
      dia: '',
      mes: '',
      año: ''
    },
    ciudad: '',
    distrito: '',
    direccion: '',
    telefonoMovil: '',
    actividadProfesion: '',
    empleador: '',
    observaciones: '',
    apoderado: '',
    referencia: '',
    servicios: [] as string[],
    rutApoderado: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string } | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('fechaNacimiento.')) {
      const dateField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        fechaNacimiento: {
          ...prev.fechaNacimiento,
          [dateField]: value as string
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    // Limpiar errores al escribir
    if (error) setError('');
  };

  const handleServicioToggle = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }));
    // Limpiar errores al seleccionar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombreLegal.trim()) {
      setError('El nombre legal es obligatorio');
      return false;
    }
    if (!formData.apellidos.trim()) {
      setError('Los apellidos son obligatorios');
      return false;
    }
    if (!formData.dni.trim()) {
      setError('El DNI es obligatorio');
      return false;
    }
    if (!formData.telefonoMovil.trim()) {
      setError('El teléfono móvil es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento.dia || !formData.fechaNacimiento.mes || !formData.fechaNacimiento.año) {
      setError('La fecha de nacimiento es obligatoria');
      return false;
    }

    // Validar que se seleccione al menos un servicio
    if (formData.servicios.length === 0) {
      setError('Debe seleccionar al menos un servicio');
      return false;
    }

    // Validar que el documento no exista
    const pacienteExistente = pacientesStorage.findOne(p => p.documento === formData.dni);
    if (pacienteExistente) {
      setError('Ya existe un paciente con este DNI');
      return false;
    }

    // Validar que el email no exista
    const emailExistente = pacientesStorage.findOne(p => p.email === formData.email);
    if (emailExistente) {
      setError('Ya existe un paciente con este email');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const session = getSession();
      
      // Crear usuario
      const username = generarUsername(formData.nombreLegal, formData.apellidos);
      const password = generarPasswordTemporal();

      const nuevoUsuario: Usuario = {
        id: generateId('user'),
        username,
        password,
        rol: 'paciente',
        email: formData.email,
        telefono: formData.telefonoMovil,
        activo: true,
        fechaCreacion: getCurrentTimestamp(),
      };
      usuariosStorage.create(nuevoUsuario);

      // Crear paciente
      const nuevoPaciente: MockPaciente = {
        id: generateId('pac'),
        usuarioId: nuevoUsuario.id,
        nombres: formData.nombreLegal,
        apellidos: formData.apellidos,
        documento: formData.dni,
        telefono: formData.telefonoMovil,
        email: formData.email,
        preferenciaContacto: 'whatsapp',
        fechaRegistro: getCurrentTimestamp(),
        activo: true,
      };
      pacientesStorage.create(nuevoPaciente);

      // Log de auditoría
      if (session) {
        logAuditoria(
          session.userId,
          session.username,
          'Crear paciente',
          'Paciente',
          nuevoPaciente.id,
          undefined,
          nuevoPaciente as unknown as Record<string, unknown>
        );
      }

      setCreatedCredentials({ username, password });
      setSuccess(true);
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      setError('Error al crear el paciente. Inténtalo de nuevo.');
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nombreLegal: '',
        apellidos: '',
        dni: '',
        extranjero: false,
        email: '',
        convenio: 'sin-convenio',
        numeroInterno: '',
        sexo: 'masculino',
        fechaNacimiento: {
          dia: '',
          mes: '',
          año: ''
        },
        ciudad: '',
        distrito: '',
        direccion: '',
        telefonoMovil: '',
        actividadProfesion: '',
        empleador: '',
        observaciones: '',
        apoderado: '',
        referencia: '',
        servicios: [],
        rutApoderado: '',
      });
      setError('');
      setSuccess(false);
      setCreatedCredentials(null);
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Nuevo Paciente
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Registra un nuevo paciente en el sistema
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {success && createdCredentials ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    ¡Paciente creado exitosamente!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    El paciente ha sido registrado en el sistema
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Credenciales generadas:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Usuario:</Label>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={createdCredentials.username}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.username)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Contraseña:</Label>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={createdCredentials.password}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(createdCredentials.password)}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  📱 Envía estas credenciales por WhatsApp al paciente
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
                  Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreLegal" className="text-sm font-medium">
                      Nombre Legal *
                    </Label>
                    <Input
                      id="nombreLegal"
                      value={formData.nombreLegal}
                      onChange={(e) => handleInputChange('nombreLegal', e.target.value)}
                      placeholder="Nombre completo como figura en DNI"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-sm font-medium">
                      Apellidos *
                    </Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      placeholder="Apellidos paterno y materno"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni" className="text-sm font-medium">
                      DNI *
                    </Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => handleInputChange('dni', e.target.value)}
                      placeholder="Documento nacional de identidad"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroInterno" className="text-sm font-medium">
                      Número Interno
                    </Label>
                    <Input
                      id="numeroInterno"
                      value={formData.numeroInterno}
                      onChange={(e) => handleInputChange('numeroInterno', e.target.value)}
                      placeholder="Código interno de la clínica"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sexo" className="text-sm font-medium">
                      Sexo *
                    </Label>
                    <Select
                      value={formData.sexo}
                      onValueChange={(value) => handleInputChange('sexo', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar sexo">
                          {formData.sexo === 'masculino' ? 'Masculino' :
                           formData.sexo === 'femenino' ? 'Femenino' :
                           formData.sexo === 'otro' ? 'Otro' :
                           'Seleccionar sexo'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extranjero"
                    checked={formData.extranjero}
                    onCheckedChange={(checked) => handleInputChange('extranjero', checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="extranjero" className="text-sm font-medium">
                    Extranjero (no tiene DNI peruano)
                  </Label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dia" className="text-sm font-medium">
                      Día *
                    </Label>
                    <Select
                      value={formData.fechaNacimiento.dia}
                      onValueChange={(value) => handleInputChange('fechaNacimiento.dia', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Día">
                          {formData.fechaNacimiento.dia || 'Día'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mes" className="text-sm font-medium">
                      Mes *
                    </Label>
                    <Select
                      value={formData.fechaNacimiento.mes}
                      onValueChange={(value) => handleInputChange('fechaNacimiento.mes', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Mes">
                          {formData.fechaNacimiento.mes || 'Mes'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="año" className="text-sm font-medium">
                      Año *
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentYear = parseInt(formData.fechaNacimiento.año) || new Date().getFullYear();
                          const newYear = Math.max(1900, currentYear - 1);
                          handleInputChange('fechaNacimiento.año', String(newYear));
                        }}
                        disabled={loading}
                        className="h-10 w-10 p-0 shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        id="año"
                        type="number"
                        value={formData.fechaNacimiento.año}
                        onChange={(e) => handleInputChange('fechaNacimiento.año', e.target.value)}
                        placeholder="Año"
                        disabled={loading}
                        className="w-full text-center"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentYear = parseInt(formData.fechaNacimiento.año) || new Date().getFullYear();
                          const newYear = Math.min(new Date().getFullYear(), currentYear + 1);
                          handleInputChange('fechaNacimiento.año', String(newYear));
                        }}
                        disabled={loading}
                        className="h-10 w-10 p-0 shrink-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información de Contacto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefonoMovil" className="text-sm font-medium">
                      Teléfono Móvil *
                    </Label>
                    <Input
                      id="telefonoMovil"
                      value={formData.telefonoMovil}
                      onChange={(e) => handleInputChange('telefonoMovil', e.target.value)}
                      placeholder="+51 987 654 321"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      E-Mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="correo@ejemplo.com"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-sm font-medium">
                      Ciudad
                    </Label>
                    <Input
                      id="ciudad"
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      placeholder="Ciudad de residencia"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distrito" className="text-sm font-medium">
                      Distrito
                    </Label>
                    <Input
                      id="distrito"
                      value={formData.distrito}
                      onChange={(e) => handleInputChange('distrito', e.target.value)}
                      placeholder="Distrito del paciente"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="convenio" className="text-sm font-medium">
                      Convenio
                    </Label>
                    <Select
                      value={formData.convenio}
                      onValueChange={(value) => handleInputChange('convenio', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar convenio">
                          {formData.convenio === 'sin-convenio' ? 'Sin convenio' :
                           formData.convenio === 'rimac' ? 'Rímac' :
                           formData.convenio === 'pacifico' ? 'Pacífico' :
                           formData.convenio === 'pacifico-salud' ? 'Pacífico Salud' :
                           formData.convenio === 'backus' ? 'Backus' :
                           formData.convenio === 'otro' ? 'Otro' :
                           'Seleccionar convenio'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-convenio">Sin convenio</SelectItem>
                        <SelectItem value="rimac">Rímac</SelectItem>
                        <SelectItem value="pacifico">Pacífico</SelectItem>
                        <SelectItem value="pacifico-salud">Pacífico Salud</SelectItem>
                        <SelectItem value="backus">Backus</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-sm font-medium">
                    Dirección
                  </Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Dirección exacta de domicilio"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Información Profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Profesional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actividadProfesion" className="text-sm font-medium">
                      Actividad o Profesión
                    </Label>
                    <Input
                      id="actividadProfesion"
                      value={formData.actividadProfesion}
                      onChange={(e) => handleInputChange('actividadProfesion', e.target.value)}
                      placeholder="Ocupación actual del paciente"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empleador" className="text-sm font-medium">
                      Empleador
                    </Label>
                    <Input
                      id="empleador"
                      value={formData.empleador}
                      onChange={(e) => handleInputChange('empleador', e.target.value)}
                      placeholder="Empresa o entidad donde trabaja"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Servicios * (Seleccione uno o más)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/20">
                    {[
                      { value: 'cardiologia', label: 'CARDIOLOGÍA' },
                      { value: 'cirugia', label: 'CIRUGÍA' },
                      { value: 'dermatologia', label: 'DERMATOLOGÍA' },
                      { value: 'endocrinologia', label: 'ENDOCRINOLOGÍA' },
                      { value: 'gastroenterologia', label: 'GASTROENTEROLOGÍA' },
                      { value: 'gestante', label: 'GESTANTE' },
                      { value: 'ginecologia', label: 'GINECOLOGÍA' },
                      { value: 'infertilidad', label: 'INFERTILIDAD' },
                      { value: 'menopausia', label: 'MENOPAUSIA' },
                      { value: 'nutricion', label: 'NUTRICIÓN' },
                      { value: 'operaciones', label: 'OPERACIONES' },
                      { value: 'pediatria', label: 'PEDIATRÍA' },
                      { value: 'planificacion-familiar', label: 'PLANIFICACIÓN FAMILIAR' },
                      { value: 'prevencion-cancer', label: 'PREVENCIÓN CÁNCER' },
                      { value: 'procedimiento', label: 'PROCEDIMIENTO' },
                      { value: 'psicologia', label: 'PSICOLOGÍA' },
                      { value: 'radiologia', label: 'RADIOLOGÍA' },
                      { value: 'urologia', label: 'UROLOGÍA' },
                    ].map((servicio) => (
                      <div key={servicio.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`servicio-${servicio.value}`}
                          checked={formData.servicios.includes(servicio.value)}
                          onCheckedChange={() => handleServicioToggle(servicio.value)}
                          disabled={loading}
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success dark:data-[state=checked]:bg-green-500 dark:data-[state=checked]:border-green-500 [&>svg]:!text-white [&>svg]:!fill-white dark:[&>svg]:!text-white dark:[&>svg]:!fill-white"
                        />
                        <Label 
                          htmlFor={`servicio-${servicio.value}`} 
                          className="text-xs font-medium cursor-pointer flex-1 leading-tight"
                        >
                          {servicio.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.servicios.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Servicios seleccionados: {formData.servicios.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Información Adicional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Adicional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apoderado" className="text-sm font-medium">
                      Apoderado
                    </Label>
                    <Input
                      id="apoderado"
                      value={formData.apoderado}
                      onChange={(e) => handleInputChange('apoderado', e.target.value)}
                      placeholder="Nombre del representante o tutor"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rutApoderado" className="text-sm font-medium">
                      RUT Apoderado
                    </Label>
                    <Input
                      id="rutApoderado"
                      value={formData.rutApoderado}
                      onChange={(e) => handleInputChange('rutApoderado', e.target.value)}
                      placeholder="Documento de identidad del apoderado"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referencia" className="text-sm font-medium">
                    Referencia
                  </Label>
                  <Input
                    id="referencia"
                    value={formData.referencia}
                    onChange={(e) => handleInputChange('referencia', e.target.value)}
                    placeholder="Persona o fuente que recomendó al paciente"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="text-sm font-medium">
                    Observaciones
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    placeholder="Campo libre para observaciones clínicas o administrativas"
                    disabled={loading}
                    className="w-full min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Creando...' : 'Crear Paciente'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};       