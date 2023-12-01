import { useEffect, useState } from "react";
import Collapsible from 'react-collapsible';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Workout = () => {
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exerciseData, setExerciseData] = useState([]);

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

    }, []);

    return (
        <section>
            {exercises.map((exercise) => {
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
            })}
        </section>
    )
}

export default Workout;