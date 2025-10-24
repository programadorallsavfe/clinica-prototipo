'use client';

import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Image from '@editorjs/image';
import Attaches from '@editorjs/attaches';
import { useEditor } from './EditorProvider';

interface EditorInstanceProps {
  placeholder?: string;
  readOnly?: boolean;
  onReady?: () => void;
  onChange?: (api: unknown, event: unknown) => void;
}

export const EditorInstance = ({ 
  placeholder = "Escriba aquí...", 
  readOnly = false,
  onReady,
  onChange 
}: EditorInstanceProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);
  const { setEditor, data, isLoading } = useEditor();

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new EditorJS({
      holder: editorRef.current,
      placeholder,
      readOnly,
      data: data || undefined,
      tools: {
        header: Header as any,
        list: {
          class: List as any,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        table: Table as any,
        checklist: {
          class: Checklist as any,
          inlineToolbar: true,
        },
        quote: {
          class: Quote as any,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Escriba una cita',
            captionPlaceholder: 'Autor de la cita',
          }
        },
        delimiter: Delimiter as any,
        image: {
          class: Image as any,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // Aquí puedes implementar la subida de imágenes
                // Por ahora retornamos una URL de ejemplo
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file),
                    size: file.size,
                    name: file.name
                  }
                };
              }
            }
          }
        },
        attaches: {
          class: Attaches as any,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // Aquí puedes implementar la subida de archivos
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file),
                    size: file.size,
                    name: file.name
                  }
                };
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
        setEditor(editor);
        setEditorInstance(editor);
        if (onReady) {
          onReady();
        }
      }
    });

    return () => {
      if (editor && editor.destroy) {
        editor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstance && data) {
      editorInstance.render(data);
    }
  }, [data, editorInstance]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      <div 
        ref={editorRef}
        className="prose max-w-none"
      />
    </div>
  );
};
