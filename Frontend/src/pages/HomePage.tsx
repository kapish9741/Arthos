import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full h-full bg-neutral-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to Arthos
        </h1>
        <p className="text-xl text-neutral-400 mb-8">
          Your gateway to NFTs and Stock trading
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/nft-marketplace')}
            className="px-8 py-3 text-lg font-semibold bg-white text-black rounded-lg hover:bg-neutral-200 transition-all duration-200"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 text-lg border border-neutral-700 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
