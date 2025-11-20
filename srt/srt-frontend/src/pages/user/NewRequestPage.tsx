import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import { getAuthState } from '../../store/authStore';

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', categoryId: '', description: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch('http://localhost:8080/categories', { headers });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = getAuthState().token;
      const email = getAuthState().user?.email;
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`http://localhost:8080/requests/user/${encodeURIComponent(email || '')}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleAddRequest = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const token = getAuthState().token;
      const user = getAuthState().user;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      const payload = {
        title: formData.title,
        description: formData.description,
        category: { id: parseInt(formData.categoryId) },
        createdBy: { id: user?.id },
      };
      
      const res = await fetch('http://localhost:8080/requests', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ title: '', categoryId: '', description: '' });
        setErrors({});
        fetchRequests();
        alert('Request created successfully!');
      } else {
        const error = await res.json();
        console.error('Failed to create request:', error);
        alert('Failed to create request: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to create request:', err);
      alert('Failed to create request: ' + err);
    }
  };

  const filteredRequests = requests
    .filter((req) => {
      const matchesSearch = req.id?.toString().includes(searchTerm) || (req.title || req.subject)?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusStr = getStatusString(req.status);
      const matchesStatus = filterStatus === 'All' || statusStr === filterStatus;
      return matchesSearch && matchesStatus;
    });

  return (
    <UserLayout>
      <div className="admin-users-page">
        <header className="page-header">
          <div>
            <h1>My Service Requests</h1>
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Request</button>
        </header>

        <div className="info-banner">
          <span>ℹ️</span>
          <p>Please review the <a href="#" onClick={(e) => { e.preventDefault(); navigate('/user/categories'); }} style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Categories</a> before submitting a new request.</p>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by request title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button
              className={filterStatus === 'All' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterStatus('All')}
            >
              All
            </button>
            <button
              className={filterStatus === 'Open' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterStatus('Open')}
            >
              Open
            </button>
            <button
              className={filterStatus === 'Closed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterStatus('Closed')}
            >
              Closed
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem', fontSize: '1.1rem' }}>No requests created yet. Click "Create New Request" to get started!</p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>No requests found matching your filters.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>HANDLED BY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.title || request.subject}</td>
                  <td>{request.categoryName || 'N/A'}</td>
                  <td>{request.handledByName || 'Unassigned'}</td>
                  <td>
                    <span className={`status-badge status-${getStatusString(request.status).toLowerCase()}`}>
                      {getStatusString(request.status)}
                    </span>
                  </td>
                  <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewRequest(request); }} className="link-action">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add New Request Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); setFormData({ title: '', categoryId: '', description: '' }); setErrors({}); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>Submit New Service Request</h2>
                <button className="close-btn" onClick={() => { setShowAddModal(false); setFormData({ title: '', categoryId: '', description: '' }); setErrors({}); }}>✕</button>
              </header>
              <form onSubmit={(e) => { e.preventDefault(); handleAddRequest(); }} className="modal-form" noValidate>
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.categoryId}</div>}
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Laptop screen is flickering"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                  />
                  {errors.title && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.title}</div>}
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Please provide a detailed description of the issue."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: '' });
                    }}
                    style={{ minHeight: '120px', resize: 'vertical' }}
                  />
                  {errors.description && <div style={{ color: 'crimson', fontSize: '0.875rem', marginTop: '4px' }}>{errors.description}</div>}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => { setShowAddModal(false); setFormData({ title: '', categoryId: '', description: '' }); setErrors({}); }}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Request Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <header className="modal-header">
                <h2>Request Details</h2>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>✕</button>
              </header>
              <div className="modal-content">
                <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                <p><strong>Title:</strong> {selectedRequest.title || selectedRequest.subject}</p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
                <p><strong>Category:</strong> {selectedRequest.categoryName || 'N/A'}</p>
                <p><strong>Status:</strong> {getStatusString(selectedRequest.status)}</p>
                <p><strong>Handled By:</strong> {selectedRequest.handledByName || 'Unassigned'}</p>
                <p><strong>Created By:</strong> {selectedRequest.createdByName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
