import { useState, useEffect } from "react";
import api from "@/lib/api";
import LiveAssetGraph from "@/components/dashboard/LiveAssetGraph";

const DashboardPage = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, assetsRes, historyRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/assets'),
          api.get('/market/portfolio-history').catch(() => ({ data: [] }))
        ]);

        const expenses = expensesRes.data;
        const assets = assetsRes.data;
        const history = historyRes.data;

        const assetsValue = assets.reduce((acc: number, curr: any) => acc + curr.value, 0);
        const expensesValue = expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);

        setTotalValue(1000 + assetsValue - expensesValue);
        setGraphData(history);

        const recent = [
          ...expenses.map((e: any) => ({ ...e, type: 'expense', amount: -e.amount, title: e.title })),
          ...assets.map((a: any) => ({ ...a, type: 'asset', amount: a.value, title: `Added ${a.name}` }))
        ].sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
          .slice(0, 5);

        setRecentTransactions(recent);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Financial Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-neutral-400 mb-2">Net Worth</h2>
            <p className="text-4xl font-bold text-white">${totalValue.toFixed(2)}</p>
            <p className="text-sm text-green-400 mt-2">+2.5% from last month</p>
          </div>

          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-neutral-400 mb-2">Quick Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-300">Active Assets</span>
                <span className="text-white font-bold">{recentTransactions.filter(x => x.type === 'asset').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Recent Expenses</span>
                <span className="text-white font-bold">{recentTransactions.filter(x => x.type === 'expense').length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 p-0 rounded-xl border border-neutral-700 h-80 overflow-hidden relative">
          <div className="absolute top-4 left-6 z-10">
            <h2 className="text-xl font-bold text-white">Live Performance</h2>
            <p className="text-neutral-500 text-sm">Real-time asset value tracking</p>
          </div>
          <div className="w-full h-full pt-16 pb-2 pr-2">
            <LiveAssetGraph currentValue={totalValue > 0 ? totalValue : 5000} historicalData={graphData} />
          </div>
        </div>

        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentTransactions.map((t, i) => (
              <div key={i} className="flex justify-between items-center border-b border-neutral-700 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="text-white font-medium">{t.title || t.name}</p>
                  <p className="text-xs text-neutral-400">{new Date(t.date || t.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={`font-bold ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
