import { useState, useEffect } from 'react';
import ITStaffLayout from '../../layouts/ITStaffLayout';
import { getAuthState } from '../../store/authStore';

export default function ITRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = getAuthState().token;
      const email = getAuthState().user?.email;
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`http://localhost:8080/requests/itstaff/${encodeURIComponent(email || '')}`, { headers });
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

  const handleCloseRequest = async () => {
    if (!selectedRequest) return;
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`http://localhost:8080/requests/${selectedRequest.id}/close`, {
        method: 'PUT',
        headers,
      });
      
      if (res.ok) {
        setShowDetailModal(false);
        fetchRequests();
      } else {
        const error = await res.json();
        alert('Failed to close request: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to close request:', err);
      alert('Failed to close request');
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    if (!window.confirm('Are you sure you want to delete this closed request? This action cannot be undone.')) return;
    
    try {
      const token = getAuthState().token;
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch(`http://localhost:8080/requests/${selectedRequest.id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (res.ok) {
        setShowDetailModal(false);
        fetchRequests();
        alert('Request deleted successfully!');
      } else {
        const error = await res.json();
        alert('Failed to delete request: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to delete request:', err);
      alert('Failed to delete request');
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
    <ITStaffLayout>
      <div className="admin-users-page">
        <header className="page-header">
          <div>
            <h1>Assigned Service Requests</h1>
          </div>
        </header>

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
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem', fontSize: '1.1rem' }}>No requests assigned to you yet.</p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>No requests found matching your filters.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>CREATED BY</th>
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
                  <td>{request.createdByName || 'Unknown'}</td>
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
                <p><strong>Created By:</strong> {selectedRequest.createdByName}</p>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>Cancel</button>
                {getStatusString(selectedRequest.status) === 'Open' && (
                  <button className="btn-primary" onClick={handleCloseRequest}>Close Request</button>
                )}
                {getStatusString(selectedRequest.status) === 'Closed' && (
                  <button className="btn-danger" onClick={handleDeleteRequest}>Delete Request</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ITStaffLayout>
  );
}
