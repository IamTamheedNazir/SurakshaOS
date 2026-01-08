import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminRoleManagement.css';

const AdminRoleManagement = () => {
  const [activeTab, setActiveTab] = useState('roles');

  // Predefined roles with permissions
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access with all permissions',
      color: '#ef4444',
      isSystem: true,
      userCount: 2,
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        vendors: { view: true, create: true, edit: true, delete: true },
        packages: { view: true, create: true, edit: true, delete: true },
        bookings: { view: true, create: true, edit: true, delete: true },
        payments: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
        support: { view: true, create: true, edit: true, delete: true },
      },
    },
    {
      id: 2,
      name: 'Admin',
      slug: 'admin',
      description: 'Administrative access with most permissions',
      color: '#f59e0b',
      isSystem: true,
      userCount: 5,
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: false },
        users: { view: true, create: true, edit: true, delete: false },
        vendors: { view: true, create: true, edit: true, delete: false },
        packages: { view: true, create: true, edit: true, delete: true },
        bookings: { view: true, create: true, edit: true, delete: false },
        payments: { view: true, create: false, edit: true, delete: false },
        reports: { view: true, create: true, edit: false, delete: false },
        settings: { view: true, create: false, edit: true, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
        support: { view: true, create: true, edit: true, delete: true },
      },
    },
    {
      id: 3,
      name: 'Sales Manager',
      slug: 'sales_manager',
      description: 'Manage bookings, customers, and sales operations',
      color: '#10b981',
      isSystem: false,
      userCount: 8,
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        users: { view: true, create: true, edit: true, delete: false },
        vendors: { view: true, create: false, edit: true, delete: false },
        packages: { view: true, create: true, edit: true, delete: false },
        bookings: { view: true, create: true, edit: true, delete: false },
        payments: { view: true, create: false, edit: false, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        support: { view: true, create: true, edit: true, delete: false },
      },
    },
    {
      id: 4,
      name: 'Support Agent',
      slug: 'support_agent',
      description: 'Handle customer support and tickets',
      color: '#3b82f6',
      isSystem: false,
      userCount: 12,
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        users: { view: true, create: false, edit: false, delete: false },
        vendors: { view: true, create: false, edit: false, delete: false },
        packages: { view: true, create: false, edit: false, delete: false },
        bookings: { view: true, create: false, edit: true, delete: false },
        payments: { view: true, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        support: { view: true, create: true, edit: true, delete: false },
      },
    },
    {
      id: 5,
      name: 'Accountant',
      slug: 'accountant',
      description: 'Manage payments, invoices, and financial reports',
      color: '#8b5cf6',
      isSystem: false,
      userCount: 3,
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        users: { view: true, create: false, edit: false, delete: false },
        vendors: { view: true, create: false, edit: false, delete: false },
        packages: { view: true, create: false, edit: false, delete: false },
        bookings: { view: true, create: false, edit: false, delete: false },
        payments: { view: true, create: true, edit: true, delete: false },
        reports: { view: true, create: true, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        support: { view: true, create: false, edit: false, delete: false },
      },
    },
  ]);

  // Team members
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@umrahconnect.com',
      role: 'Super Admin',
      roleId: 1,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
      status: 'active',
      lastLogin: '2026-01-08 14:30',
      joinedDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Sarah Ahmed',
      email: 'sarah@umrahconnect.com',
      role: 'Admin',
      roleId: 2,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Ahmed',
      status: 'active',
      lastLogin: '2026-01-08 12:15',
      joinedDate: '2025-02-20',
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      email: 'mohammed@umrahconnect.com',
      role: 'Sales Manager',
      roleId: 3,
      avatar: 'https://ui-avatars.com/api/?name=Mohammed+Ali',
      status: 'active',
      lastLogin: '2026-01-08 10:45',
      joinedDate: '2025-03-10',
    },
  ]);

  const permissionModules = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'vendors', label: 'Vendors', icon: '🏢' },
    { key: 'packages', label: 'Packages', icon: '📦' },
    { key: 'bookings', label: 'Bookings', icon: '📋' },
    { key: 'payments', label: 'Payments', icon: '💰' },
    { key: 'reports', label: 'Reports', icon: '📈' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'roles', label: 'Roles', icon: '🔐' },
    { key: 'support', label: 'Support', icon: '🎫' },
  ];

  const handleCreateRole = () => {
    toast.info('Create role modal will open');
  };

  const handleEditRole = (roleId) => {
    toast.info(`Edit role ${roleId}`);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId));
      toast.success('Role deleted successfully');
    }
  };

  const handleInviteMember = () => {
    toast.info('Invite member modal will open');
  };

  const handleUpdateMemberRole = (memberId, newRoleId) => {
    setTeamMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? { ...m, roleId: newRoleId, role: roles.find(r => r.id === newRoleId)?.name }
          : m
      )
    );
    toast.success('Member role updated');
  };

  const handleToggleMemberStatus = (memberId) => {
    setTeamMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
          : m
      )
    );
    toast.success('Member status updated');
  };

  return (
    <div className="admin-role-management-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">🔐 Role & Access Management</h1>
            <div className="breadcrumb">
              <Link to="/admin/dashboard">Dashboard</Link>
              <span>›</span>
              <Link to="/admin/settings">Settings</Link>
              <span>›</span>
              <span>Roles & Permissions</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleInviteMember}>
              <span>📧</span>
              Invite Member
            </button>
            <button className="btn btn-primary" onClick={handleCreateRole}>
              <span>➕</span>
              Create Role
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="role-stats-grid">
          <div className="role-stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <div className="stat-value">{roles.length}</div>
              <div className="stat-label">Total Roles</div>
            </div>
          </div>
          <div className="role-stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{teamMembers.length}</div>
              <div className="stat-label">Team Members</div>
            </div>
          </div>
          <div className="role-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{teamMembers.filter(m => m.status === 'active').length}</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="role-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{permissionModules.length}</div>
              <div className="stat-label">Permission Modules</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="role-tabs">
          <button
            className={`role-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <span>🔐</span>
            Roles & Permissions
          </button>
          <button
            className={`role-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <span>👥</span>
            Team Members
          </button>
          <button
            className={`role-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <span>📊</span>
            Activity Log
          </button>
        </div>

        {/* Tab Content */}
        <div className="role-content">
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="roles-section">
              <div className="roles-grid">
                {roles.map((role) => (
                  <div key={role.id} className="role-card">
                    <div className="role-card-header">
                      <div className="role-badge" style={{ backgroundColor: role.color }}>
                        {role.name}
                      </div>
                      {role.isSystem && (
                        <span className="system-badge">System Role</span>
                      )}
                    </div>
                    <p className="role-description">{role.description}</p>
                    <div className="role-stats">
                      <span className="role-stat">
                        <span className="stat-icon">👥</span>
                        {role.userCount} users
                      </span>
                    </div>

                    <div className="permissions-preview">
                      <h4>Permissions:</h4>
                      <div className="permissions-grid">
                        {permissionModules.map((module) => {
                          const perms = role.permissions[module.key];
                          const hasAnyPerm = perms && (perms.view || perms.create || perms.edit || perms.delete);
                          return (
                            <div
                              key={module.key}
                              className={`permission-item ${hasAnyPerm ? 'has-permission' : 'no-permission'}`}
                            >
                              <span className="module-icon">{module.icon}</span>
                              <span className="module-name">{module.label}</span>
                              {hasAnyPerm && (
                                <div className="permission-actions">
                                  {perms.view && <span className="perm-badge">V</span>}
                                  {perms.create && <span className="perm-badge">C</span>}
                                  {perms.edit && <span className="perm-badge">E</span>}
                                  {perms.delete && <span className="perm-badge">D</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="role-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditRole(role.id)}
                      >
                        <span>✏️</span> Edit
                      </button>
                      {!role.isSystem && (
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <span>🗑️</span> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="team-section">
              <div className="team-table-container">
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Joined Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-info">
                            <img src={member.avatar} alt={member.name} className="member-avatar" />
                            <div>
                              <strong>{member.name}</strong>
                              <p>{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                            className="role-select"
                            value={member.roleId}
                            onChange={(e) => handleUpdateMemberRole(member.id, parseInt(e.target.value))}
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={member.status === 'active'}
                              onChange={() => handleToggleMemberStatus(member.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className={`status-text ${member.status}`}>
                            {member.status}
                          </span>
                        </td>
                        <td>{member.lastLogin}</td>
                        <td>{member.joinedDate}</td>
                        <td>
                          <div className="table-actions">
                            <button className="table-action-btn" title="View">👁️</button>
                            <button className="table-action-btn" title="Edit">✏️</button>
                            <button className="table-action-btn" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="activity-section">
              <div className="activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <strong>John Doe</strong> updated role permissions for <strong>Sales Manager</strong>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">➕</div>
                  <div className="activity-content">
                    <strong>Sarah Ahmed</strong> invited new member <strong>Ali Khan</strong>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🔐</div>
                  <div className="activity-content">
                    <strong>John Doe</strong> created new role <strong>Content Manager</strong>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoleManagement;
