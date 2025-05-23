import React, { useState, useEffect } from 'react';
import { Star, Send, User, Lock, Eye, Trash2, BarChart3, MessageSquare } from 'lucide-react';
import './App.css'

const API_URL = 'http://localhost:5001/api';

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`star ${(hover || rating) >= star ? 'filled' : ''} ${readOnly ? 'readonly' : ''}`}
          onClick={() => !readOnly && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        />
      ))}
    </div>
  );
};

// Feedback Form Component
const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          rating: 5
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="feedback-header">
          <h1 className="feedback-title">
            <MessageSquare className="mr-3" />
            Share Your Feedback
          </h1>
          <p className="feedback-subtitle">We value your opinion and would love to hear from you!</p>
        </div>

        <div className="feedback-form">
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {message.text}
            </div>
          )}

          <div className="form-grid form-grid-cols">
            <div className="form-group">
              <label className="form-label">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="What's this feedback about?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Your Rating
            </label>
            <StarRating 
              rating={formData.rating} 
              onRatingChange={(rating) => setFormData({...formData, rating})}
            />
            <p className="rating-text">
              {formData.rating === 5 ? 'Excellent!' : 
               formData.rating === 4 ? 'Very Good' :
               formData.rating === 3 ? 'Good' :
               formData.rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="form-textarea"
              placeholder="Tell us about your experience..."
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in component state instead of localStorage
        onLogin(data.token);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Lock className="admin-login-icon" />
          <h2 className="admin-login-title">Admin Portal</h2>
          <p className="admin-login-subtitle">Enter your credentials to access the dashboard</p>
        </div>

        <div className="admin-login-form space-y-6">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Username
            </label>
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="admin-input"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="admin-input"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="credentials-info">
            <p>Default credentials:</p>
            <p>Username: <span className="credential-code">admin</span></p>
            <p>Password: <span className="credential-code">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ token, onLogout }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchFeedbacks = async (page = 1) => {
    try {
      const response = await fetch(`${API_URL}/admin/feedback?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedback);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFeedbacks(currentPage);
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFeedbacks(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-nav">
            <div className="dashboard-title-section">
              <BarChart3 className="dashboard-icon" />
              <h1 className="dashboard-title">Admin Dashboard</h1>
            </div>
            <button
              onClick={onLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-content">
              <MessageSquare className="stats-icon messages" />
              <div className="ml-4">
                <p className="stats-label">Total Feedback</p>
                <p className="stats-value">{stats.totalFeedback || 0}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-content">
              <Star className="stats-icon star" />
              <div className="ml-4">
                <p className="stats-label">Average Rating</p>
                <p className="stats-value">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-content">
              <Eye className="stats-icon eye" />
              <div className="ml-4">
                <p className="stats-label">This Page</p>
                <p className="stats-value">{pagination.currentPage || 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="feedback-table-container">
          <div className="table-header">
            <h2 className="table-title">Recent Feedback</h2>
          </div>

          <div className="table-wrapper">
            <table className="feedback-table">
              <thead className="table-head">
                <tr>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id} className="table-row">
                    <td>
                      <div className="user-info">
                        <div className="user-name">{feedback.name}</div>
                        <div className="user-email">{feedback.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="feedback-subject">{feedback.subject}</div>
                      <div className="feedback-message">{feedback.message}</div>
                    </td>
                    <td>
                      <StarRating rating={feedback.rating} readOnly />
                    </td>
                    <td className="feedback-date">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteFeedback(feedback._id)}
                        className="delete-btn"
                      >
                        <Trash2 className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('feedback');
  const [adminToken, setAdminToken] = useState(null);

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setCurrentView('feedback');
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-content">
          <div className="nav-inner">
            <div className="nav-brand">
              <MessageSquare className="brand-icon" />
              <span className="brand-text">FeedbackHub</span>
            </div>
            
            <div className="nav-buttons">
              <button
                onClick={() => setCurrentView('feedback')}
                className={`nav-btn ${
                  currentView === 'feedback'
                    ? 'active-feedback'
                    : 'inactive'
                }`}
              >
                Submit Feedback
              </button>
              
              {adminToken ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`nav-btn ${
                    currentView === 'admin'
                      ? 'active-admin'
                      : 'inactive inactive-admin'
                  }`}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('login')}
                  className={`nav-btn ${
                    currentView === 'login'
                      ? 'active-admin'
                      : 'inactive inactive-admin'
                  }`}
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'feedback' && <FeedbackForm />}
      {currentView === 'login' && !adminToken && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      {currentView === 'admin' && adminToken && (
        <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
      )}
    </div>
  );
};

export default App;