import './App.css';
import Workout from './components/Workout.js'
import {Auth} from "./components/Auth";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import CustomWorkout from "./components/CustomWorkout";
import WorkoutHistory from "./components/WorkoutHistory";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/custom-workout" element={<CustomWorkout />} />
          <Route path="/workout-history" element={<WorkoutHistory />} />
        </Routes>
      </Router>
  );
}

function Home() {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
      <section className="background-page">
        <button className="login-button" role="button" onClick={handleSignIn} style={{ float: 'right', marginRight: '100px'}}><span className="text">Sign in</span></button>
        <div className="title" style={{textAlign: 'center', marginLeft: 350}}>
          <h1>Welcome to Your Workout!</h1>
        </div>
        <section className="grid">
          <section className="exercises">
            <div className="box">
              <Workout />
            </div>
          </section>
        </section>
      </section>
  );
}

export default App;
