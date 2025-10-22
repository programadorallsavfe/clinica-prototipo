'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import EditorJS, { OutputData, API } from '@editorjs/editorjs';

interface EditorContextType {
  editor: EditorJS | null;
  data: OutputData | null;
  isLoading: boolean;
  setEditor: (editor: EditorJS) => void;
  setData: (data: OutputData) => void;
  setIsLoading: (loading: boolean) => void;
  saveDocument: () => Promise<void>;
  loadDocument: (documentId: string) => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
  documentId?: string;
}

export const EditorProvider = ({ children, documentId }: EditorProviderProps) => {
  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [data, setData] = useState<OutputData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveDocument = async () => {
    if (!editor) return;
    
    try {
      setIsLoading(true);
      const outputData = await editor.save();
      setData(outputData);
      
      // Aquí puedes implementar la lógica para guardar en tu backend
      if (documentId) {
        // Ejemplo: await saveDocumentToAPI(documentId, outputData);
        console.log('Documento guardado:', outputData);
      }
    } catch (error) {
      console.error('Error al guardar documento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocument = async (docId: string) => {
    try {
      setIsLoading(true);
      // Aquí puedes implementar la lógica para cargar desde tu backend
      // Ejemplo: const documentData = await loadDocumentFromAPI(docId);
      
      // Por ahora, usamos datos de ejemplo
      const exampleData: OutputData = {
        time: Date.now(),
        blocks: [
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
        ]
      };
      
      setData(exampleData);
      
      if (editor) {
        editor.render(exampleData);
      }
    } catch (error) {
      console.error('Error al cargar documento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      loadDocument(documentId);
    }
  }, [documentId]);

  const value: EditorContextType = {
    editor,
    data,
    isLoading,
    setEditor,
    setData,
    setIsLoading,
    saveDocument,
    loadDocument
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
