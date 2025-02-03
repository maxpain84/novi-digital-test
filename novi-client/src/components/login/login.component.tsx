import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './login.component.scss';

const LoginComponent = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errors: { [key: string]: string } = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) errors.email = 'Enter a valid email';

        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters long';

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Validation errors:", validationErrors);
            return;
        }

        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(() => {
            navigate('/home', { replace: true });
            window.location.reload();
        })
        .catch(() => {
            setErrors({
                password: 'Invalid credentials'
            });
        });

    };

    return (
        <div className="page-wrapper">
            <h1>Login</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    {errors.password && <span className="form-error">{errors.password}</span>}

                    {errors.general && <p className="form-error">{errors.general}</p>}

                    <button type="submit">Login</button>
                </form>
                <Link to="/register">Don't have account? Register here.</Link>
            </div>
        </div>


    );
};

export default LoginComponent;
