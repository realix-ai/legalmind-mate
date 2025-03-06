
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  title?: string;
}

const RichTextEditor = ({
  initialValue = '',
  onChange,
  placeholder = 'Write something amazing...',
  readOnly = false,
  title = 'Rich Text Editor'
}: RichTextEditorProps) => {
  const [value, setValue] = useState(initialValue);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link',
  ];

  const handleChange = (content: string) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Card className="w-full overflow-hidden shadow-md">
      <CardHeader className="bg-muted/30 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
          className="border-none"
        />
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
