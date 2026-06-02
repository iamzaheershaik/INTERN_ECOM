import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ width: '100%' }}>
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Recover Password</h2>
          <p className="auth-subtitle">
            Get a temporary token to reset your password
          </p>
        </div>

        {error && (
          <div className="auth-alert-danger">
            {error}
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="auth-alert-success">
              <h4 className="auth-alert-title">
                📧 Simulation Triggered!
              </h4>
              <p className="auth-alert-desc">
                A password reset token has been successfully generated and logged in your <strong>Backend Server Terminal</strong>.
              </p>
              <div className="auth-alert-token">
                Check terminal console for:
                <br />
                "📧 PASSWORD RESET TOKEN for {email}..."
              </div>
            </div>

            <Link to="/reset-password" className="btn-primary" style={{ padding: '14px', textAlign: 'center' }}>
              Proceed to Reset Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '8px', padding: '14px' }}
              disabled={loading}
            >
              {loading ? 'Generating Token...' : 'Send Recovery Token'}
            </button>
          </form>
        )}

        <p className="auth-prompt">
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
