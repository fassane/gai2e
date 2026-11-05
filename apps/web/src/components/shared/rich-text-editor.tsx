import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Barre limitée à ce que l'api conserve à l'enregistrement (apps/api/src/app/legal-pages)
const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};
const formats = ['header', 'bold', 'italic', 'underline', 'list', 'link'];

// Éditeur de texte riche. À charger avec React.lazy : Quill est lourd et ne sert qu'au back-office.
export default function RichTextEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (html: string) => void;
  label: string;
}) {
  // Quill garde son HTML brut : lui renvoyer une version modifiée réinitialiserait le curseur à chaque frappe
  const [raw, setRaw] = useState(value);

  return (
    <div className="gai2e-quill overflow-hidden rounded-2xl border border-input bg-card">
      <ReactQuill
        theme="snow"
        value={raw}
        onChange={(html) => {
          setRaw(html);
          // Quill transforme chaque espace en &nbsp;, ce qui empêcherait le texte de revenir à la ligne
          onChange(html.replace(/&nbsp;/g, ' '));
        }}
        modules={modules}
        formats={formats}
        aria-label={label}
      />
    </div>
  );
}
