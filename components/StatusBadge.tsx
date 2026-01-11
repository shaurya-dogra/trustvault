
import React from 'react';

type Status = 'pending' | 'funded' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'disputed' | 'paid' | 'active' | 'completed' | 'draft' | 'invited' | 'rejected';

const STATUS_CONFIG: Record<Status, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  pending: "bg-purple-50 text-purple-700 border-purple-200", // Freelancer sent to Client (Needs Client Approval)
  invited: "bg-blue-50 text-blue-700 border-blue-200", // Client sent to Freelancer (Needs Freelancer Acceptance)
  rejected: "bg-gray-100 text-gray-500 border-gray-200 decoration-slate-400 line-through",
  funded: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200", // Money in Escrow, Work Pending
  in_progress: "bg-blue-50 text-blue-700 border-blue-200", // Work started
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200", // Contract Active
  submitted: "bg-amber-50 text-amber-700 border-amber-200", // Evidence Uploaded
  under_review: "bg-purple-50 text-purple-700 border-purple-200", 
  approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  disputed: "bg-red-50 text-red-700 border-red-200",
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalizedStatus = status.toLowerCase() as Status;
  const classes = STATUS_CONFIG[normalizedStatus] || "bg-gray-100 text-gray-800";
  
  let label = status.replace('_', ' ');
  
  // Custom label overrides for clarity
  switch (normalizedStatus) {
      case 'funded':
          label = 'Escrow Funded'; // Clearer than "Locked"
          break;
      case 'active':
          label = 'Active Contract';
          break;
      case 'under_review':
          label = 'Auto-Reviewing';
          break;
      case 'invited':
          label = 'Invitation Sent';
          break;
      case 'pending':
          label = 'Approval Needed';
          break;
      case 'in_progress':
          label = 'Work In Progress';
          break;
      case 'submitted':
          label = 'Evidence Submitted';
          break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes} capitalize whitespace-nowrap shadow-sm`}>
      {label}
    </span>
  );
};
