import { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { getAuthState } from '../../store/authStore';

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categoryDetails: { [key: string]: string[] } = {
    'Hardware & Connectivity Support': [
      'Network or internet connectivity issues',
      'Firewall or proxy configuration problems',
      'Hardware or device procurement requests',
      'Server access and configuration support'
    ],
    'Application Development Support': [
      'Application or code-related issues in development environments',
      'Deployment on development',
      'Setup and configuration of dev or test environments',
      'Access requests for development servers, systems, or repositories'
    ],
    'Production Operations Support': [
      'Issues affecting production applications or servers',
      'Setup or configuration of production environments',
      'Migration or upgrade of existing production systems',
      'Monitoring and troubleshooting live systems'
    ]
  };

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('Hardware') || name.includes('Connectivity')) return '💻';
    if (name.includes('Application') || name.includes('Development')) return '📱';
    if (name.includes('Production') || name.includes('Operations')) return '🖥️';
    return '📋';
  };

  return (
    <UserLayout>
      <div className="categories-page">
        <div className="categories-header">
          <h1>Service Request Categories</h1>
          <p className="categories-subtitle">
            Understand the types of support available to ensure your request is routed correctly.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>No categories found.</div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card" onClick={() => setSelectedCategory(category)}>
                <div className="category-icon">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>
        )}

        {selectedCategory && (
          <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCategory.name}</h2>
                <button className="close-btn" onClick={() => setSelectedCategory(null)}>×</button>
              </div>
              <div className="modal-content">
                <h3 style={{ marginTop: 0, color: '#465463' }}>Description</h3>
                <p style={{ color: '#6b7a86', lineHeight: '1.6', fontSize: '1rem' }}>
                  {selectedCategory.description}
                </p>
                {categoryDetails[selectedCategory.name] && (
                  <>
                    <h3 style={{ color: '#465463', marginTop: '1.5rem' }}>Scope of Support</h3>
                    <ul style={{ color: '#6b7a86', lineHeight: '1.8' }}>
                      {categoryDetails[selectedCategory.name].map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}



