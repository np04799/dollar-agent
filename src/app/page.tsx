import TriggerAgentButton from "@/components/TriggerAgentButton";

async function getLiveRate() {
  const apiKey = process.env.CURRENCY_API_KEY;

  // Fetch USD base rates
  const UsRes = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    { next: { revalidate: 3600 } } // Refresh every hour
  );

  if (!UsRes.ok) throw new Error("Failed to fetch rate");

  const data = await UsRes.json();

  return {
    inr: data.conversion_rates.INR.toFixed(2),
    cad: data.conversion_rates.CAD.toFixed(2),
    time: new Date().toLocaleTimeString(),
  };
}

export default async function Dashboard() {
  const liveData = await getLiveRate();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Agent Command Center
          </h1>
          <p className="text-slate-500">Live Currency Monitoring</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* USD → INR Card */}
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-blue-100 font-medium mb-4">
              Current USD to INR
            </div>
            <div className="text-4xl font-bold mb-2">₹ {liveData.inr}</div>
            <p className="text-blue-100 text-sm">
              Fetched at: {liveData.time}
            </p>
          </div>

          {/* USD → CAD Card */}
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-blue-100 font-medium mb-4">
              Current USD to CAD
            </div>
            <div className="text-4xl font-bold mb-2">$ CAD {liveData.cad} </div>
            <p className="text-blue-100 text-sm">
              Fetched at: {liveData.time} 
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <TriggerAgentButton />
          </div>

          {/* Quick Action Card */}

        </div>

        <div className="bg-slate-100 p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <a href="/csv-agent"> Click Here for CSV Intelligence Agent </a> {" "}
            </div>
          </p>
        </div>
      </div>
    </main>
  );
}