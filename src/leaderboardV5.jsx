import React, {useState, useEffect} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {firestore} from './firebaseConfig';
import {useParams} from 'react-router-dom';

const Leaderboard = () => {
    const {sortBy} = useParams();
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [ranking, setRanking] = useState('strength');
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            const exercisesRef = collection(firestore, 'DEMO_EXERCISES');
            const snapshot = await getDocs(exercisesRef);
            const exercisesList = snapshot.docs.map((doc) => doc.id);
            setExercises(exercisesList);
            const defaultExercise = exercisesList.includes('Sled Pulls') ? 'Sled Pulls' : exercisesList[0];
            setSelectedExercise(defaultExercise);
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        if (!selectedExercise || !ranking) return;

        const fetchData = async () => {
            const demoUsersRef = collection(firestore, 'DEMO_USERS');
            let leaderboard = [];

            const usersSnapshot = await getDocs(demoUsersRef);
            for (const userDoc of usersSnapshot.docs) {
                const userEmail = userDoc.id;
                const exerciseRef = collection(userDoc.ref, selectedExercise);

                const exerciseSnapshot = await getDocs(exerciseRef);
                let bestStrength = -1;
                let correspondingVolume = -1;
                let reactionTime = -1;
                for (const exerciseDoc of exerciseSnapshot.docs) {
                    const data = exerciseDoc.data();

                    if (!data.workoutData) continue;

                    if (data.peak_strength > bestStrength) {
                        bestStrength = data.peak_strength;
                        correspondingVolume = data.peak_volume;
                        reactionTime = (data.workoutData.findIndex((v) => v === Math.max(...data.workoutData)) + 1) * 0.17;
                    }
                }

                if (bestStrength !== -1) {
                    leaderboard.push({
                        email: userEmail,
                        peak_strength: bestStrength,
                        peak_volume: correspondingVolume,
                        reaction_time: reactionTime,
                    });
                }
            }

            if (ranking === 'strength') {
                leaderboard.sort((a, b) => b.peak_strength - a.peak_strength);
            } else if (ranking === 'volume') {
                leaderboard.sort((a, b) => b.peak_volume - a.peak_volume);
            } else {
                leaderboard = leaderboard.filter(entry => entry.reaction_time !== -1);
                leaderboard.sort((a, b) => a.reaction_time - b.reaction_time);
            }

            setLeaderboardData(leaderboard);
        };

        fetchData();
    }, [selectedExercise, ranking]);

    const handleExerciseChange = (event) => {
        setSelectedExercise(event.target.value);
    };

    const handleRankingChange = (event) => {
        setRanking(event.target.value);
    };
    return (
        <div>
            <h1>Leaderboard</h1>
            <label htmlFor="exercise-select">Select exercise:</label>
            <select
                id="exercise-select"
                value={selectedExercise}
                onChange={handleExerciseChange}
            >
                {
                    exercises.map((exercise) => (
                        <option key={exercise} value={exercise}>
                            {exercise}
                        </option>
                    ))
                }
            </select>
            <label htmlFor="ranking-select">Rank by:</label>
            <select
                id="ranking-select"
                value={ranking}
                onChange={handleRankingChange}
            >
                <option value="strength">Strength</option>
                <option value="volume">Volume</option>
                <option value="reaction_time">Reaction Time</option>
            </select>
            <table>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Peak Strength</th>
                    <th>Peak Volume</th>
                    <th>Reaction Time</th>
                </tr>
                </thead>
                <tbody>
                {leaderboardData.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.email}</td>
                        <td>{entry.peak_strength}</td>
                        <td>{Math.round(entry.peak_volume)}</td>
                        <td>{entry.reaction_time !== -1 ? `${entry.reaction_time.toFixed(2)} s` : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
