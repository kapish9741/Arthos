import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Welcome to your dashboard!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 text-lg border border-white/20 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
