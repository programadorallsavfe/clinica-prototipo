'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Download } from 'lucide-react';

interface EditorBlock {
  id: string;
  type: 'header' | 'paragraph' | 'list' | 'table' | 'checkbox' | 'date' | 'number';
  data: any;
}

export default function DocumentEditorSimple({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    {
      id: '1',
      type: 'header',
      data: {
        text: 'ECOGRAFÍA PRIMER TRIMESTRE INICIAL',
        level: 1
      }
    },
    {
      id: '2',
      type: 'paragraph',
      data: {
        text: 'Informe de ecografía obstétrica del primer trimestre'
      }
    },
    {
      id: '3',
      type: 'table',
      data: {
        withHeadings: true,
        content: [
          ['Campo', 'Valor', 'Observaciones'],
          ['FUR', '', 'Fecha de última regla'],
          ['Edad Gestacional', '', 'Semanas'],
          ['Útero', '', 'Descripción']
        ]
      }
    }
  ]);

  const addBlock = (type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: Date.now().toString(),
      type,
      data: getDefaultData(type)
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const getDefaultData = (type: EditorBlock['type']) => {
    switch (type) {
      case 'header':
        return { text: 'Nuevo Encabezado', level: 2 };
      case 'paragraph':
        return { text: 'Nuevo párrafo' };
      case 'list':
        return { style: 'unordered', items: ['Item 1', 'Item 2'] };
      case 'table':
        return {
          withHeadings: true,
          content: [
            ['Columna 1', 'Columna 2'],
            ['Fila 1', 'Fila 1'],
            ['Fila 2', 'Fila 2']
          ]
        };
      case 'checkbox':
        return { items: [{ text: 'Nueva opción', checked: false }] };
      case 'date':
        return { value: new Date().toISOString().split('T')[0] };
      case 'number':
        return { value: 0, label: 'Número' };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, data: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, data } : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const renderBlock = (block: EditorBlock) => {
    switch (block.type) {
      case 'header':
        const HeaderTag = `h${block.data.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <div className="group">
            <HeaderTag className="font-bold text-foreground mb-2">
              {block.data.text}
            </HeaderTag>
            <input
              type="text"
              value={block.data.text}
              onChange={(e) => updateBlock(block.id, { ...block.data, text: e.target.value })}
              className="w-full p-2 border border-border rounded"
            />
          </div>
        );
      
      case 'paragraph':
        return (
          <div className="group">
            <textarea
              value={block.data.text}
              onChange={(e) => updateBlock(block.id, { ...block.data, text: e.target.value })}
              className="w-full p-2 border border-border rounded min-h-[100px]"
              placeholder="Escribir párrafo..."
            />
          </div>
        );
      
      case 'list':
        return (
          <div className="group">
            <ul className="list-disc list-inside space-y-1">
              {block.data.items?.map((item: string, index: number) => (
                <li key={index}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...block.data.items];
                      newItems[index] = e.target.value;
                      updateBlock(block.id, { ...block.data, items: newItems });
                    }}
                    className="border-none bg-transparent"
                  />
                </li>
              ))}
            </ul>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newItems = [...(block.data.items || []), 'Nuevo item'];
                updateBlock(block.id, { ...block.data, items: newItems });
              }}
              className="mt-2"
            >
              Agregar Item
            </Button>
          </div>
        );
      
      case 'table':
        return (
          <div className="group">
            <table className="w-full border-collapse border border-border">
              <tbody>
                {block.data.content?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-border p-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const newContent = [...block.data.content];
                            newContent[rowIndex][cellIndex] = e.target.value;
                            updateBlock(block.id, { ...block.data, content: newContent });
                          }}
                          className="w-full border-none bg-transparent"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newRow = Array(block.data.content[0]?.length || 2).fill('');
                  const newContent = [...block.data.content, newRow];
                  updateBlock(block.id, { ...block.data, content: newContent });
                }}
              >
                Agregar Fila
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newContent = block.data.content.map((row: string[]) => [...row, '']);
                  updateBlock(block.id, { ...block.data, content: newContent });
                }}
              >
                Agregar Columna
              </Button>
            </div>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="group">
            <div className="space-y-2">
              {block.data.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      const newItems = [...block.data.items];
                      newItems[index] = { ...item, checked: e.target.checked };
                      updateBlock(block.id, { ...block.data, items: newItems });
                    }}
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [...block.data.items];
                      newItems[index] = { ...item, text: e.target.value };
                      updateBlock(block.id, { ...block.data, items: newItems });
                    }}
                    className="flex-1 border-none bg-transparent"
                  />
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newItems = [...(block.data.items || []), { text: 'Nueva opción', checked: false }];
                updateBlock(block.id, { ...block.data, items: newItems });
              }}
              className="mt-2"
            >
              Agregar Opción
            </Button>
          </div>
        );
      
      case 'date':
        return (
          <div className="group">
            <label className="block text-sm font-medium mb-1">Fecha:</label>
            <input
              type="date"
              value={block.data.value}
              onChange={(e) => updateBlock(block.id, { ...block.data, value: e.target.value })}
              className="p-2 border border-border rounded"
            />
          </div>
        );
      
      case 'number':
        return (
          <div className="group">
            <label className="block text-sm font-medium mb-1">{block.data.label}:</label>
            <input
              type="number"
              value={block.data.value}
              onChange={(e) => updateBlock(block.id, { ...block.data, value: e.target.value })}
              className="p-2 border border-border rounded"
            />
          </div>
        );
      
      default:
        return <div>Bloque no soportado</div>;
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
                  Editor Simple - {slug}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Editor de bloques para documentos clínicos
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Panel de Bloques */}
          <div className="w-full xl:w-80 xl:flex-shrink-0">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  Agregar Bloques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('header')}
                  className="w-full justify-start text-sm"
                >
                  📝 Encabezado
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('paragraph')}
                  className="w-full justify-start text-sm"
                >
                  📄 Párrafo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('table')}
                  className="w-full justify-start text-sm"
                >
                  📊 Tabla
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('list')}
                  className="w-full justify-start text-sm"
                >
                  📋 Lista
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('checkbox')}
                  className="w-full justify-start text-sm"
                >
                  ☑️ Casillas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('date')}
                  className="w-full justify-start text-sm"
                >
                  📅 Fecha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock('number')}
                  className="w-full justify-start text-sm"
                >
                  🔢 Número
                </Button>
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
                    {blocks.length} bloques
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {blocks.map((block, index) => (
                  <div key={block.id} className="group border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {block.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(block.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        ✕
                      </Button>
                    </div>
                    {renderBlock(block)}
                  </div>
                ))}
                
                {blocks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No hay bloques en este documento
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Agrega bloques usando el panel lateral para comenzar a crear tu documento
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
