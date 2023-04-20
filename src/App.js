import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Leaderboard from './Leaderboard';
import LeaderboardV2 from './LeaderboardV2';
import LeaderboardV3 from './LeaderboardV3';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/leaderboard/v2/:sortBy" element={<LeaderboardV2 />} />
          <Route path="/leaderboard/v3/:sortBy" element={<LeaderboardV3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;