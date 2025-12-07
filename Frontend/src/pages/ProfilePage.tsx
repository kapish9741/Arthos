const ProfilePage = () => {
  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">User Information</h3>
            <p className="text-neutral-400">Profile management coming soon...</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-400">Member Since</p>
                <p className="text-white">Dec 2025</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Trades</p>
                <p className="text-white">156</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
