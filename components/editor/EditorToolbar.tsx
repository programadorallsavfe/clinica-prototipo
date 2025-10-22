'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Download, 
  FileText,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  Calendar,
  Hash,
  Table,
  Image as ImageIcon,
  Upload,
  Minus,
  Plus
} from 'lucide-react';

interface EditorToolbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onAddBlock: (blockType: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export const EditorToolbar = ({ 
  onSave, 
  onPreview, 
  onExport, 
  onAddBlock, 
  isEditing, 
  isLoading 
}: EditorToolbarProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('text');

  const blockCategories = {
    text: {
      title: 'Texto y Contenido',
      icon: Type,
      blocks: [
        { type: 'header', label: 'Encabezado', icon: Type },
        { type: 'paragraph', label: 'Párrafo', icon: AlignLeft },
        { type: 'list', label: 'Lista', icon: List },
        { type: 'quote', label: 'Cita', icon: FileText },
        { type: 'delimiter', label: 'Separador', icon: Minus }
      ]
    },
    medical: {
      title: 'Campos Médicos',
      icon: FileText,
      blocks: [
        { type: 'medical-field', label: 'Campo Médico', icon: Hash },
        { type: 'vital-signs', label: 'Signos Vitales', icon: CheckSquare },
        { type: 'diagnosis', label: 'Diagnóstico', icon: FileText },
        { type: 'prescription', label: 'Prescripción', icon: FileText }
      ]
    },
    data: {
      title: 'Datos y Formularios',
      icon: Hash,
      blocks: [
        { type: 'table', label: 'Tabla', icon: Table },
        { type: 'checklist', label: 'Lista de Verificación', icon: CheckSquare },
        { type: 'date', label: 'Fecha', icon: Calendar },
        { type: 'number', label: 'Número', icon: Hash }
      ]
    },
    media: {
      title: 'Multimedia',
      icon: ImageIcon,
      blocks: [
        { type: 'image', label: 'Imagen', icon: ImageIcon },
        { type: 'attaches', label: 'Archivo Adjunto', icon: Upload },
        { type: 'signature', label: 'Firma Digital', icon: FileText }
      ]
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="w-4 h-4" />
          Herramientas del Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botones de Acción */}
        <div className="space-y-2">
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="w-full"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onPreview}
              size="sm"
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Vista</span>
            </Button>
            <Button
              variant="outline"
              onClick={onExport}
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>

        {/* Categorías de Bloques */}
        {isEditing && (
          <>
            <div className="flex flex-wrap gap-1">
              {Object.entries(blockCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={activeCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(key)}
                  className="text-xs px-2 py-1"
                >
                  <category.icon className="w-3 h-3 mr-1" />
                  {category.title.split(' ')[0]}
                </Button>
              ))}
            </div>

            {/* Bloques de la Categoría Activa */}
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {blockCategories[activeCategory as keyof typeof blockCategories].title}
              </h4>
              <div className="space-y-1">
                {blockCategories[activeCategory as keyof typeof blockCategories].blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddBlock(block.type)}
                    className="w-full justify-start text-sm"
                  >
                    <block.icon className="w-4 h-4 mr-2" />
                    {block.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
