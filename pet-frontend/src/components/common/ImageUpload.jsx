import { useRef, useState, useEffect } from "react";

export default function ImageUpload({ onFileSelected, initialUrl = null, resolveUrl }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialUrl ? resolveUrl?.(initialUrl) ?? initialUrl : null);

  useEffect(() => {
    setPreview(initialUrl ? resolveUrl?.(initialUrl) ?? initialUrl : null);
  }, [initialUrl, resolveUrl]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelected?.(file);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-stamp border border-forest-100 bg-paper">
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-forest-300">No image</span>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-stamp border border-forest-500 px-3 py-1.5 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring"
        >
          Choose image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-ink/50">JPG or PNG, up to 5MB.</p>
      </div>
    </div>
  );
}
