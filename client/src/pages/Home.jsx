import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import RoomWindow from '../components/RoomWindow.jsx';
import useAuthStore from '../store/useAuthStore.js';
import useChatStore from '../store/useChatStore.js';

const Home = () => {
  const { authUser } = useAuthStore();
  const { selectedRoom } = useChatStore();

  if (!authUser) return null;

  return (
    <div className="h-screen flex bg-gray-950 overflow-hidden">
      <Sidebar />
      {selectedRoom ? <RoomWindow /> : <ChatWindow />}
    </div>
  );
};

export default Home;