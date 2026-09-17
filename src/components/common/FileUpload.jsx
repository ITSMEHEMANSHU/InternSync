import { useState, useRef } from 'react';

const FileUpload = ({ accept = '*', label = 'Upload File', onUpload, currentFile }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => { if (file) onUpload?.(file); };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${dragging ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/60 hover:border-primary/60 hover:bg-surface-container-low/50'}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      <span className="material-symbols-outlined text-[36px] text-on-surface-variant">upload_file</span>
      {currentFile ? (
        <div className="flex items-center gap-2 text-tertiary font-label-md text-label-md font-semibold">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {currentFile.name || currentFile}
        </div>
      ) : (
        <>
          <span className="font-label-md text-label-md font-semibold text-on-surface">{label}</span>
          <span className="font-body-xs text-body-xs text-on-surface-variant">Drag & drop or click to browse</span>
        </>
      )}
    </div>
  );
};

export default FileUpload;
