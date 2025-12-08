import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

const MarketplacePage = () => {
    const [cryptos, setCryptos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMarketData(page, searchTerm);
    }, [page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(0);
            setCryptos([]);
            setHasMore(true);
            fetchMarketData(0, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchMarketData = async (pageNum: number, search: string) => {
        if (!hasMore && pageNum !== 0) return;

        setLoading(true);
        try {
            const response = await api.get('/market/latest', {
                params: {
                    page: pageNum,
                    limit: 20,
                    search: search.trim()
                }
            });

            const newData = response.data;

            if (newData.length === 0) {
                setHasMore(false);
            }

            setCryptos(prev => pageNum === 0 ? newData : [...prev, ...newData]);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
            }
            console.error("Failed to fetch market data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (e: any) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            if (!loading && hasMore && !searchTerm) {
                setPage(prev => prev + 1);
            }
        }
    };

    return (
        <div
            className="flex-1 p-6 bg-neutral-900 overflow-auto h-full"
            onScroll={handleScroll}
        >
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-20 py-2">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Crypto Marketplace</h1>
                        <p className="text-neutral-400">Track and manage top digital assets.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search (e.g. BTC, ETH)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    {cryptos.map((coin, index) => (
                        <div key={`${coin.id}-${index}`} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-600 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={coin.imageUrl} alt={coin.name} className="w-10 h-10 rounded-full bg-neutral-700" />
                                <div>
                                    <h3 className="text-white font-bold">{coin.name}</h3>
                                    <p className="text-sm text-neutral-400">{coin.symbol}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400 text-sm">Price</span>
                                    <span className="text-white font-medium">${coin.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400 text-sm">24h Change</span>
                                    <span className={`font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400 text-sm">Market Cap</span>
                                    <span className="text-white text-sm">${(coin.marketCap / 1e9).toFixed(2)}B</span>
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        className="w-full py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Buy / Track
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md bg-neutral-900 border border-neutral-800 text-white p-0 overflow-hidden" aria-describedby={undefined}>
                                    <DialogTitle className="sr-only">Buy {coin.name}</DialogTitle>
                                    <AddAssetWrapper initialName={coin.name} initialValue={coin.price} initialSymbol={coin.symbol} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>

                {loading && <div className="text-center text-neutral-500 py-4">Loading more assets...</div>}
                {!hasMore && cryptos.length > 0 && <div className="text-center text-neutral-600 py-4">No more assets to load.</div>}
            </div>
        </div>
    );
};

const AddAssetWrapper = ({ initialName, initialValue, initialSymbol }: { initialName: string, initialValue: number, initialSymbol: string }) => {
    const [name, setName] = useState(initialName);
    const [value, setValue] = useState(initialValue.toString());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [useWallet, setUseWallet] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await api.get('/assets');
                const cash = res.data.filter((a: any) => a.type === 'CASH').reduce((acc: number, curr: any) => acc + curr.value, 0);
                setWalletBalance(cash);
            } catch (err) {
                console.error("Failed to fetch balance", err);
            }
        };
        fetchBalance();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (useWallet && walletBalance !== null && parseFloat(value) > walletBalance) {
            setMessage("Insufficient wallet funds.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/assets/buy', {
                name,
                value: parseFloat(value),
                type: 'crypto',
                symbol: initialSymbol,
                useWallet
            });

            setMessage(useWallet ? "Asset purchased & deducted from wallet!" : "Asset tracked successfully!");
            setTimeout(() => window.location.href = '/assets', 1000);
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.error || "Failed to process transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Add {initialName} to Portfolio</h2>
            {message && <p className={`mb-4 ${message.includes('Insufficient') || message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Asset Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Amount / Value ($)</label>
                    <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white"
                    />
                </div>

                <div className="pt-2 border-t border-neutral-800">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={useWallet}
                            onChange={(e) => setUseWallet(e.target.checked)}
                            className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-green-500 focus:ring-green-500/20"
                        />
                        <div>
                            <span className="text-white font-medium group-hover:text-green-400 transition-colors">Pay with Wallet Balance</span>
                            {walletBalance !== null && (
                                <p className="text-xs text-neutral-500">Available: <span className="text-green-400 font-bold">${walletBalance.toFixed(2)}</span></p>
                            )}
                        </div>
                    </label>
                </div>

                <button disabled={loading} className={`w-full py-2 rounded-lg font-bold transition-colors ${useWallet ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white hover:bg-neutral-200 text-black'}`}>
                    {loading ? 'Processing...' : (useWallet ? 'Buy Now' : 'Track Only')}
                </button>
            </form>
        </div>
    )
}

export default MarketplacePage;
