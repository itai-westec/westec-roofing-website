import {readMeta,writeMeta} from '@/crm/lib/salesFlow';
import { createServerFn } from '@/server/platform/server-fn';
import { z } from 'zod/v4';
import { NewLeadsBoard, WonJobsCollectionsBoard } from '@/server/platform/BoardSDK';
import { milestoneText } from '@generated/lib/milestones';

// Mirrors the board groups: each lead stage = board group + default status.
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
type StageKey = (typeof LEAD_STAGES)[number]['key'];
const stageKeys = LEAD_STAGES.map((s) => s.key) as [StageKey, ...StageKey[]];

export const moveLeadStage = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), stage: z.enum(stageKeys) }))
  .handler(async ({ data }) => {
    if(['presented','signature'].includes(data.stage))throw Error('Use the estimate options to mark presented or send for signature.');
    const s = LEAD_STAGES.find((x) => x.key === data.stage)!;
    const board = new NewLeadsBoard();
    const before=await board.item(data.id).withColumns(['notes']).execute();await board.item(data.id).update({ status:s.status, notes:writeMeta(before.notes,'lead',{...readMeta(before.notes,'lead'),stage:undefined}) } as never).execute();
    await board.item(data.id).update().inGroup(s.group).execute();
    return { ok: true };
  });

const WON_GROUPS = ['group_mm7mj3df', 'group_mm7my8xk'];
const PRE_WON_GROUPS = ['group_mm7mpqv6', 'group_mm7mmkr7', 'group_mm7m2haj'];

export const markLeadWon = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), name: z.string(), projectName: z.string().optional(), contractAmount: z.number().nullable().optional() }))
  .handler(async ({ data }) => {
    const leads = new NewLeadsBoard();
    const jobs = new WonJobsCollectionsBoard();
    const {allEstimates,forLead}=await import('@/server/sales-flow');const options=forLead(await allEstimates(),data.id).filter(e=>e.status!=='Declined');const l=await leads.item(data.id).withColumns(['notes']).execute();const selected=readMeta(l.notes,'lead').selectedId;if(options.length){const target=options.find(e=>e.id===selected)??(options.length===1?options[0]:null);if(!target)throw Error('Select the final estimate option before marking this lead won.');const {acceptAndHandoff}=await import('./handoff.server');await acceptAndHandoff(target.id);return {ok:true};}
    await leads.item(data.id).update({ status: 'Needs Scheduling' } as never).execute();
    await leads.item(data.id).update().inGroup('group_mm7mj3df').execute();
    await jobs.item().create({
      name: data.name,
      projectName: data.projectName ?? data.name,
      contractAmount: data.contractAmount ?? null,
      amountCollected: 0,
      collectionStatus: 'Deposit Pending',
      jobStatus: 'Scheduled',
      billingNotes: [milestoneText(data.contractAmount ?? 0, false), `Lead #${data.id}`].join('\n'),
    } as never).inGroup('group_mm7mzsb3').execute();
    return { ok: true };
  });

export const scheduleLead = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), when: z.string(), kind: z.enum(['appointment', 'work']) }))
  .handler(async ({ data }) => {
    const board = new NewLeadsBoard();
    const lead = await board.item(data.id).withColumns(['status','notes']).execute();
    const g = (lead as { group?: { id?: string } } | null)?.group?.id ?? '';
    const won = WON_GROUPS.includes(g) || ['Won', 'Needs Scheduling', 'Scheduled'].includes(String(lead?.status ?? ''));
    if (data.kind === 'work' && !won) throw new Error('Mark this lead as won before scheduling work.');
    if (data.kind === 'appointment' && won) throw new Error('This lead is already won — schedule work instead.');
    const s = LEAD_STAGES.find((x) => x.key === (data.kind === 'work' ? 'work' : 'appointments'))!;
    await board.item(data.id).update({ scheduledDateTime: new Date(data.when), status: s.status, notes:writeMeta(lead.notes,'lead',{...readMeta(lead.notes,'lead'),stage:undefined}) } as never).execute();
    await board.item(data.id).update().inGroup(s.group).execute();
    const synced = false;
    return { ok: true, synced };
  });

export const startJob = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await new WonJobsCollectionsBoard().item(data.id).update({ jobStatus: 'In Progress' } as never).execute();
    return { ok: true };
  });

export const completeJob = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const board = new WonJobsCollectionsBoard();
    await board.item(data.id).update({ jobStatus: 'Job Completed', collectionStatus: 'Invoiced', invoiceDate: new Date() } as never).execute();
    await board.item(data.id).update().inGroup('group_mm7md2x5').execute();
    return { ok: true };
  });

export const getCalendar = createServerFn({ method: 'GET' })
  .validator(z.object({ from: z.string(), to: z.string() }))
  .handler(async ({ data }) => {
    const leads = new NewLeadsBoard();
    const jobs = new WonJobsCollectionsBoard();
    const range = [data.from, data.to];
    const [appts, follows, dues] = await Promise.all([
      leads.items().withColumns(['scheduledDateTime', 'status', 'homeAddress', 'serviceType']).where({ scheduledDateTime: range } as never).withPagination({ limit: 100 }).execute(),
      leads.items().withColumns(['nextFollowup', 'status']).where({ nextFollowup: range } as never).withPagination({ limit: 100 }).execute(),
      jobs.items().withColumns(['paymentDueDate', 'collectionStatus', 'contractAmount', 'amountCollected']).where({ paymentDueDate: range } as never).withPagination({ limit: 100 }).execute(),
    ]);
    return { appts: appts?.items ?? [], follows: follows?.items ?? [], dues: dues?.items ?? [] };
  });

export const searchOpenLeads = createServerFn({ method: 'GET' })
  .validator(z.object({ search: z.string().optional(), kind: z.enum(['appointment', 'work']) }))
  .handler(async ({ data }) => {
    const board = new NewLeadsBoard();
    const where: Record<string, unknown> = { group: data.kind === 'work' ? WON_GROUPS : PRE_WON_GROUPS };
    if (data.search?.trim()) where.name = { contains: data.search.trim() };
    return board.items().withColumns(['status', 'homeAddress']).where(where as never)
      .orderBy({ column: 'createdAt', direction: 'desc' }).withPagination({ limit: 10 }).execute();
  });
