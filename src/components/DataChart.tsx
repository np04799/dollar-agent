'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function DataChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const xAxisKey = Object.keys(data[0])[0];
  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

  // 1. DATA PROCESSING: Count occurrences (Great for 'Industry' or 'Status' columns)
  const counts: { [key: string]: number } = {};
  data.forEach(row => {
    const val = row[xAxisKey] || 'Unknown';
    counts[val] = (counts[val] || 0) + 1;
  });
  
  const chartData = Object.keys(counts).map(key => ({
    name: key,
    value: counts[key]
  })).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8 items

  return (
    <div className="space-y-8 mt-8">
      {/* --- GRID FOR CHARTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BAR CHART: Volume Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Volume by {xAxisKey}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 10}} hide />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: Percentage Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Share Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE: Key Metrics --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase">Key Metrics Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">{xAxisKey}</th>
                <th className="px-6 py-4">Total Occurrences</th>
                <th className="px-6 py-4">Percentage Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.value}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {((item.value / data.length) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}