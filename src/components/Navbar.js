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
    LayoutDashboard,
} from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
    { id: 1, ring: 1, path: '/',         label: 'Dashboard', Icon: LayoutDashboard },
    { id: 2, ring: 1, path: '/calendar', label: 'Calendar',  Icon: CalendarDays },
    { id: 3, ring: 1, path: '/tasks',    label: 'Tasks',     Icon: CheckSquare },
    { id: 4, ring: 2, path: '/goals',    label: 'Goals',     Icon: Target },
    { id: 5, ring: 2, path: '/journals', label: 'Journals',  Icon: BookOpen },
    { id: 6, ring: 2, path: '/habits',   label: 'Habits',    Icon: Flame },
    { id: 7, ring: 2, path: '/finance',  label: 'Finance',   Icon: Wallet },
];

const RING_RADII = { 1: 90, 2: 150 };

const RINGS = [1, 2].map((ring) => ({
    radius: RING_RADII[ring],
    items: NAV_ITEMS.filter((item) => item.ring === ring),
}));

const angleFor = (i, n) => (n === 1 ? 45 : 5 + (i * 80) / (n - 1));

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

            {RINGS.map((ring, r) => {
                const offset = RINGS.slice(0, r).reduce((sum, x) => sum + x.items.length, 0);
                return ring.items.map((item, i) => {
                    const { Icon } = item;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.id}
                            className={`nav-sub-btn ${open ? 'nav-sub-btn--visible' : ''} ${isActive ? 'nav-sub-btn--active' : ''}`}
                            style={{
                                '--angle': `${angleFor(i, ring.items.length)}deg`,
                                '--radius': `${ring.radius}px`,
                                '--i': offset + i,
                            }}
                            onClick={() => handleNav(item.path)}
                            title={item.label}
                            aria-label={item.label}
                        >
                            <Icon size={18} strokeWidth={2} />
                        </button>
                    );
                });
            })}
        </div>
    );
}

export default Navbar;