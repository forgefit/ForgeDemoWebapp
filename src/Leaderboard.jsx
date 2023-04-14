// Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './leaderboard.css';
import './common.css';
import { SERVER_URL } from './constant';
import Logo from './assets/images/logo.png';

const Leaderboard = () => {
  const [exercises, setExercises] = useState({});
  const [selectedExercise, setSelectedExercise] = useState('');
  const [order, setOrder] = useState('power_overall_score');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          SERVER_URL + `/api/leaderboard/?ordering=${order}&page=${page}&page_size=${pageSize}`
        );
        console.log(response.data);
        setExercises(response.data);
        setSelectedExercise(Object.keys(response.data)[0]);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [order, page, pageSize]);

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  const handleHeaderClick = (newOrder) => {
    setOrder(newOrder);
  };

  const exerciseOptions = Object.entries(exercises).map(([id, exerciseData]) => (
    <option key={id} value={id}>
      {exerciseData[0].exercise.name}
    </option>
  ));

  const selectedExerciseParticipants = exercises[selectedExercise] || [];

  const participantRows = selectedExerciseParticipants.map((participant, index) => (
    <tr key={participant.id}>
      <td>{index + 1}</td>
      <td>{participant.user.email}</td>
      <td>{participant.power_overall_score}</td>
      <td>{participant.stamina_overall_score}</td>
      <td>{participant.form_overall_score}</td>
    </tr>
  ));

  return (
    <div className="container">
      <img className="logo" src={Logo} alt="Logo" />
      <h1>Leaderboard</h1>
      <select value={selectedExercise} onChange={handleExerciseChange}>
        {exerciseOptions}
      </select>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th onClick={() => handleHeaderClick('power_overall_score')}>Power</th>
            <th onClick={() => handleHeaderClick('stamina_overall_score')}>Stamina</th>
            <th onClick={() => handleHeaderClick('form_overall_score')}>Form</th>
          </tr>
        </thead>
        <tbody>{participantRows}</tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
