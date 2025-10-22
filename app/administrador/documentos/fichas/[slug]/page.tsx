'use client';

import { useState, use, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Download, 
  ArrowLeft,
  Edit3,
  FileText,
  Printer
} from 'lucide-react';
import { SimpleEditor } from '@/components/editor/SimpleEditor';

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
  const [isEditing, setIsEditing] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [documentData, setDocumentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const currentDocumentName = getDocumentName(slug);

  // Cargar datos iniciales del documento
  useEffect(() => {
    if (slug) {
      // Datos iniciales del documento
      const initialData = {
        time: Date.now(),
        blocks: [
          {
            id: '1',
            type: 'header',
            data: {
              text: currentDocumentName,
              level: 1
            }
          },
          {
            id: '2',
            type: 'paragraph',
            data: {
              text: 'Informe médico generado automáticamente'
            }
          },
          {
            id: '3',
            type: 'table',
            data: {
              withHeadings: true,
              content: [
                ['Campo', 'Valor', 'Observaciones'],
                ['Fecha', '', 'Fecha del examen'],
                ['Paciente', '', 'Nombre del paciente'],
                ['Diagnóstico', '', 'Diagnóstico principal']
              ]
            }
          }
        ]
      };
      setDocumentData(initialData);
    }
  }, [slug, currentDocumentName]);

  // Funciones del editor
  const handleSave = (data: any) => {
    console.log('Documento guardado:', data);
    setDocumentData(data);
    // Aquí puedes implementar la lógica para guardar en tu backend
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    setIsEditing(!isPreviewMode);
  };

  const handleExport = () => {
    // Implementar exportación a PDF o Word
    console.log('Exportando documento:', documentData);
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
                  {currentDocumentName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Editor profesional de documentos clínicos
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
              <Button 
                variant={isPreviewMode ? "default" : "outline"}
                size="sm" 
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isPreviewMode ? 'Editar' : 'Vista Previa'}
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Toolbar del Editor */}
          <div className="w-full xl:w-80 xl:flex-shrink-0">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4" />
                  Herramientas del Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => console.log('Guardar documento')}
                    className="w-full"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handlePreview}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Vista</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleExport}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Exportar</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bloques Disponibles
                  </h4>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      • Encabezados (H1-H6)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • Listas ordenadas y desordenadas
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • Tablas
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • Citas
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • Separadores
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Principal */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Editor de Documento</span>
                  <Badge variant="secondary" className="text-xs">
                    Editor Profesional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px]">
                  <SimpleEditor
                    holderId="editor-container"
                    initialData={documentData}
                    onSave={handleSave}
                    readOnly={isPreviewMode}
                  />
                  <div 
                    id="editor-container"
                    className="prose max-w-none min-h-[600px] p-4 border border-border rounded-lg bg-background"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
