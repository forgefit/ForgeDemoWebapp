import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const { sortBy } = useParams();
  const [leaderboardData, setLeaderboardData] = useState([]);

  const exerciseName = 'Lateral Raises';

  useEffect(() => {
    if (!exerciseName) return;

    const fetchData = async () => {
      const demoUsersRef = collection(firestore, 'DEMO_USERS');
      let leaderboard = [];

      const usersSnapshot = await getDocs(demoUsersRef);
      for (const userDoc of usersSnapshot.docs) {
        const userEmail = userDoc.id;
        const exerciseRef = collection(userDoc.ref, exerciseName);

        const exerciseSnapshot = await getDocs(exerciseRef);
        let bestStrength = -1;
        let correspondingVolume = -1;
        for (const exerciseDoc of exerciseSnapshot.docs) {
          const data = exerciseDoc.data();
          if (data.peak_strength > bestStrength) {
            bestStrength = data.peak_strength;
            correspondingVolume = data.peak_volume;
          }
        }

        if (bestStrength !== -1) {
          leaderboard.push({
            email: userEmail,
            peak_strength: bestStrength,
            peak_volume: correspondingVolume,
          });
        }
      }
      if (sortBy === 'strength'){
        leaderboard.sort((a, b) => b.peak_strength - a.peak_strength);
      } else {
        leaderboard.sort((a, b) => b.peak_volume - a.peak_volume);
      }
      
      setLeaderboardData(leaderboard);
    };

    const exerciseUnsubscribes = [];

    const subscribeToExercises = async () => {
      const demoUsersRef = collection(firestore, 'DEMO_USERS');
      const usersSnapshot = await getDocs(demoUsersRef);
      
      for (const userDoc of usersSnapshot.docs) {
        const exerciseRef = collection(userDoc.ref, exerciseName);
        const unsubscribe = onSnapshot(exerciseRef, () => {
          fetchData();
        });
        exerciseUnsubscribes.push(unsubscribe);
      }
    };

    subscribeToExercises();

    return () => {
      exerciseUnsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [exerciseName, sortBy]);

  return (
    <div>
      <h1>Leaderboard</h1>
      <h2>{exerciseName}</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Peak Strength</th>
            <th>Peak Volume</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.email}</td>
              <td>{entry.peak_strength}</td>
              <td>{Math.round(entry.peak_volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
