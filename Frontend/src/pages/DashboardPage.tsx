const DashboardPage = () => {
  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio Value</h3>
            <p className="text-3xl font-bold text-white">$12,458.32</p>
            <p className="text-sm text-green-400 mt-2">+8.2% this week</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">NFTs Owned</h3>
            <p className="text-3xl font-bold text-white">24</p>
            <p className="text-sm text-neutral-400 mt-2">Across 8 collections</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-2">Stocks Held</h3>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-sm text-neutral-400 mt-2">Total value: $8,234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
