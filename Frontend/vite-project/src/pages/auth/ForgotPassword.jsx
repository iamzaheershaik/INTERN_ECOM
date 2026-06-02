import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
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
            Enter your email to receive a 6-digit recovery OTP
          </p>
        </div>

        {error && (
          <div className="auth-alert-danger">
            {error}
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="auth-alert-success" style={{ textAlign: 'center', padding: '24px 16px' }}>
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
                  margin: '0 auto 16px auto',
                }}
              >
                📧
              </div>
              <h4 className="auth-alert-title" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                Recovery OTP Sent!
              </h4>
              <p className="auth-alert-desc" style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                If an account exists for <strong>{email}</strong>, a 6-digit recovery code has been sent to reset your password.
              </p>
              <div className="auth-alert-token" style={{ marginTop: '16px', fontSize: '13px', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                Check your inbox (and spam folder) for the 6-digit recovery code.
              </div>
            </div>

            <button type="button" onClick={() => navigate('/reset-password', { state: { email } })} className="btn-primary" style={{ padding: '14px', textAlign: 'center' }}>
              Proceed to Reset Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
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
              {loading ? 'Sending OTP...' : 'Send Recovery OTP'}
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
