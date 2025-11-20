import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthState } from '../store/authStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear fields on component mount to prevent autofill
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation: Check if email is empty
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Validation: Check if password is empty
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Show generic error message for invalid credentials (401, 400, or any error response)
        throw new Error('Invalid email or password');
      }

  const data = await res.json();
  // LoginResponseDTO: id, accessToken, username, email, role
  const token = data.accessToken || data.token || data.access_token || null;
  // Normalize role to include ROLE_ prefix because backend may return 'ADMIN' etc.
  const rawRole = data.role || data.roles || '';
  const normalizedRole = rawRole && rawRole.startsWith('ROLE_') ? rawRole : (rawRole ? `ROLE_${rawRole}` : rawRole);
  const user = { id: data.id, username: data.username, email: data.email, role: normalizedRole };

  if (!token) throw new Error('No token returned from server');

  setAuthState(token, user);

      // navigate based on role
      if (user.role && user.role.includes('ADMIN')) navigate('/admin');
      else if (user.role && user.role.includes('IT_STAFF')) navigate('/it/requests');
      else if (user.role && user.role.includes('USER')) navigate('/user/dashboard');
      else navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split">
      <aside className="login-left">
        <h2>IT Service Desk</h2>
        {/* <h1>Your Central Hub for IT Support.</h1> */}
        <p>A unified platform for efficiently managing and tracking IT service requests.</p>
      </aside>
      <section className="login-right">
        <div className="login-box">
          <h1>Welcome!</h1>
          <p className="muted">Login to access the service desk.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label>Email Id</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="text" 
              placeholder="example@company.com"
              autoComplete="new-password"
            />

            <label>Password</label>
            <input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              placeholder="Enter your password"
              autoComplete="new-password"
            />

            {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}

            <button className="primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
