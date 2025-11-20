import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthState, logout } from '../store/authStore';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getAuthState().user);

  // Update user info on mount in case auth state is already present
  useEffect(() => {
    setUser(getAuthState().user);
    // Listen to storage events to update user if auth changes in another tab
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'srt_user') {
        setUser(getAuthState().user);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="srt-sidebar">
      <div className="srt-sidebar-top">
        <div className="srt-brand">IT Service Desk</div>
        <nav className="srt-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>Users</NavLink>
          <NavLink to="/admin/itstaff" className={({isActive}) => isActive ? 'active' : ''}>IT Staff</NavLink>
        </nav>
      </div>

      <div className="srt-sidebar-bottom">
        <div className="srt-user">
          <div className="srt-avatar" />
          <div className="srt-user-info">
            <div className="srt-user-name">{user?.username ?? 'Alex Johnson'}</div>
            <div className="srt-user-email">{user?.email ?? 'alex.j@company.com'}</div>
          </div>
        </div>
        <button className="srt-logout" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
