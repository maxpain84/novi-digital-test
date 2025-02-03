import React, {useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import './register.component.scss';

axios.defaults.withCredentials = true;

const RegisterComponent: React.FC = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const URL: string = 'http://localhost:8000';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';

        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters long';

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post(`${URL}/api/register`, formData);
            if (response.status === 200) {
                navigate('/home');
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-wrapper">
            <h1>Register</h1>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />
                    {errors.firstName && <p>{errors.firstName}</p>}

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                    {errors.lastName && <p>{errors.lastName}</p>}

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    {errors.email && <p>{errors.email}</p>}

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    {errors.password && <p>{errors.password}</p>}

                    <button type="submit">Register</button>
                </form>
                <Link to="/login">Already have account? Login here.</Link>
            </div>
        </div>

    );
};

export default RegisterComponent;
