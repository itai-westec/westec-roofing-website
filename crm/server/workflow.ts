import { rpc } from '@/lib/rpc';
export const LEAD_STAGES = [
  { key: 'incoming', label: 'Incoming Leads', group: 'group_mm7mpqv6', status: 'New Lead' },
  { key: 'appointments', label: 'Scheduled Appointments', group: 'group_mm7m2haj', status: 'Site Visit Scheduled' },
  { key: 'estimating', label: 'Active & Estimating', group: 'group_mm7mmkr7', status: 'Contacted' },
  { key: 'presented', label: 'Options Presented', group: 'virtual_presented', status: 'Estimate Sent' },
  { key: 'signature', label: 'Awaiting Signature', group: 'virtual_signature', status: 'Estimate Sent' },
  { key: 'won', label: 'Closed Won', group: 'group_mm7mj3df', status: 'Needs Scheduling' },
  { key: 'work', label: 'Scheduled Work', group: 'group_mm7my8xk', status: 'Scheduled' },
  { key: 'lost', label: 'Closed Lost', group: 'group_mm7me4zq', status: 'Lost' },
] as const;
export const JOB_STAGES = [
  { key: 'progress', label: 'In Progress & Deposit', group: 'group_mm7mzsb3' },
  { key: 'invoiced', label: 'Completed & Invoiced', group: 'group_mm7md2x5' },
  { key: 'collected', label: 'Fully Collected', group: 'group_mm7myfjj' },
] as const;
export const moveLeadStage: typeof import('@/server/generated/workflow').moveLeadStage = (args?: any) => rpc('workflow.moveLeadStage', args);
export const markLeadWon: typeof import('@/server/generated/workflow').markLeadWon = (args?: any) => rpc('workflow.markLeadWon', args);
export const scheduleLead: typeof import('@/server/generated/workflow').scheduleLead = (args?: any) => rpc('workflow.scheduleLead', args);
export const startJob: typeof import('@/server/generated/workflow').startJob = (args?: any) => rpc('workflow.startJob', args);
export const completeJob: typeof import('@/server/generated/workflow').completeJob = (args?: any) => rpc('workflow.completeJob', args);
export const getCalendar: typeof import('@/server/generated/workflow').getCalendar = (args?: any) => rpc('workflow.getCalendar', args);
export const searchOpenLeads: typeof import('@/server/generated/workflow').searchOpenLeads = (args?: any) => rpc('workflow.searchOpenLeads', args);
