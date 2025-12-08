import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

interface Asset {
    id: number;
    name: string;
    type: string;
    value: number;
    symbol?: string;
    imageUrl?: string;
}

const AssetsPage = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        type: "NFT",
        value: "",
        symbol: "",
        imageUrl: ""
    });

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch assets", err);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const openAddModal = () => {
        setEditingAsset(null);
        setFormData({ name: "", type: "NFT", value: "", symbol: "", imageUrl: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (asset: Asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            type: asset.type,
            value: asset.value.toString(),
            symbol: asset.symbol || "",
            imageUrl: asset.imageUrl || ""
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                value: parseFloat(formData.value)
            };

            if (editingAsset) {
                await api.put(`/assets/${editingAsset.id}`, payload);
            } else {
                await api.post('/assets', payload);
            }

            setIsModalOpen(false);
            fetchAssets();
        } catch (err) {
            console.error("Failed to save asset", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/assets/${id}`);
            fetchAssets();
        } catch (err) {
            console.error("Failed to delete asset", err);
        }
    }

    const totalWallet = assets.filter(a => a.type === 'CASH').reduce((acc, curr) => acc + curr.value, 0);
    const totalCrypto = assets.filter(a => (a.type === 'CRYPTO' || a.type === 'crypto')).reduce((acc, curr) => acc + curr.value, 0);
    const totalOther = assets.filter(a => a.type !== 'CASH' && a.type !== 'CRYPTO' && a.type !== 'crypto').reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex-1 p-6 bg-neutral-900 overflow-auto h-full relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Digital Assets</h1>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Add Asset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                        <p className="text-neutral-400 text-sm font-medium">Wallet Balance</p>
                        <p className="text-2xl font-bold text-white mt-2">${totalWallet.toLocaleString()}</p>
                    </div>
                    <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                        <p className="text-neutral-400 text-sm font-medium">Crypto Holdings</p>
                        <p className="text-2xl font-bold text-white mt-2">${totalCrypto.toLocaleString()}</p>
                    </div>
                    <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                        <p className="text-neutral-400 text-sm font-medium">Other Assets (NFTs)</p>
                        <p className="text-2xl font-bold text-white mt-2">${totalOther.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset) => (
                        <div key={asset.id} className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 hover:border-blue-500/50 transition-all group">
                            <div className="aspect-square rounded-lg bg-neutral-900 mb-4 overflow-hidden relative">
                                {asset.imageUrl ? (
                                    <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-medium">
                                    {asset.type}
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
                                    {asset.symbol && <p className="text-sm text-neutral-400">{asset.symbol}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-white">${asset.value.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => openEditModal(asset)}
                                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(asset.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {assets.length === 0 && (
                        <div className="col-span-full text-center py-12 text-neutral-500 bg-neutral-800/50 rounded-xl border border-neutral-800 border-dashed">
                            <p>No assets found. Add your NFTs or Crypto to track them here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Asset Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-neutral-900 rounded-xl border border-neutral-700 w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-neutral-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Asset Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Bored Ape #1234"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="NFT">NFT</option>
                                        <option value="CRYPTO">Crypto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Value ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Symbol (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.symbol}
                                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. BAYC"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-4 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (editingAsset ? "Save Changes" : "Add Asset")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsPage;
