'use client';

import { useState, useEffect, useRef } from 'react';
import EditorJS, { OutputData, API } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Image from '@editorjs/image';
import Attaches from '@editorjs/attaches';

interface UseEditorProps {
  holderId: string;
  initialData?: OutputData;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (api: API, event: any) => void;
  onReady?: () => void;
}

export const useEditor = ({
  holderId,
  initialData,
  readOnly = false,
  placeholder = "Escriba aquí...",
  onChange,
  onReady
}: UseEditorProps) => {
  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [data, setData] = useState<OutputData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef<EditorJS | null>(null);

  const initializeEditor = async () => {
    if (editorRef.current) {
      await editorRef.current.destroy();
    }

    const editorInstance = new EditorJS({
      holder: holderId,
      placeholder,
      readOnly,
      data: initialData || undefined,
      tools: {
        header: Header,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Escriba una cita',
            captionPlaceholder: 'Autor de la cita',
          }
        },
        delimiter: Delimiter,
        image: {
          class: Image,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // Implementación básica de subida de imágenes
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result as string,
                        size: file.size,
                        name: file.name
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                });
              }
            }
          }
        },
        attaches: {
          class: Attaches,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // Implementación básica de subida de archivos
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result as string,
                        size: file.size,
                        name: file.name
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                });
              }
            }
          }
        }
      },
      onChange: (api, event) => {
        if (onChange) {
          onChange(api, event);
        }
      },
      onReady: () => {
        setEditor(editorInstance);
        editorRef.current = editorInstance;
        setIsReady(true);
        if (onReady) {
          onReady();
        }
      }
    });

    return editorInstance;
  };

  const saveData = async (): Promise<OutputData | null> => {
    if (!editorRef.current) return null;
    
    try {
      setIsLoading(true);
      const outputData = await editorRef.current.save();
      setData(outputData);
      return outputData;
    } catch (error) {
      console.error('Error al guardar datos del editor:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (newData: OutputData) => {
    if (!editorRef.current) return;
    
    try {
      setIsLoading(true);
      await editorRef.current.render(newData);
      setData(newData);
    } catch (error) {
      console.error('Error al cargar datos en el editor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearEditor = async () => {
    if (!editorRef.current) return;
    
    try {
      await editorRef.current.clear();
      setData(null);
    } catch (error) {
      console.error('Error al limpiar el editor:', error);
    }
  };

  const destroyEditor = async () => {
    if (editorRef.current) {
      await editorRef.current.destroy();
      editorRef.current = null;
      setEditor(null);
      setIsReady(false);
    }
  };

  useEffect(() => {
    initializeEditor();

    return () => {
      destroyEditor();
    };
  }, []);

  return {
    editor: editorRef.current,
    data,
    isLoading,
    isReady,
    saveData,
    loadData,
    clearEditor,
    destroyEditor,
    initializeEditor
  };
};
