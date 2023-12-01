import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import turtle from "../giphy.gif";
import axios from "axios";

const WorkoutHistory = () => {
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    useEffect(() => {
        setLoading(true);
        const fetchWorkoutHistory = async (selectedDate) => {
            try {
                const response = await axios.get(`http://localhost:8080/workouts-history?start=${startOfDay.toISOString()}&end=${endOfDay.toISOString()}`);
                const workoutHistoryData = response.data.map(workout => {
                    return {
                        ...workout,
                        date: new Date(workout.date),
                    };
                });
                setWorkoutHistory(workoutHistoryData);
            } catch (error) {
                console.error('Error fetching workout history:', error);
            }
        };

        fetchWorkoutHistory(selectedDate);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [selectedDate]);

    const handleLogOut = () => {
        navigate('/');
    };

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

    const deleteWorkout = (index, isWorkout) => {
        const newWorkoutHistory = [...workoutHistory];
        if (isWorkout) {
            newWorkoutHistory.splice(index, 1);
        } else {
            newWorkoutHistory[index].exercises = newWorkoutHistory[index].exercises.filter((_, i) => i !== index);
        }
        setWorkoutHistory(newWorkoutHistory);
    };

    const isTableFormat = true;

    return (
        <div>
            <section>
                <button className="login-button" onClick={() => navigate('/custom-workout')} style={{ float: 'left', marginLeft: '100px' }}><span className="text">Home</span></button>
                <button className="login-button" onClick={handleLogOut} style={{ float: 'right', marginRight: '100px'}}><span className="text">Log Out</span></button>
                <div className="title" style={{textAlign: 'center', marginLeft: 350}}>
                    <h1>Welcome to Your Workout!</h1>
                </div>
                <section className="grid">
                    <section className="exercises">
                        <div className="box">
                            <DatePicker className="center-text" selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                            <section>
                                {workoutHistory.length > 0 ? (
                                    workoutHistory.map((workout, index) => (
                                        <div key={index}>
                                            <h2>Workout on {selectedDate.toLocaleDateString()}</h2>
                                            {isTableFormat ? (
                                                <table className="center">
                                                    <thead>
                                                    <tr>
                                                        <th>Exercise</th>
                                                        <th></th>
                                                        <th>Sets</th>
                                                        <th></th>
                                                        <th>Reps</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {workout.exercises.map((exercise, index) => (
                                                        <tr key={index} className="exercises">
                                                            <td>{exercise.name}</td>
                                                            <td></td>
                                                            <td>{exercise.sets}</td>
                                                            <td></td>
                                                            <td>{exercise.reps}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                workout.exercises.map((exercise, index) => (
                                                    <p key={index} className="exercise">
                                                        {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
                                                    </p>
                                                ))
                                            )}
                                            <br />
                                            <button onClick={() => deleteWorkout(index, true)}>Delete Workout</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No workout history to display.</p>
                                )}
                            </section>
                        </div>
                    </section>
                </section>
            </section>
        </div>
    );
};

export default WorkoutHistory;
