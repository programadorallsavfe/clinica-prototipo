'use client';

import { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';

interface SimpleEditorProps {
  holderId: string;
  initialData?: OutputData;
  onSave?: (data: OutputData) => void;
  readOnly?: boolean;
}

export const SimpleEditor = ({ 
  holderId, 
  initialData, 
  onSave, 
  readOnly = false 
}: SimpleEditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: holderId,
        placeholder: 'Escriba aquí...',
        readOnly,
        data: initialData,
        tools: {
          header: Header,
          list: List,
          table: Table,
          quote: Quote,
          delimiter: Delimiter
        },
        onChange: async () => {
          if (onSave && editorRef.current) {
            try {
              const outputData = await editorRef.current.save();
              if (outputData && outputData.time !== undefined) {
                onSave(outputData);
              }
            } catch (error) {
              console.error('Error saving editor data:', error);
            }
          }
        }
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return null;
};
