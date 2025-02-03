import axios from 'axios';
import './home.component.scss';

axios.defaults.withCredentials = true;

const HomeComponent: React.FC<{ firstName: string; lastName: string }> = ({ firstName, lastName }) => {
    const handleLogout = async () => {
        await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });

        window.location.reload();

    };

    return (
        <div className="container">
            <div className="header">
                <img className="logo" src="/novi.png" alt="NOVI logo"/>
                <h1>Welcome {firstName} {lastName}</h1>
            </div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomeComponent;
