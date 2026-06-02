import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryToken = searchParams.get('token') || '';
  const emailFromState = location.state?.email || '';

  // Group multiple state hooks into a single unified state object
  const [state, setState] = useState({
    token: queryToken,
    newPassword: '',
    confirmPassword: '',
    success: false,
    error: '',
    loading: false,
  });

  const { token, newPassword, confirmPassword, success, error, loading } = state;

  const navigate = useNavigate();

  useEffect(() => {
    if (queryToken) {
      setState((prev) => ({ ...prev, token: queryToken }));
    }
  }, [queryToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: '' }));

    if (newPassword.length < 8) {
      setState((prev) => ({ ...prev, error: 'Password must be at least 8 characters long.' }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setState((prev) => ({ ...prev, error: 'Passwords do not match.' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      await authService.resetPassword(token.trim(), newPassword);
      setState((prev) => ({ ...prev, success: true, loading: false }));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Reset failed. Token might be invalid or expired.',
        loading: false,
      }));
    }
  };

  return (
    <div className="flex-center" style={{ width: '100%' }}>
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">
            Enter the 6-digit recovery OTP from your email
          </p>
          {emailFromState && (
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px', marginTop: '4px' }}>
              {emailFromState}
            </p>
          )}
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
              <label htmlFor="token" className="form-label">
                6-Digit Recovery OTP
              </label>
              <input
                id="token"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="form-input"
                placeholder="Enter 6-digit code"
                value={token}
                onChange={(e) => setState((prev) => ({ ...prev, token: e.target.value }))}
                required
                disabled={loading}
                style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '18px', textAlign: 'center' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setState((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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
