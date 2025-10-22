'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Download, 
  ArrowLeft,
  Type,
  Image as ImageIcon,
  AlignLeft,
  Minus,
  Copy
} from 'lucide-react';

interface DocumentField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'title' | 'separator';
  label: string;
  value: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface DocumentoClinico {
  id: string;
  nombre: string;
  slug: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaCreacion: string;
  ultimaModificacion: string;
  creadoPor: string;
}

export default function DocumentoEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState<DocumentField[]>([
    {
      id: '1',
      type: 'title',
      label: 'Título del Documento',
      value: 'ECOGRAFÍA PRIMER TRIMESTRE INICIAL'
    },
    {
      id: '2',
      type: 'text',
      label: 'FUR',
      value: '',
      placeholder: 'Fecha de última regla'
    },
    {
      id: '3',
      type: 'text',
      label: 'Edad Gestacional',
      value: '',
      placeholder: 'Semanas de gestación'
    },
    {
      id: '4',
      type: 'textarea',
      label: 'Útero',
      value: 'AVF: Bordes regulares, medidas x mm.',
      placeholder: 'Descripción del útero'
    },
    {
      id: '5',
      type: 'textarea',
      label: 'Saco Gestacional',
      value: '',
      placeholder: 'Descripción del saco gestacional'
    },
    {
      id: '6',
      type: 'text',
      label: 'Medida',
      value: '',
      placeholder: 'Medidas en mm'
    },
    {
      id: '7',
      type: 'text',
      label: 'Ubicación',
      value: '',
      placeholder: 'Ubicación del saco'
    }
  ]);

  // Función para obtener el nombre del documento basado en el slug
  const getDocumentName = (slug: string): string => {
    const documentNames: { [key: string]: string } = {
      'certificado-matrimonio': 'CERTIFICADO PARA MATRIMONIO',
      'certificado-descanso-medico': 'CERTIFICADO DESCANSO MÉDICO',
      'certificado-trabajar': 'CERTIFICADO PARA TRABAJAR',
      'informe-colposcopia': 'INFORME COLPOSCOPIA',
      'certificado-essalud': 'CERTIFICADO ESSALUD',
      'ecografia-primer-trimestre-inicial': 'ECOGRAFÍA PRIMER TRIMESTRE INICIAL',
      'ecografia-primer-trimestre-no-inicial': 'ECOGRAFÍA PRIMER TRIMESTRE NO INICIAL',
      'ecografia-ginecologica-con-tumor': 'ECOGRAFÍA GINECOLÓGICA CON TUMOR',
      'ecografia-ginecologica-sin-tumor': 'ECOGRAFÍA GINECOLÓGICA SIN TUMOR',
      'ecografia-abdominal': 'ECOGRAFÍA ABDOMINAL',
      'ecografia-genetica': 'ECOGRAFÍA GENÉTICA',
      'ecografia-morfologica': 'ECOGRAFÍA MORFOLÓGICA',
      'ecografia-mama': 'ECOGRAFÍA MAMA',
      'ecografia-prostata': 'ECOGRAFÍA PRÓSTATA',
      'ecografia-renal-vesical': 'ECOGRAFÍA RENAL Y VESICAL',
      'ecografia-obstetrica': 'ECOGRAFÍA OBSTÉTRICA',
      'ecografia-testicular': 'ECOGRAFÍA TESTICULAR',
      'radiologo-ecografia-abdominal-completa': 'RADIÓLOGO ECOGRAFÍA ABDOMINAL COMPLETA',
      'radiologo-ecografia-abdominal-simple': 'RADIÓLOGO ECOGRAFÍA ABDOMINAL SIMPLE',
      'radiologo-ecografia-hombro': 'RADIÓLOGO ECOGRAFÍA HOMBRO',
      'radiologo-ecografia-prostatica': 'RADIÓLOGO ECOGRAFÍA PROSTÁTICA',
      'radiologo-ecografia-mamas': 'RADIÓLOGO ECOGRAFÍA MAMAS',
      'radiologo-ecografia-partes-blandas-musculo-esqueletico': 'RADIÓLOGO ECOGRAFÍA PARTES BLANDAS - MÚSCULO ESQUELÉTICO',
      'radiologo-ecografia-tiroides': 'RADIÓLOGO ECOGRAFÍA DE TIROIDES',
      'monitoreo-diabetes-gestacional': 'MONITOREO DIABETES GESTACIONAL',
      'radiologo-ecografia-renal-vesical': 'RADIÓLOGO ECOGRAFÍA RENAL Y VESICAL',
      'radiologo-ecografia-testicular': 'RADIÓLOGO ECOGRAFÍA TESTICULAR',
      'hoja-referencia': 'HOJA DE REFERENCIA',
      'ecografia-obstetrica-2-3-trimestre-gemelar': 'ECOGRAFÍA OBSTÉTRICA 2 - 3 TRIMESTRE GEMELAR',
      'ecografia-genetica-gemelar': 'ECOGRAFÍA GENÉTICA - GEMELAR',
      'ecografia-morfologica-gemelar': 'ECOGRAFÍA MORFOLÓGICA GEMELAR',
      'informe-uretrocistoscopia': 'INFORME DE URETROCISTOSCOPÍA',
      'ecografia-mamaria-nuevo': 'ECOGRAFÍA MAMARIA - NUEVO',
      'escala-mrs-menopausia': 'ESCALA MRS MENOPAUSIA',
      'ecografia-piso-pelvico': 'ECOGRAFÍA DE PISO PÉLVICO',
      'ecografia-mapeo-endometriosico': 'ECOGRAFÍA MAPEO ENDOMETRIÓSICO'
    };
    return documentNames[slug] || 'DOCUMENTO CLÍNICO';
  };

  const documentName = getDocumentName(slug);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
  };

  const addField = (type: DocumentField['type']) => {
    const newField: DocumentField = {
      id: Date.now().toString(),
      type,
      label: type === 'title' ? 'Título' : 
             type === 'separator' ? 'Separador' :
             type === 'text' ? 'Campo de Texto' :
             type === 'textarea' ? 'Área de Texto' :
             type === 'number' ? 'Número' :
             type === 'select' ? 'Selección' :
             type === 'date' ? 'Fecha' : 'Campo',
      value: '',
      placeholder: `Ingrese ${type === 'title' ? 'el título' : 'el valor'}`
    };
    setFields(prev => [...prev, newField]);
  };

  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (fieldToDuplicate) {
      const newField: DocumentField = {
        ...fieldToDuplicate,
        id: Date.now().toString(),
        value: ''
      };
      const fieldIndex = fields.findIndex(f => f.id === fieldId);
      setFields(prev => [
        ...prev.slice(0, fieldIndex + 1),
        newField,
        ...prev.slice(fieldIndex + 1)
      ]);
    }
  };

  const renderField = (field: DocumentField) => {
    const commonProps = {
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
      className: "w-full"
    };

    switch (field.type) {
      case 'title':
        return (
          <Input 
            {...commonProps}
            className="text-2xl font-bold text-center border-none bg-transparent focus:ring-0 focus:border-none"
          />
        );
      case 'textarea':
        return (
          <Textarea 
            {...commonProps}
            rows={4}
            className="min-h-[100px] resize-none"
          />
        );
      case 'separator':
        return <Separator className="my-4" />;
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {documentName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Editor de documento clínico
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isEditing ? 'Modo Edición' : 'Editar'}
                </span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Vista Previa</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Guardar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Editor de Campos */}
          {isEditing && (
            <div className="w-full xl:w-80 xl:flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Plus className="w-4 h-4" />
                    Agregar Campos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('title')}
                    className="w-full justify-start text-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Título
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('text')}
                    className="w-full justify-start text-sm"
                  >
                    <AlignLeft className="w-4 h-4 mr-2" />
                    Campo de Texto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('textarea')}
                    className="w-full justify-start text-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Área de Texto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('number')}
                    className="w-full justify-start text-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Número
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('date')}
                    className="w-full justify-start text-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Fecha
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('select')}
                    className="w-full justify-start text-sm"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Lista Desplegable
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField('separator')}
                    className="w-full justify-start text-sm"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Separador
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Editor Principal */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Editor de Documento</span>
                  <Badge variant="secondary" className="text-xs">
                    {fields.length} campos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="group border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <label className="text-sm font-medium text-foreground">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      {isEditing && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateField(field.id)}
                            className="h-7 w-7 p-0 hover:bg-muted"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      {renderField(field)}
                    </div>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <div className="text-center py-12">
                    <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No hay campos en este documento
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {isEditing 
                        ? "Agrega campos usando el panel lateral para comenzar a crear tu documento"
                        : "Activa el modo edición para agregar campos al documento"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
