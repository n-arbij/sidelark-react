import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const services = [
        { id: 1, label: 'Tasks', color: '#6ECFCF', area: 'tasks' },
        { id: 2, label: 'Goals', color: '#f66b56', area: 'goals' },
        { id: 3, label: 'Journals', color: '#90e2f4', area: 'journals', isPromo: true },
        { id: 4, label: 'Habits', color: '#6ECFCF', area: 'habits' },
        { id: 5, label: 'Calendar', color: '#FFFFFF', area: 'calendar', isCrm: true },
        { id: 6, label: 'Finance', color: '#388d7f', area: 'finance' },
    ];

    const handleClick = (service) => {
        navigate(`/${service.area}`);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <p className="dashboard-subtitle">Get started with Sidelark</p>
                <h1 className="dashboard-title">What are you looking up-to?</h1>
            </div>

            <div className="services-grid">
                {services.map((service) => (
                    <button
                        key={service.id}
                        className={`service-tile service-tile--${service.area}`}
                        style={{ backgroundColor: service.color }}
                        onClick={() => handleClick(service)}
                    >
                        <span className="service-tile__label">{service.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;