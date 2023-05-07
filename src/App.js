import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login';
import Leaderboard from './Leaderboard';
import LeaderboardV2 from './LeaderboardV2';
import LeaderboardV3 from './LeaderboardV3';
import LeaderboardV4 from './LeaderboardV4';
import LeaderboardV5 from "./leaderboardV5";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/leaderboard" element={<Leaderboard/>}/>
                    <Route path="/leaderboard/v2/:sortBy" element={<LeaderboardV2/>}/>
                    <Route path="/leaderboard/v3/:sortBy" element={<LeaderboardV3/>}/>
                    <Route path="/leaderboard/v4/:sortBy" element={<LeaderboardV4/>}/>
                    <Route path="/leaderboard/v5/" element={<LeaderboardV5/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
