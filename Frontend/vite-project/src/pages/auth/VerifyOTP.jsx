import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState({ error: '', success: '', loading: false });
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Redirect to register if no email was provided
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Allow only digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setStatus({ error: 'Please enter the complete 6-digit OTP code.', success: '', loading: false });
      return;
    }

    setStatus({ error: '', success: '', loading: true });

    try {
      await verifyOTP(email, otpCode);
      setStatus({ error: '', success: 'Email verified successfully! Redirecting...', loading: false });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setStatus({
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Verification failed. Please try again.',
        success: '',
        loading: false,
      });
      // Clear OTP inputs on failure
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setStatus({ error: '', success: '', loading: true });
      await authService.resendOTP(email);
      setStatus({ error: '', success: 'A new verification code has been sent to your email.', loading: false });
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      setStatus({
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to resend OTP.',
        success: '',
        loading: false,
      });
    }
  };

  const { error, success, loading } = status;

  return (
    <div className="flex-center" style={{ width: '100%' }}>
      <div className="card auth-card">
        <div className="auth-header">
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            ✉️
          </div>
          <h2 className="auth-title">Verify Your Email</h2>
          <p className="auth-subtitle">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px', marginTop: '4px' }}>
            {email}
          </p>
        </div>

        {error && (
          <div className="auth-alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                autoFocus={index === 0}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  border: '2px solid var(--color-border)',
                  borderRadius: '10px',
                  background: 'var(--color-bg-input, var(--color-surface))',
                  color: 'var(--color-text-main)',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: '4px', padding: '14px' }}
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? 'var(--color-text-muted)' : 'var(--color-primary)',
              cursor: resendCooldown > 0 ? 'default' : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              padding: '4px 8px',
              textDecoration: resendCooldown > 0 ? 'none' : 'underline',
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </button>
        </div>

        <p className="auth-prompt">
          Go back to{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
