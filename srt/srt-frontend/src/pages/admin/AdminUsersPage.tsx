import AdminLayout from '../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { getAuthState } from '../../store/authStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', departmentId: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Reset form when add modal opens
  useEffect(() => {
    if (showAddModal) {
      setFormData({ username: '', email: '', password: '', departmentId: '' });
    }
  }, [showAddModal]);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/users', { headers });
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched all users:', data.data);
        const filteredUsers = (data.data || []).filter((u: any) => u.roleName === 'ROLE_USER');
        console.log('Filtered users with ROLE_USER:', filteredUsers);
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = getAuthState().token;
      console.log('Token:', token);
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/departments', { headers });
      console.log('Department response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched departments:', data);
        console.log('Departments array:', data.data);
        if (data.data && data.data.length > 0) {
          console.log('First department:', data.data[0]);
        }
        setDepartments(data.data || []);
      } else {
        const error = await res.text();
        console.error('Department fetch error:', error);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/api/roles', { headers });
      if (res.ok) {
        const data = await res.json();
        setRoles(data.data || []);
        console.log('Fetched roles:', data.data);
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const handleAddUser = async () => {
    console.log('handleAddUser called with formData:', formData);
    
    const newErrors: { [key: string]: string } = {};

    // Validation: Check if username is empty
    if (!formData.username.trim()) {
      newErrors.username = 'Full Name is required';
    }

    // Validation: Check if email is empty
    if (!formData.email.trim()) {
      newErrors.email = 'Email ID is required';
    } else {
      // Validation: Check if email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validation: Check if password is empty
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      // Validation: Check if password is at least 3 characters
      newErrors.password = 'Password must be at least 3 characters long';
    }

    // Validation: Check if department is selected
    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select a department';
    }

    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log('Validation passed, sending to backend');

    try {
      // Find the ROLE_USER role ID
      const userRole = roles.find((r: any) => r.name === 'ROLE_USER');
      const roleId = userRole ? userRole.id : 3; // Fallback to 3 if not found
      
      console.log('Using role ID:', roleId, 'from roles:', roles);

      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        department: { id: parseInt(formData.departmentId) },
        role: { id: roleId },
      };
      console.log('Sending payload:', JSON.stringify(payload));
      
      const res = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ username: '', email: '', password: '', departmentId: '' });
        fetchUsers();
        alert('User created successfully!');
      } else {
        const error = await res.json();
        console.error('Create failed:', error);
        alert('Failed to create user: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to create user:', err);
      alert('Error creating user: ' + err);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, password: '', departmentId: user.departmentId || '' });
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  const handleEditUser = async () => {
    const newEditErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newEditErrors.username = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newEditErrors.email = 'Email ID is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newEditErrors.email = 'Please enter a valid email address';
      }
    }
    if (formData.password && formData.password.length < 3) {
      newEditErrors.password = 'Password must be at least 3 characters long';
    }

    setEditErrors(newEditErrors);
    if (Object.keys(newEditErrors).length > 0) {
      return;
    }

    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      const res = await fetch(`http://localhost:8080/users/${selectedUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          ...(formData.password && { password: formData.password }),
        }),
      });
      if (res.ok) {
        setShowDetailModal(false);
        setFormData({ username: '', email: '', password: '', departmentId: '' });
        setEditErrors({});
        fetchUsers();
      } else {
        const error = await res.json();
        console.error('Update failed:', error);
        alert('Failed to update user: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Error updating user: ' + err);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      console.log('Deleting user with ID:', selectedUser.id);
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch(`http://localhost:8080/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers,
      });
      
      console.log('Delete response status:', res.status);
      
      if (res.ok) {
        setShowDetailModal(false);
        fetchUsers();
        alert('User deleted successfully!');
      } else {
        const error = await res.json();
        console.error('Delete failed:', error);
        alert('Failed to delete user: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Error deleting user: ' + err);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <header className="page-header">
          <div>
            <h1>Manage Users</h1>
            <p className="subtitle">Add, edit, or remove company users.</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowAddModal(true); setErrors({}); }}>+ Add New User</button>
        </header>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            {false && (
  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
    Total users in backend: {users.length} | Showing ROLE_USER: {users.filter((u) => u.roleName === 'ROLE_USER').length}
  </div>
)}

            <div className="search-filter-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-btn"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #e3e7ea', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', color: '#333', paddingRight: '1.5rem' }}
              >
                <option value="">All Departments</option>
                {departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.name || dept.departmentName}>
                      {dept.name || dept.departmentName || 'Unnamed'}
                    </option>
                  ))
                ) : (
                  <option disabled>No departments available</option>
                )}
              </select>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL ID</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.filter((u) => {
                  const matches = u.roleName === 'ROLE_USER' && 
                    u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterDepartment === '' || u.departmentName === filterDepartment);
                  return matches;
                }).map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.departmentName || '-'}</td>
                    <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleViewUser(user); }} className="link-action">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); setErrors({}); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>Create New User</h2>
                <button className="close-btn" onClick={() => { setShowAddModal(false); setErrors({}); }}>✕</button>
              </header>
              <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="modal-form" autoComplete="off" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        if (errors.username) setErrors({ ...errors, username: '' });
                      }}
                      autoComplete="off"
                    />
                    {errors.username && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.username}</div>}
                  </div>
                  <div className="form-group">
                    <label>Email ID</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      autoComplete="off"
                    />
                    {errors.email && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.email}</div>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      autoComplete="new-password"
                    />
                    {errors.password && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.password}</div>}
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select 
                      value={formData.departmentId}
                      onChange={(e) => {
                        setFormData({ ...formData, departmentId: e.target.value });
                        if (errors.departmentId) setErrors({ ...errors, departmentId: '' });
                      }}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept: any) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    {errors.departmentId && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.departmentId}</div>}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => { setShowAddModal(false); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showDetailModal && selectedUser && (
          <div className="modal-overlay" onClick={() => { setShowDetailModal(false); setFormData({ username: '', email: '', password: '', departmentId: '' }); setEditErrors({}); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>{isEditMode ? 'Edit User' : 'User Details'}</h2>
                <button className="close-btn" onClick={() => { setShowDetailModal(false); setFormData({ username: '', email: '', password: '', departmentId: '' }); setEditErrors({}); }}>✕</button>
              </header>
              {isEditMode ? (
                <form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }} className="modal-form" autoComplete="off" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={formData.username}
                        onChange={(e) => {
                          setFormData({ ...formData, username: e.target.value });
                          if (editErrors.username) setEditErrors({ ...editErrors, username: '' });
                        }}
                        autoComplete="off"
                      />
                      {editErrors.username && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{editErrors.username}</div>}
                    </div>
                    <div className="form-group">
                      <label>Email ID</label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (editErrors.email) setEditErrors({ ...editErrors, email: '' });
                        }}
                        autoComplete="off"
                      />
                      {editErrors.email && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{editErrors.email}</div>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Password (Leave blank to keep current)</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (editErrors.password) setEditErrors({ ...editErrors, password: '' });
                        }}
                        autoComplete="new-password"
                      />
                      {editErrors.password && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{editErrors.password}</div>}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => { setIsEditMode(false); setEditErrors({}); }}>Cancel</button>
                    <button type="submit" className="btn-primary">Update User</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="modal-content">
                    <p><strong>Name:</strong> {selectedUser.username}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Department:</strong> {selectedUser.departmentName || '-'}</p>
                  </div>
                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setIsEditMode(true)}>Edit</button>
                    <button className="btn-danger" onClick={handleDeleteUser}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
