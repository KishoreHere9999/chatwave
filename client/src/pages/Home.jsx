import useAuthStore from '../store/useAuthStore.js';

const Home = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Chat<span className="text-teal-400">Wave</span>
        </h1>
        <p className="text-gray-400 mb-6">
          Welcome, {authUser?.username}! 🌊
        </p>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;