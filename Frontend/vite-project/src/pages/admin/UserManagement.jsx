import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { Shield, ShieldAlert, Trash2, UserCheck, UserMinus } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { user: currentUser } = useAuth(); // logged-in admin

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      if (response?.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users list:', err);
      setError('Failed to retrieve user accounts sheet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    setError('');
    setSuccessMsg('');

    if (userId === currentUser.id || userId === currentUser._id) {
      setError('You are not allowed to change your own role.');
      return;
    }

    const targetRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      const response = await adminService.updateUserRole(userId, targetRole);
      if (response?.success) {
        setSuccessMsg(`Account promoted/demoted successfully.`);
        fetchUsers();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error updating role.');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    setError('');
    setSuccessMsg('');

    if (userId === currentUser.id || userId === currentUser._id) {
      setError('You are not allowed to toggle your own activity state.');
      return;
    }

    try {
      await adminService.updateUser(userId, { isActive: !currentStatus });
      setSuccessMsg('Account active status toggled successfully.');
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update account activity state.');
    }
  };

  const handleDeleteUser = async (userId) => {
    setError('');
    setSuccessMsg('');

    if (userId === currentUser.id || userId === currentUser._id) {
      setError('You are not allowed to delete your own account.');
      return;
    }

    if (!window.confirm('Are you absolutely sure you want to permanently delete this user from the database? This action is irreversible.')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setSuccessMsg('User deleted from database successfully.');
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete user.');
    }
  };

  return (
    <div>
      {/* Title Header */}
      <div className="admin-dashboard-container">
        <div>
          <h1 className="admin-header-title">System Accounts</h1>
          <p className="admin-header-desc">
            Promote accounts to admin role, demote admins, or deactivate offending accounts.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Main accounts table sheet */}
      <div className="card admin-recent-orders-card">
        {loading ? (
          <div className="flex-center" style={{ padding: '64px 0', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading system accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
            No registered users logged in the database.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr className="admin-table-header-row">
                  <th className="admin-table-cell">USER</th>
                  <th className="admin-table-cell">ROLE</th>
                  <th className="admin-table-cell">STATUS</th>
                  <th className="admin-table-cell">PHONE</th>
                  <th className="admin-table-cell">JOIN DATE</th>
                  <th className="admin-table-cell" style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  const isSelf = item._id === currentUser.id || item._id === currentUser._id;
                  const joinDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={item._id} className="admin-table-body-row">
                      {/* Name & Email Avatar */}
                      <td className="admin-table-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          className="profile-avatar-circle flex-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '14px',
                            margin: 0,
                            background: item.role === 'admin' ? 'var(--color-bg-alt)' : '#e9d5ff',
                            color: item.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          }}
                        >
                          {item.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--color-text-main)' }}>
                            {item.firstName} {item.lastName} {isSelf && <span style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600 }}>(You)</span>}
                          </strong>
                          <span className="admin-table-cell-muted" style={{ display: 'block', marginTop: '2px' }}>
                            {item.email}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="admin-table-cell">
                        <span
                          style={{
                            background: item.role === 'admin' ? '#ede9fe' : 'transparent',
                            color: item.role === 'admin' ? 'var(--color-primary)' : 'inherit',
                            padding: item.role === 'admin' ? '4px 8px' : 0,
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.role}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="admin-table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.isActive ? 'var(--color-success)' : 'var(--color-danger)' }}></div>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>
                            {item.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="admin-table-cell" style={{ color: 'var(--color-text-muted)' }}>
                        {item.phone || 'N/A'}
                      </td>

                      {/* Join Date */}
                      <td className="admin-table-cell" style={{ color: 'var(--color-text-muted)' }}>
                        {joinDate}
                      </td>

                      {/* Actions */}
                      <td className="admin-table-cell" style={{ textAlign: 'right' }}>
                        <div className="admin-table-cell-actions">
                          {/* Role Toggle Trigger */}
                          <button
                            onClick={() => handleRoleToggle(item._id, item.role)}
                            disabled={isSelf}
                            title={item.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            className="admin-cell-action-btn flex-center"
                            style={{
                              color: item.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              opacity: isSelf ? 0.3 : 1,
                            }}
                          >
                            {item.role === 'admin' ? <Shield size={16} /> : <ShieldAlert size={16} />}
                          </button>

                          {/* Status Toggle Trigger */}
                          <button
                            onClick={() => handleStatusToggle(item._id, item.isActive)}
                            disabled={isSelf}
                            title={item.isActive ? 'Deactivate Account' : 'Activate Account'}
                            className="admin-cell-action-btn flex-center"
                            style={{
                              color: item.isActive ? 'var(--color-success)' : 'var(--color-danger)',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              opacity: isSelf ? 0.3 : 1,
                            }}
                          >
                            {item.isActive ? <UserMinus size={16} /> : <UserCheck size={16} />}
                          </button>

                          {/* Permanently Delete User */}
                          <button
                            onClick={() => handleDeleteUser(item._id)}
                            disabled={isSelf}
                            title="Delete User permanently"
                            className="admin-cell-delete-btn flex-center"
                            style={{
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              opacity: isSelf ? 0.3 : 1,
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
