import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import HomeComponent from './components/home/home.component.tsx';
import RegisterComponent from './components/register/register.component.tsx';
import LoginComponent from './components/login/login.component.tsx';
import './assets/scss/main.scss';

const App: React.FC = () => {
    const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
    const [loading, setLoading] = useState(true);


    const checkLogin = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/checkAuth', { withCredentials: true });
            setUser(response.data.user);
        } catch (error) {
            console.log('User not authenticated:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    if (loading) {
        return <></>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterComponent/>} />
                <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginComponent/>} />
                <Route index path="/home" element={user ? <HomeComponent firstName={user.firstName} lastName={user.lastName} /> : <Navigate to="/login"/>} />
                <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
