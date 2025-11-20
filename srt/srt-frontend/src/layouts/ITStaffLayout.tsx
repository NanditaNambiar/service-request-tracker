import { NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getAuthState, logout } from '../store/authStore';
import { useState, useEffect } from 'react';

export default function ITStaffLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getAuthState().user);

  useEffect(() => {
    setUser(getAuthState().user);
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
    <div className="srt-admin-root">
      <aside className="srt-sidebar">
        <div className="srt-sidebar-top">
          <div className="srt-brand">IT Service Desk</div>
          <nav className="srt-nav">
            <NavLink to="/it/requests" end className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="srt-sidebar-bottom">
          <div className="srt-user">
            <div className="srt-avatar" />
            <div className="srt-user-info">
              <div className="srt-user-name">{user?.username ?? 'IT Staff'}</div>
              <div className="srt-user-email">{user?.email ?? 'staff@company.com'}</div>
            </div>
          </div>
          <button className="srt-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="srt-admin-main">{children}</main>
    </div>
  );
}
