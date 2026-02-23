import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import useAuthStore from '../store/useAuthStore.js';

const Home = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return null;

  return (
    <div className="h-screen flex bg-gray-950 overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Home;