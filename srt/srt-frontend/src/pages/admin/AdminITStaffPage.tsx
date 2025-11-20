import AdminLayout from '../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { getAuthState } from '../../store/authStore';

export default function AdminITStaffPage() {
  const [itStaff, setItStaff] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', categoryId: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Reset form when add modal opens
  useEffect(() => {
    if (showAddModal) {
      setFormData({ username: '', email: '', password: '', categoryId: '' });
    }
  }, [showAddModal]);

  useEffect(() => {
    fetchITStaff();
    fetchCategories();
    fetchRoles();
  }, []);

  const fetchITStaff = async () => {
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/users', { headers });
      if (res.ok) {
        const data = await res.json();
        const staff = (data.data || []).filter((u: any) => u.roleName === 'ROLE_IT_STAFF');
        setItStaff(staff);
      }
    } catch (err) {
      console.error('Failed to fetch IT staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = getAuthState().token;
      console.log('Token:', token);
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/categories', { headers });
      console.log('Category response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched categories:', data);
        console.log('Categories array:', data.data);
        if (data.data && data.data.length > 0) {
          console.log('First category:', data.data[0]);
        }
        setCategories(data.data || []);
      } else {
        const error = await res.text();
        console.error('Category fetch error:', error);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
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

  const handleAddStaff = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email ID is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters long';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      console.log('handleAddStaff called with formData:', formData);
      console.log('Available roles:', roles);
      
      // Find the ROLE_IT_STAFF role ID
      const itStaffRole = roles.find((r: any) => r.name === 'ROLE_IT_STAFF');
      const roleId = itStaffRole ? itStaffRole.id : 2; // Fallback to 2 if not found
      
      console.log('Using role ID:', roleId);

      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        category: { id: parseInt(formData.categoryId) },
        department: { id: 2 }, // IT Department ID
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
        setFormData({ username: '', email: '', password: '', categoryId: '' });
        setErrors({});
        fetchITStaff();
        alert('IT Staff created successfully!');
      } else {
        const error = await res.json();
        console.error('Create failed:', error);
        alert('Failed to create IT staff: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to create IT staff:', err);
      alert('Error creating IT staff: ' + err);
    }
  };

  const handleViewStaff = (staff: any) => {
    setSelectedStaff(staff);
    setFormData({ username: staff.username, email: staff.email, password: '', categoryId: staff.categoryId || '' });
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  const handleEditStaff = async () => {
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
    if (!formData.categoryId) {
      newEditErrors.categoryId = 'Please select a category';
    }

    setEditErrors(newEditErrors);
    if (Object.keys(newEditErrors).length > 0) {
      return;
    }

    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const res = await fetch(`http://localhost:8080/users/${selectedStaff.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          categoryId: formData.categoryId,
          ...(formData.password && { password: formData.password }),
        }),
      });
      if (res.ok) {
        setShowDetailModal(false);
        setFormData({ username: '', email: '', password: '', categoryId: '' });
        setEditErrors({});
        fetchITStaff();
      }
    } catch (err) {
      console.error('Failed to update IT staff:', err);
    }
  };

  const handleDeleteStaff = async () => {
    if (!window.confirm('Are you sure you want to delete this IT staff member?')) return;
    try {
      console.log('Deleting IT staff with ID:', selectedStaff.id);
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch(`http://localhost:8080/users/${selectedStaff.id}`, {
        method: 'DELETE',
        headers,
      });
      
      console.log('Delete response status:', res.status);
      
      if (res.ok) {
        setShowDetailModal(false);
        fetchITStaff();
        alert('IT Staff deleted successfully!');
      } else {
        const error = await res.json();
        console.error('Delete failed:', error);
        alert('Failed to delete IT staff: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to delete IT staff:', err);
      alert('Error deleting IT staff: ' + err);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <header className="page-header">
          <div>
            <h1>Manage IT Staff</h1>
            <p className="subtitle">Add, edit, or remove IT staff members.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New IT Staff</button>
        </header>

        {loading ? (
          <p>Loading IT staff...</p>
        ) : (
          <>
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #e3e7ea', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', color: '#333', paddingRight: '1.5rem' }}
              >
                <option value="">All Categories</option>
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name || cat.categoryName}>
                      {cat.name || cat.categoryName || 'Unnamed'}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL ID</th>
                  <th>CATEGORY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {itStaff.filter((staff) => {
                  const matches = staff.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterCategory === '' || staff.categoryName === filterCategory);
                  return matches;
                }).map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.username}</td>
                    <td>{staff.email}</td>
                    <td>{staff.categoryName || '-'}</td>
                    <td>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleViewStaff(staff); }} className="link-action">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Add IT Staff Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); setErrors({}); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>Create New IT Staff</h2>
                <button className="close-btn" onClick={() => { setShowAddModal(false); setErrors({}); }}>✕</button>
              </header>
              <form onSubmit={(e) => { e.preventDefault(); handleAddStaff(); }} className="modal-form" autoComplete="off" noValidate>
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
                      placeholder="staff@example.com"
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
                    <label>Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        setFormData({ ...formData, categoryId: e.target.value });
                        if (errors.categoryId) setErrors({ ...errors, categoryId: '' });
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.categoryId}</div>}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => { setShowAddModal(false); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary">Create IT Staff</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* IT Staff Detail Modal */}
        {showDetailModal && selectedStaff && (
          <div className="modal-overlay" onClick={() => { setShowDetailModal(false); setFormData({ username: '', email: '', password: '', categoryId: '' }); setEditErrors({}); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>{isEditMode ? 'Edit IT Staff' : 'IT Staff Details'}</h2>
                <button className="close-btn" onClick={() => { setShowDetailModal(false); setFormData({ username: '', email: '', password: '', categoryId: '' }); setEditErrors({}); }}>✕</button>
              </header>
              {isEditMode ? (
                <form onSubmit={(e) => { e.preventDefault(); handleEditStaff(); }} className="modal-form" autoComplete="off" noValidate>
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
                        placeholder="staff@example.com"
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
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => {
                          setFormData({ ...formData, categoryId: e.target.value });
                          if (editErrors.categoryId) setEditErrors({ ...editErrors, categoryId: '' });
                        }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {editErrors.categoryId && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{editErrors.categoryId}</div>}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => { setIsEditMode(false); setEditErrors({}); }}>Cancel</button>
                    <button type="submit" className="btn-primary">Update IT Staff</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="modal-content">
                    <p><strong>Name:</strong> {selectedStaff.username}</p>
                    <p><strong>Email:</strong> {selectedStaff.email}</p>
                    <p><strong>Category:</strong> {selectedStaff.categoryName || '-'}</p>
                  </div>
                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setIsEditMode(true)}>Edit</button>
                    <button className="btn-danger" onClick={handleDeleteStaff}>Delete</button>
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
