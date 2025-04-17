import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import PracticePage from "./PracticePage";
import VideoCall from './VideoCall';
import MeetPage from "./Meet";
import MeetRoom from "./createroom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/meet" element={<MeetPage />} />
        <Route path="/room/:roomId" element={<MeetRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
