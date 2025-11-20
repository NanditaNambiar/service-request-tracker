import AdminLayout from '../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthState } from '../../store/authStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [itStaffCount, setItStaffCount] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [openRequests, setOpenRequests] = useState(0);
  const [closedRequests, setClosedRequests] = useState(0);
  const [requestsByStaff, setRequestsByStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = getAuthState();

  const getStatusString = (status: any): string => {
    if (typeof status === 'boolean') {
      return status ? 'Open' : 'Closed';
    }
    if (typeof status === 'string') {
      return status;
    }
    if (status && typeof status === 'object' && 'name' in status) {
      return status.name;
    }
    return 'Unknown';
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = getAuthState().token;
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch all users
        const usersRes = await fetch('http://localhost:8080/users', { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const users = usersData.data || [];
          // Count only ROLE_USER (not admins or IT staff)
          setUserCount(users.filter((u: any) => u.roleName === 'ROLE_USER').length);
        }

        // Fetch all users again to filter IT staff
        const itRes = await fetch('http://localhost:8080/users', { headers });
        if (itRes.ok) {
          const itData = await itRes.json();
          const itStaff = (itData.data || []).filter((u: any) => u.roleName === 'ROLE_IT_STAFF');
          setItStaffCount(itStaff.length);
        }

        // Fetch all requests
        const requestsRes = await fetch('http://localhost:8080/requests', { headers });
        console.log('Requests API Response Status:', requestsRes.status);
        
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          console.log('Requests Data:', requestsData);
          const requests = requestsData.data || [];
          
          // Total requests
          setTotalRequests(requests.length);
          
          // Count open/closed requests
          let openCount = 0;
          let closedCount = 0;
          requests.forEach((req: any) => {
            // Check status - could be boolean, string, or object
            const statusStr = getStatusString(req.status);
            if (statusStr === 'Open') {
              openCount++;
            } else if (statusStr === 'Closed') {
              closedCount++;
            }
          });
          setOpenRequests(openCount);
          setClosedRequests(closedCount);

          // Count requests by IT staff
          const staffRequestMap = new Map<string, number>();
          requests.forEach((req: any) => {
            if (req.handledByName) {
              staffRequestMap.set(req.handledByName, (staffRequestMap.get(req.handledByName) || 0) + 1);
            }
          });
          const staffArray = Array.from(staffRequestMap, ([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
          setRequestsByStaff(staffArray);
        } else {
          const errorData = await requestsRes.text();
          console.error('Failed to fetch requests. Status:', requestsRes.status, 'Response:', errorData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.username || 'Admin'}. Here's an overview of the system.</p>
        </header>

        <div className="admin-cards">
          <div className="card" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
            <div className="card-title">Users</div>
            <div className="card-value">{loading ? '...' : userCount}</div>
            <div className="card-sub">Total active users</div>
            <div className="card-link">Manage Users →</div>
          </div>

          <div className="card" onClick={() => navigate('/admin/itstaff')} style={{ cursor: 'pointer' }}>
            <div className="card-title">IT Staff</div>
            <div className="card-value">{loading ? '...' : itStaffCount}</div>
            <div className="card-sub">Total IT staff members</div>
            <div className="card-link">Manage IT Staff →</div>
          </div>
        </div>

        {/* Service Request Metrics Section */}
        <div className="metrics-section">
          <h2 className="metrics-heading">Service Request Metrics</h2>
          <div className="metrics-cards">
            <div className="metric-card">
              <div className="metric-title">Total Requests</div>
              <div className="metric-value">{loading ? '...' : totalRequests}</div>
              <div className="metric-sub">All service requests</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Open Requests</div>
              <div className="metric-value" style={{ color: '#2563eb' }}>{loading ? '...' : openRequests}</div>
              <div className="metric-sub">Pending resolution</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Closed Requests</div>
              <div className="metric-value" style={{ color: '#10b981' }}>{loading ? '...' : closedRequests}</div>
              <div className="metric-sub">Completed requests</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
