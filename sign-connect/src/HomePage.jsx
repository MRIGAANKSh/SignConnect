import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomName = `room-${Math.floor(Math.random() * 1000000)}`;
    navigate(`/room/${newRoomName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
      <h1 className="text-4xl font-bold mb-4">Sign Language Translator</h1>
      <p className="text-lg mb-8">Translate or practice signs in real-time using your webcam and AI.</p>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/practice")}
          className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-gray-200 transition-all"
        >
          Start Practicing
        </button>
        <button
          onClick={() => alert("Translator page coming soon!")}
          className="px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold shadow-lg hover:bg-gray-200 transition-all"
        >
          Translator (Coming Soon)
        </button>
        <button
          onClick={handleCreateRoom}
          className="px-6 py-3 rounded-xl bg-white text-green-600 font-semibold shadow-lg hover:bg-gray-200 transition-all"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default HomePage;
