'use client';
import { useState } from 'react';

export default function ImageToPrompt() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert image file to Base64 string
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        generatePrompt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePrompt = async (base64Image: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/image-to-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Image Interrogator</h1>
        <p className="text-slate-500 mb-8">Upload an image to reverse-engineer its prompt.</p>

        {/* Upload Area */}
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center mb-8 hover:border-blue-500 transition-all">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-input" />
          <label htmlFor="img-input" className="cursor-pointer">
            {image ? (
              <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
            ) : (
              <div className="py-10">
                <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold">Choose Image</span>
              </div>
            )}
          </label>
        </div>

        {/* Output Area */}
        {loading && <p className="text-center text-blue-600 animate-pulse font-medium">Analyzing pixels...</p>}
        
        {generatedPrompt && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Generated Prompt</h2>
            <p className="text-slate-700 leading-relaxed italic">"{generatedPrompt}"</p>
            <button 
              onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              className="mt-4 text-sm text-blue-600 font-bold hover:underline"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </main>
  );
}