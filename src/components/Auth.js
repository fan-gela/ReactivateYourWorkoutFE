import { useEffect, useState } from 'react';
import { db, authentication, ui, googleProvider } from '../config/firebase';
import { doc, getDoc, setDoc, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import Home from './Home';
import CustomWorkout from './CustomWorkout';

export const Auth = () => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    var urlParams = new URLSearchParams(window.location.search);
    var show = urlParams.get('show');
    useEffect(() => {
        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    setIsAuthenticated(true);
                    return true;
                },
            },
            signInFlow: 'popup',
            signInSuccessUrl: '/custom-workout',
            signInOptions: [
                {
                    provider: EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: false
                }
            ],
        };

        ui.start('#firebaseui-auth-container', uiConfig);

        const unsubscribe = onAuthStateChanged(authentication, (user) => {
            if (user) {
                setIsAuthenticated(true);
                console.log("User is signed in");
            } else {
                setIsAuthenticated(false);
                console.log("User is signed out");
            }
        });

        const fetchUserData = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log('No such user!');
                }
            } else {
                console.log('No user is signed in.');
            }
        };
        fetchUserData();

        return () => unsubscribe();
    }, [user]);

    if (!user) {
        return <Home />;
    } else {
        return <CustomWorkout />
    }


    const signIn = async () => {
        try {
            const userCredential = await signInWithPopup(authentication, googleProvider);
            const user = userCredential.user;
            await addUser(user);
            setUser(user);
            setIsAuthenticated(true);
        } catch (err){
            console.error(err);
        }
    };

    const addUser = async (user) => {
        try {
            if (!user) {
                console.error('User is not authenticated');
                return;
            }
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email
            });
        } catch (err) {
            console.error('Error in addUser: ', err);
        }
    };

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
            const user = userCredential.user;
            console.log('User signed up: ', user);

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, {
                email: user.email,
            });
        } catch (error) {
            console.error('Error during sign up: ', error);
        }
    };

    const logOut = async () => {
        try {
            await signOut(authentication);
            setIsAuthenticated(false);
        } catch (err){
            console.error(err);
        }
    };

    return (
        <section>
            <div className="title" style={{textAlign: 'center'}}>
                <h1>Welcome to Your Workout!</h1>
            </div>
            <section className="grid">
                <section className="exercises">
                    <div className="box">
                        <section>
                            <div id="firebaseui-auth-container"></div>
                        </section>
                    </div>
                </section>
            </section>
        </section>
    );

};