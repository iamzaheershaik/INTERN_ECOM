import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token.trim(), newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Reset failed. Token might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ width: '100%' }}>
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">
            Enter the token from your console logs to reset
          </p>
        </div>

        {error && (
          <div className="auth-alert-danger">
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#dcfce7',
                color: 'var(--color-success)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <h3 style={{ color: 'var(--color-text-main)', marginBottom: '8px' }}>Password Reset!</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Your password has been successfully updated. Redirecting you to the sign-in page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Reset Token
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste token from server logs"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {!success && (
          <p className="auth-prompt">
            Go back to <Link to="/login" style={{ fontWeight: 600 }}>Login</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
