'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface DatosPersonales {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  telefono: string;
  email: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

interface DatosMedicos {
  grupoSanguineo: string;
  alergias: string;
  medicamentosActuales: string;
  antecedentesMedicos: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  parentescoEmergencia: string;
}

interface DatosAcceso {
  username: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
  aceptaPrivacidad: boolean;
  aceptaMarketing: boolean;
}

export function RegistroPacienteWeb() {
  const [step, setStep] = useState(1);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [registroCompletado, setRegistroCompletado] = useState(false);

  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales>({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: 'F',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    distrito: '',
    provincia: '',
    departamento: ''
  });

  const [datosMedicos, setDatosMedicos] = useState<DatosMedicos>({
    grupoSanguineo: '',
    alergias: '',
    medicamentosActuales: '',
    antecedentesMedicos: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    parentescoEmergencia: ''
  });

  const [datosAcceso, setDatosAcceso] = useState<DatosAcceso>({
    username: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
    aceptaPrivacidad: false,
    aceptaMarketing: false
  });

  // Generar username automáticamente
  const generarUsername = () => {
    const inicial = datosPersonales.nombres.charAt(0).toLowerCase();
    const apellido = datosPersonales.apellidos.toLowerCase().replace(/\s+/g, '');
    const numero = Math.floor(Math.random() * 100);
    return `${inicial}${apellido}${numero}`;
  };

  // Generar password automáticamente
  const generarPassword = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  };

  const handleGenerarCredenciales = () => {
    const username = generarUsername();
    const password = generarPassword();
    
    setDatosAcceso(prev => ({
      ...prev,
      username,
      password,
      confirmPassword: password
    }));
  };

  const handleSiguiente = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleAnterior = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegistrar = async () => {
    setIsRegistrando(true);
    
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRegistroCompletado(true);
    setIsRegistrando(false);
  };

  const departamentos = [
    'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque', 
    'Junín', 'Cajamarca', 'Puno', 'Tacna', 'Ica', 'Ancash'
  ];

  const distritos = [
    'Miraflores', 'San Isidro', 'La Molina', 'Surco', 'Pueblo Libre',
    'Jesús María', 'Magdalena', 'San Borja', 'Barranco', 'Chorrillos'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          🏥 FEMINIS SALUD
        </h1>
        <p className="text-muted-foreground">
          Registro de Nuevo Paciente
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Datos Personales</span>
          <span>Información Médica</span>
          <span>Credenciales</span>
          <span>Confirmación</span>
        </div>
      </div>

      {/* Step 1: Datos Personales */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Datos Personales
            </CardTitle>
            <CardDescription>
              Información básica del paciente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={datosPersonales.nombres}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, nombres: e.target.value }))}
                  placeholder="Ingresa tus nombres"
                />
              </div>
              <div>
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={datosPersonales.apellidos}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, apellidos: e.target.value }))}
                  placeholder="Ingresa tus apellidos"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={datosPersonales.fechaNacimiento}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo *</Label>
                <Select 
                  value={datosPersonales.sexo} 
                  onValueChange={(value) => 
                    setDatosPersonales(prev => ({ ...prev, sexo: value as 'M' | 'F' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grupoSanguineo">Grupo Sanguíneo</Label>
                <Select 
                  value={datosMedicos.grupoSanguineo} 
                  onValueChange={(value) => 
                    setDatosMedicos(prev => ({ ...prev, grupoSanguineo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                <Select 
                  value={datosPersonales.tipoDocumento} 
                  onValueChange={(value) => 
                    setDatosPersonales(prev => ({ ...prev, tipoDocumento: value as 'DNI' | 'CE' | 'PASAPORTE' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">Carné de Extranjería</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                <Input
                  id="numeroDocumento"
                  value={datosPersonales.numeroDocumento}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, numeroDocumento: e.target.value }))}
                  placeholder="12345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={datosPersonales.telefono}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="+51 999 999 999"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={datosPersonales.email}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={datosPersonales.direccion}
                onChange={(e) => setDatosPersonales(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Av. Principal 123"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departamento">Departamento *</Label>
                <Select 
                  value={datosPersonales.departamento} 
                  onValueChange={(value) => 
                    setDatosPersonales(prev => ({ ...prev, departamento: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="provincia">Provincia *</Label>
                <Input
                  id="provincia"
                  value={datosPersonales.provincia}
                  onChange={(e) => setDatosPersonales(prev => ({ ...prev, provincia: e.target.value }))}
                  placeholder="Lima"
                />
              </div>
              <div>
                <Label htmlFor="distrito">Distrito *</Label>
                <Select 
                  value={datosPersonales.distrito} 
                  onValueChange={(value) => 
                    setDatosPersonales(prev => ({ ...prev, distrito: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {distritos.map(dist => (
                      <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSiguiente}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Información Médica */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Información Médica
            </CardTitle>
            <CardDescription>
              Datos médicos importantes (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alergias">Alergias Conocidas</Label>
              <Textarea
                id="alergias"
                value={datosMedicos.alergias}
                onChange={(e) => setDatosMedicos(prev => ({ ...prev, alergias: e.target.value }))}
                placeholder="Penicilina, polen, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medicamentosActuales">Medicamentos Actuales</Label>
              <Textarea
                id="medicamentosActuales"
                value={datosMedicos.medicamentosActuales}
                onChange={(e) => setDatosMedicos(prev => ({ ...prev, medicamentosActuales: e.target.value }))}
                placeholder="Lista de medicamentos que tomas actualmente"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="antecedentesMedicos">Antecedentes Médicos</Label>
              <Textarea
                id="antecedentesMedicos"
                value={datosMedicos.antecedentesMedicos}
                onChange={(e) => setDatosMedicos(prev => ({ ...prev, antecedentesMedicos: e.target.value }))}
                placeholder="Enfermedades previas, cirugías, etc."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactoEmergencia">Contacto de Emergencia *</Label>
                <Input
                  id="contactoEmergencia"
                  value={datosMedicos.contactoEmergencia}
                  onChange={(e) => setDatosMedicos(prev => ({ ...prev, contactoEmergencia: e.target.value }))}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="telefonoEmergencia">Teléfono de Emergencia *</Label>
                <Input
                  id="telefonoEmergencia"
                  value={datosMedicos.telefonoEmergencia}
                  onChange={(e) => setDatosMedicos(prev => ({ ...prev, telefonoEmergencia: e.target.value }))}
                  placeholder="+51 999 999 999"
                />
              </div>
              <div>
                <Label htmlFor="parentescoEmergencia">Parentesco *</Label>
                <Select 
                  value={datosMedicos.parentescoEmergencia} 
                  onValueChange={(value) => 
                    setDatosMedicos(prev => ({ ...prev, parentescoEmergencia: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padre">Padre</SelectItem>
                    <SelectItem value="madre">Madre</SelectItem>
                    <SelectItem value="esposo">Esposo</SelectItem>
                    <SelectItem value="esposa">Esposa</SelectItem>
                    <SelectItem value="hijo">Hijo</SelectItem>
                    <SelectItem value="hija">Hija</SelectItem>
                    <SelectItem value="hermano">Hermano</SelectItem>
                    <SelectItem value="hermana">Hermana</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleAnterior}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Credenciales de Acceso */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Credenciales de Acceso
            </CardTitle>
            <CardDescription>
              Crea tu usuario y contraseña para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Generar Credenciales Automáticamente</h4>
                <p className="text-sm text-muted-foreground">
                  El sistema puede generar un usuario y contraseña seguros
                </p>
              </div>
              <Button variant="outline" onClick={handleGenerarCredenciales}>
                Generar
              </Button>
            </div>

            <div>
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                value={datosAcceso.username}
                onChange={(e) => setDatosAcceso(prev => ({ ...prev, username: e.target.value }))}
                placeholder="usuario123"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={datosAcceso.password}
                  onChange={(e) => setDatosAcceso(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 8 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={mostrarConfirmPassword ? "text" : "password"}
                  value={datosAcceso.confirmPassword}
                  onChange={(e) => setDatosAcceso(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Repite tu contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                >
                  {mostrarConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aceptaTerminos"
                  checked={datosAcceso.aceptaTerminos}
                  onChange={(e) => setDatosAcceso(prev => ({ ...prev, aceptaTerminos: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="aceptaTerminos" className="text-sm">
                  Acepto los <a href="#" className="text-primary underline">términos y condiciones</a> *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aceptaPrivacidad"
                  checked={datosAcceso.aceptaPrivacidad}
                  onChange={(e) => setDatosAcceso(prev => ({ ...prev, aceptaPrivacidad: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="aceptaPrivacidad" className="text-sm">
                  Acepto la <a href="#" className="text-primary underline">política de privacidad</a> *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aceptaMarketing"
                  checked={datosAcceso.aceptaMarketing}
                  onChange={(e) => setDatosAcceso(prev => ({ ...prev, aceptaMarketing: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="aceptaMarketing" className="text-sm">
                  Deseo recibir información sobre servicios y promociones
                </Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleAnterior}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <Button onClick={handleSiguiente}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmación */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Confirmación de Registro
            </CardTitle>
            <CardDescription>
              Revisa tus datos antes de completar el registro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumen de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                    Datos Personales
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Nombre:</span>
                      <span className="font-medium">{datosPersonales.nombres} {datosPersonales.apellidos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Documento:</span>
                      <span className="font-medium">{datosPersonales.tipoDocumento} {datosPersonales.numeroDocumento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Teléfono:</span>
                      <span className="font-medium">{datosPersonales.telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Email:</span>
                      <span className="font-medium">{datosPersonales.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                    Credenciales de Acceso
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Usuario:</span>
                      <span className="font-medium font-mono">{datosAcceso.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Contraseña:</span>
                      <span className="font-medium font-mono">••••••••</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información Importante */}
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Información Importante
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Tus credenciales serán enviadas por WhatsApp y email</li>
                      <li>• Podrás cambiar tu contraseña después del primer acceso</li>
                      <li>• Tu información médica es confidencial y segura</li>
                      <li>• Recibirás confirmación de tu registro en 24 horas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleAnterior}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <Button 
                onClick={handleRegistrar}
                disabled={isRegistrando || !datosAcceso.aceptaTerminos || !datosAcceso.aceptaPrivacidad}
              >
                {isRegistrando ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar Registro
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registro Completado */}
      {registroCompletado && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              ¡Registro Completado!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-6">
              Tu cuenta ha sido creada exitosamente. Recibirás tus credenciales por WhatsApp y email.
            </p>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tus Credenciales:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Usuario:</strong> {datosAcceso.username}</p>
                  <p><strong>Contraseña:</strong> {datosAcceso.password}</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setStep(1);
                  setRegistroCompletado(false);
                  setDatosPersonales({
                    nombres: '', apellidos: '', fechaNacimiento: '', sexo: 'F',
                    tipoDocumento: 'DNI', numeroDocumento: '', telefono: '', email: '',
                    direccion: '', distrito: '', provincia: '', departamento: ''
                  });
                  setDatosMedicos({
                    grupoSanguineo: '', alergias: '', medicamentosActuales: '',
                    antecedentesMedicos: '', contactoEmergencia: '', telefonoEmergencia: '',
                    parentescoEmergencia: ''
                  });
                  setDatosAcceso({
                    username: '', password: '', confirmPassword: '',
                    aceptaTerminos: false, aceptaPrivacidad: false, aceptaMarketing: false
                  });
                }}
                variant="outline"
              >
                Registrar Otro Paciente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
