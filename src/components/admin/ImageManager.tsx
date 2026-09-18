import { useRef, useState } from 'react';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const inputClass =
  'w-full rounded-lg border border-background-800 bg-background-950 px-3 py-2 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';

const buttonClass =
  'whitespace-nowrap rounded-lg border border-background-700 px-3 py-2 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

async function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unable to decode image'));
    img.src = src;
  });
}

async function optimizeImage(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  try {
    const img = await loadImage(dataUrl);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    if (scale === 1 && file.size < 400 * 1024) return dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    return dataUrl;
  }
}

export default function ImageManager({ images, onChange }: ImageManagerProps) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const removeAt = (index: number) => onChange(images.filter((_, i) => i !== index));

  const replaceAt = (index: number, value: string) =>
    onChange(images.map((src, i) => (i === index ? value : src)));

  const addUrl = () => {
    const clean = url.trim();
    if (!clean) return;
    onChange([...images, clean]);
    setUrl('');
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        added.push(await optimizeImage(file));
      }
      if (added.length > 0) onChange([...images, ...added]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Paste an image URL (https://…)"
          aria-label="Image URL"
          className={inputClass}
        />
        <button type="button" onClick={addUrl} className={buttonClass}>
          Add URL
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={buttonClass}>
          Upload files
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {busy && <p className="text-xs text-foreground-400">Processing images…</p>}

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-background-700 py-8 text-center text-sm text-foreground-500">
          No images yet. Add an image URL or upload files — the first image is used as the main
          product image.
        </p>
      ) : (
        <ul className="space-y-3">
          {images.map((src, i) => (
            <li
              key={`${i}-${src.slice(0, 32)}`}
              className="flex flex-col gap-3 rounded-lg border border-background-800 bg-background-950/60 p-3 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-background-900">
                <img
                  src={src}
                  alt={`Product image ${i + 1}`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  value={src}
                  onChange={(e) => replaceAt(i, e.target.value)}
                  aria-label={`Image ${i + 1} URL`}
                  className={inputClass}
                />
                <div className="flex flex-wrap items-center gap-2">
                  {i === 0 ? (
                    <span className="rounded-full border border-primary-500/40 bg-primary-500/15 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-primary-200">
                      Main image
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makePrimary(i)}
                      className={buttonClass}
                    >
                      Make main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move image ${i + 1} up`}
                    className={buttonClass}
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label={`Move image ${i + 1} down`}
                    className={buttonClass}
                  >
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="whitespace-nowrap rounded-lg border border-background-700 px-3 py-2 text-xs text-primary-200 hover:border-primary-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
