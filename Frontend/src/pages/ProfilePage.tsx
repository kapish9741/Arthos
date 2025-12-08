import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User, Wallet, Save, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const ProfilePage = () => {
  const [cashAssets, setCashAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'wallet'>('details');

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, assetsRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/assets')
      ]);

      setName(profileRes.data.name);
      setEmail(profileRes.data.email);

      const cash = assetsRes.data.filter((a: any) => a.type === 'CASH');
      setCashAssets(cash);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage("");
    try {
      await api.put('/auth/profile', { name, email, password: password || undefined });
      setUpdateMessage("Profile updated successfully!");
      setPassword("");
    } catch (error) {
      console.error(error);
      setUpdateMessage("Failed to update profile.");
    }
  };

  const handleAddMoney = async () => {
    try {
      await api.post('/assets', {
        name: "Wallet Deposit",
        type: "CASH",
        value: parseFloat(addAmount),
        symbol: "USD"
      });
      setAddAmount("");
      fetchProfileData();
    } catch (error) {
      console.error("Failed to add money", error);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  const totalCash = cashAssets.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto h-full">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">Profile & Wallet</h1>

        <div className="flex space-x-4 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'details' ? 'text-green-400 border-b-2 border-green-400' : 'text-neutral-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" /> User Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'wallet' ? 'text-green-400 border-b-2 border-green-400' : 'text-neutral-400 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Wallet
            </div>
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="bg-neutral-800 p-8 rounded-xl border border-neutral-700 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
            {updateMessage && <div className={`mb-4 p-3 rounded ${updateMessage.includes('success') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{updateMessage}</div>}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">New Password (Optional)</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Leave blank to keep current"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-900/50 to-neutral-900 p-8 rounded-xl border border-green-500/20 max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <h2 className="text-neutral-400 mb-2 font-medium">Available Cash Balance</h2>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-bold text-white">${totalCash.toFixed(2)}</span>
                <span className="text-green-400 mb-2 font-medium">USD</span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Money
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border border-neutral-800 text-white" aria-describedby={undefined}>
                  <DialogTitle className="sr-only">Add Money</DialogTitle>
                  <h2 className="text-xl font-bold mb-4">Add Money to Wallet</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-neutral-400">Amount ($)</label>
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleAddMoney();
                      }}
                      className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200"
                    >
                      Confirm Deposit
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 max-w-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Deposit History</h3>
              <div className="space-y-3">
                {cashAssets.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No deposits yet.</p>
                ) : (
                  cashAssets.map((asset: any) => (
                    <div key={asset.id} className="flex justify-between items-center py-3 border-b border-neutral-700 last:border-0">
                      <div>
                        <p className="text-white font-medium">{asset.name}</p>
                        <p className="text-xs text-neutral-500">{new Date(asset.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-green-400 font-bold">+${asset.value.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
