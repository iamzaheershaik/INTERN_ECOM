import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({ firstName, lastName, phone });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary)', padding: '8px', borderRadius: '8px' }} className="flex-center">
          <User size={24} />
        </div>
        <h1 style={{ fontSize: '32px', margin: 0 }}>My Profile Settings</h1>
      </div>

      <div className="profile-grid-layout">
        {/* Left Card - Summary info */}
        <div className="card profile-summary-card">
          <div className="profile-avatar-circle flex-center">
            {user?.firstName?.[0] || 'U'}
          </div>
          <h2 className="profile-summary-name">
            {user?.firstName} {user?.lastName}
          </h2>
          <span className="profile-summary-email">
            {user?.email}
          </span>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '20px' }} />

          <div className="profile-meta-list-group">
            <div className="profile-meta-item-row">
              <ShieldCheck size={18} style={{ color: 'var(--color-success)' }} />
              <span className="profile-meta-label-text">
                Role: <span className="profile-meta-value-text">{user?.role}</span>
              </span>
            </div>
            <div className="profile-meta-item-row" style={{ color: 'var(--color-text-muted)' }}>
              <Mail size={18} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="profile-meta-item-row" style={{ color: 'var(--color-text-muted)' }}>
                <Phone size={18} />
                <span>{user?.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Card - Form inputs */}
        <div className="card profile-edit-card">
          <h3 className="profile-edit-title">Update Details</h3>

          {error && (
            <div className="auth-alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', fontWeight: 500 }} className="flex-center">
              <CheckCircle size={16} style={{ marginRight: '6px' }} />
              <span>Your profile settings have been successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--color-text-muted)' }}>
                Email Address (Read-only)
              </label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                readOnly
                style={{ background: 'var(--color-bg-main)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '8px', padding: '12px 24px', alignSelf: 'flex-start' }}
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
