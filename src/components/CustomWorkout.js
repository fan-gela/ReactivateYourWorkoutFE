import { useEffect, useState } from "react";
import Collapsible from 'react-collapsible';
import turtle from '../giphy.gif';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const CustomWorkout = () => {
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exerciseData, setExerciseData] = useState([]);
    const [targetMuscle, setTargetMuscle] = useState('abs');
    const [isCompleted, setIsCompleted] = useState(false);


    const addWorkout = async (workout) => {
        const workoutData = workout.map((exercise, index) => {
            const currentExerciseData = exerciseData[index];

            const newSets = getRandomInt(2, 5);
            const newReps = getRandomInt(2, 20);

            const updatedExerciseData = {
                ...currentExerciseData,
                sets: newSets,
                reps: newReps
            };

            setExerciseData(prevData => {
                const newData = [...prevData];
                newData[index] = updatedExerciseData;
                return newData;
            });

            return {
                id: index,
                name: exercise.name,
                sets: newSets,
                reps: newReps
            };
        });

    };

    const shuffle = (exercises) => {
        let currentIndex = exercises.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [exercises[currentIndex], exercises[randomIndex]] = [
                exercises[randomIndex], exercises[currentIndex]
            ];
        }
        return exercises
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const handleLogOut = () => {
        navigate('/');
    };

    useEffect(() => {
        setLoading(true);

        const fetchExercises = async () => {

            try {
                const response = await axios.get('http://localhost:8080/exercises');
                const shuffledExercises = shuffle(response.data);

                const workout = shuffledExercises.slice(0,5).map((exercise, index) => {
                    const sets = getRandomInt(2, 5);
                    const reps = getRandomInt(2, 20);
                    return {
                        ...exercise,
                        sets: sets,
                        reps: reps
                    };
                });
                setExercises(workout);
                addWorkout(workout);
            } catch (error) {
                console.error(error);
            }
        }

        fetchExercises();

        setTimeout(() => {
            setLoading(false);
        }, 2000);

    }, [targetMuscle]);

    if (loading) {
        return (
            <section className="background-page">
                <button className="login-button" role="button" onClick={handleLogOut} style={{ float: 'right', marginRight: '100px'}}><span className="text">Log Out</span></button>
                <div className="title" style={{textAlign: 'center', marginLeft: 350}}>
                    <h1>Welcome to Your Workout!</h1>
                </div>
                <section className="grid">
                    <section className="exercises">
                        <div className="box">
                            <img src={turtle} alt="loading turtle"/>
                        </div>
                    </section>
                </section>
            </section>
        );
    }

    const handleComplete = async (workout) => {
        if (!Array.isArray(workout)) {
            console.error('workout is not an array');
            return;
        }
        setIsCompleted(true);

        const workoutData = workout.map((exercise, index) => {
            const { sets, reps } = exercise;
            return {id: index, name: exercise.name, sets: sets, reps: reps};
        });

        const date = new Date();

        const workoutToSave = {date: date, exercises: workoutData};

        try {
            const response = await axios.post('http://localhost:8080/workouts-history/saveWorkout', workoutToSave);
            console.log("Workout successfully saved!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section>
            <button className="login-button" role="button" onClick={handleLogOut} style={{ float: 'right', marginRight: '100px'}}><span className="text">Log Out</span></button>
            <button className="login-button" role="button" onClick={() => navigate('/workout-history')} style={{ float: 'left', marginLeft: '100px' }}><span className="text">View Workout History</span></button>
            <div className="title" style={{textAlign: 'center', marginLeft: 350}}>
                <h1>What workout do you want to do today?</h1>
            </div>
            <section className="grid">
                <section className="exercises">
                    <div className="box">
                        <select value={targetMuscle} onChange={(e) => setTargetMuscle(e.target.value)}>
                            <option value="abs">Abs</option>
                            <option value="pectorals">Chest</option>
                            <option value="back">Back</option>
                            <option value="calves">Legs</option>
                            <option value="forearms">Arms</option>
                        </select>
                        <section>
                            {targetMuscle ? (
                                exercises.map((exercise) => {
                                    const { sets, reps } = exercise;
                                    return (
                                        <section>
                                            <p className="exercise">
                                                <Collapsible trigger={exercise.name + " - " + exercise.sets + " sets x " + exercise.reps + " reps"} key={exercise.id}>
                                                    <p className="exercise-description">{exercise.description}</p>
                                                    <img src={exercise.gifUrl} alt='' className="exercise-gif"/>
                                                </Collapsible>
                                            </p>
                                        </section>
                                    )
                                })
                            ) : (
                                <p>Please select a muscle group to view workouts.</p>
                            )}
                            <button className="login-button center" role="button" onClick={() => handleComplete(exercises)}><span className="text">Workout Complete</span></button>
                        </section>
                    </div>
                </section>
            </section>
        </section>
    );
}

export default CustomWorkout;