import React from 'react';
import { RoleType, AccountStatus, PermissionReach, ActionType } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'indigo'
    | 'cyan'
    | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    cyan: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    outline: 'bg-white text-slate-600 border border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: RoleType; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  switch (role) {
    case 'Enterprise Admin':
      return (
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Enterprise Admin
        </Badge>
      );
    case 'Consultant':
      return (
        <Badge variant="purple" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Consultant
        </Badge>
      );
    case 'Data Protection Officer':
      return (
        <Badge variant="indigo" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          DPO
        </Badge>
      );
    case 'Program Owner':
      return (
        <Badge variant="primary" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Program Owner
        </Badge>
      );
    case 'Department Owner':
      return (
        <Badge variant="cyan" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
          Dept Owner
        </Badge>
      );
    case 'Department POC':
      return (
        <Badge variant="cyan" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          Dept POC
        </Badge>
      );
    case 'Customer':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Customer
        </Badge>
      );
    case 'User':
    default:
      return (
        <Badge variant="default" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          User
        </Badge>
      );
  }
};

export const StatusBadge: React.FC<{ status: AccountStatus | string; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'Active':
      return (
        <Badge variant="success" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Active
        </Badge>
      );
    case 'Suspended':
      return (
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Suspended
        </Badge>
      );
    case 'Waiting for approval':
    case 'Pending':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {status}
        </Badge>
      );
    case 'Accepted':
      return (
        <Badge variant="success" size={size}>
          Accepted
        </Badge>
      );
    case 'Expired':
    case 'Revoked':
      return (
        <Badge variant="default" size={size}>
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="default" size={size}>
          {status}
        </Badge>
      );
  }
};

export const ReachBadge: React.FC<{ reach: PermissionReach }> = ({ reach }) => {
  switch (reach) {
    case 'Everywhere':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Everywhere
        </span>
      );
    case 'Own company':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Own Company
        </span>
      );
    case 'Own department':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Own Dept
        </span>
      );
    case 'Can open only':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-slate-100 text-slate-500 border border-slate-200">
          Can Open Only
        </span>
      );
  }
};

