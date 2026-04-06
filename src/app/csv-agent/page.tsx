'use client'; // Required for React Hooks (useState)

import { useState } from 'react';
import Papa from 'papaparse';
import DataChart from '@/components/DataChart';

export default function CSVAgentPage() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  // Function to handle the CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // PapaParse turns the file into a JavaScript Array
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setCsvData(results.data);
        await askAgent(results.data); // Initial summary
      },
    });
  };

  // Function to communicate with our API
  const askAgent = async (data: any[], query?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/csv-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: data, userQuestion: query }),
      });
      const result = await response.json();
      setSummary(result.summary);
    } catch (err) {
      alert("Agent is offline. Check your console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">CSV Intelligence Agent</h1>
        <p className="text-slate-500 mb-8">Upload a file and I will find the insights for you.</p>

        {/* 1. Upload Box */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center mb-8 hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="hidden" 
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
              {loading ? "Agent is Reading..." : "Choose CSV File"}
            </span>
          </label>
        </div>

        {/* 2. Result Section */}
       {summary && (
  <div className="space-y-6"> {/* Added spacing between elements */}
    
    {/* 1. The Summary & AI Insights */}
    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
      <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">
        Agent Intelligence Report
      </h2>
      <div className="prose prose-slate mb-8">
        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
          {summary}
        </p>
      </div>
    </div>

    {/* 2. The Data Visualization (NEW) */}
    {/* This sits outside the summary box for more width/visibility */}
    <DataChart data={csvData} />

    {/* 3. Chat/Follow-up Section */}
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Deep Dive Q&A</h3>
      <div className="flex gap-2 border-t pt-6">
        <input 
          type="text" 
          placeholder="Ask about trends, predictions, or specific rows..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button 
          onClick={() => askAgent(csvData, question)}
          disabled={loading}
          className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}