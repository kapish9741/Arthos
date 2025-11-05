import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Get started with your journey
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-lg border border-white/20 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 text-lg font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
