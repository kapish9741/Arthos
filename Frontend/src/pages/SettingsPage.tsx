const SettingsPage = () => {
  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="space-y-6">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
            <p className="text-neutral-400">Account management coming soon...</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <p className="text-neutral-400">User preferences coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
