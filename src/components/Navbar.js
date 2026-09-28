import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    CheckSquare,
    Target,
    BookOpen,
    Flame,
    Wallet,
    Menu,
    X,
} from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
    { id: 1, path: '/calendar', label: 'Calendar', Icon: CalendarDays },
    { id: 2, path: '/tasks',    label: 'Tasks',    Icon: CheckSquare  },
    { id: 3, path: '/goals',    label: 'Goals',    Icon: Target       },
    { id: 4, path: '/journals', label: 'Journals', Icon: BookOpen     },
    { id: 5, path: '/habits',   label: 'Habits',   Icon: Flame        },
    { id: 6, path: '/finance',  label: 'Finance',  Icon: Wallet       },
];

function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const handleNav = (path) => {
        if (location.pathname !== path) {
            navigate(path);
        }
        setOpen(false);
    };

    return (
        <div className={`nav-wrapper ${open ? 'nav-wrapper--open' : ''}`}>
            <button
                className="nav-trigger-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
            >
                {open ? (
                    <X size={20} color="#fff" strokeWidth={2.5} />
                ) : (
                    <Menu size={20} color="#fff" strokeWidth={2.5} />
                )}
            </button>

            {NAV_ITEMS.map((item, index) => {
                const { Icon } = item;
                const isActive = location.pathname === item.path;

                return (
                    <button
                        key={item.id}
                        className={`nav-sub-btn nav-sub-btn--${index + 1} ${open ? 'nav-sub-btn--visible' : ''} ${isActive ? 'nav-sub-btn--active' : ''}`}
                        onClick={() => handleNav(item.path)}
                        title={item.label}
                        aria-label={item.label}
                    >
                        <Icon
                            size={18}
                            strokeWidth={2}
                            color={isActive ? '#fff' : '#1a1a1a'}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default Navbar;