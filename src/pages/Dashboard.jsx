import { Activity, ArrowRight, ArrowUpRight, Building2, CheckCircle2, Clock3, Compass, Mail, Sparkles, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill, StatCard } from "../components/UI";

export default function Dashboard() {
  const { account, icp, prospects, outreach, activities } = usePrototype();
  const high = prospects.filter(p => p.score >= 70).length;
  const qualified = prospects.filter(p => p.score >= 70).length;
  const selectedOutreach = new Set(outreach.map(o => o.prospectId)).size;
  const due = prospects.filter(p => p.status.toLowerCase().includes("follow-up")).length;
  const contacted = prospects.filter(p => ["Contacted", "Interested", "Follow-up due", "Meeting requested", "Meeting booked"].includes(p.status) || String(p.status).toLowerCase().includes("follow-up")).length;
  const steps = [
    { label: "Define your ICP", detail: "Target the right companies and roles", done: true, to: "/icp-builder", icon: Target },
    { label: "Review priority prospects", detail: "Understand fit and available context", done: false, to: "/prospects", icon: Building2 },
    { label: "Approve outreach drafts", detail: "Review before any real sending", done: false, to: "/outreach", icon: Mail }
  ];
  return <div>
    <PageHeader eyebrow="FOUNDER WORKSPACE" title={`Welcome, ${account?.name?.trim() || "Founder"}.`} description="A clear view of who to focus on, why it matters, and what to do next." action={<Link className="button button-primary" to="/prospects"><Sparkles size={16} /> Explore prospects</Link>} />
    <div className="welcome-panel"><div className="welcome-content"><div className="welcome-chip"><Sparkles size={14} /> YOUR SALES INTELLIGENCE BRIEF</div><h2>Turn your ICP into your next best conversation.</h2><p>{icp?.name || "Primary ICP"} is active for this demo. Review the highest-fit accounts first, validate the context, then approve relevant outreach.</p><div className="welcome-actions"><Link to="/next-best-action" className="button button-white">View next best action <ArrowRight size={16} /></Link><Link to="/icp-builder" className="welcome-text-link">Review ICP <ArrowUpRight size={15} /></Link></div></div><div className="welcome-graphic"><div className="graphic-ring ring-a" /><div className="graphic-ring ring-b" /><div className="graphic-core"><Sparkles size={31} /></div><div className="graphic-node node-a"><Target size={16} /></div><div className="graphic-node node-b"><Users size={16} /></div><div className="graphic-node node-c"><Mail size={16} /></div></div></div>
    <div className="stats-grid">
      <StatCard label="Prospects in workspace" value={prospects.length} note="Illustrative sample records" icon={Building2} />
      <StatCard label="Hot + High fit" value={high} note="Score of 70+ in this demo" icon={Target} tone="violet" />
      <StatCard label="Contacted / in conversation" value={contacted} note="Based on sample statuses" icon={Mail} tone="green" />
      <StatCard label="Follow-ups due" value={due} note="Review before taking action" icon={Clock3} tone="orange" />
    </div>
    <section className="panel pilot-progress-panel"><div className="panel-heading"><div><h2>15-day pilot progress</h2><p>Current illustrative workspace against the proposal's conservative output targets.</p></div><Pill tone="blue">Demo tracker</Pill></div><div className="pilot-progress-grid"><div><div className="pilot-progress-label"><span>Accounts researched</span><strong>{prospects.length}/50</strong></div><div className="pilot-progress-track"><span style={{width:`${Math.min(100,prospects.length/50*100)}%`}}/></div></div><div><div className="pilot-progress-label"><span>Qualified accounts (score 70+)</span><strong>{qualified}/25</strong></div><div className="pilot-progress-track"><span style={{width:`${Math.min(100,qualified/25*100)}%`}}/></div></div><div><div className="pilot-progress-label"><span>Prospects with outreach drafts</span><strong>{Math.min(selectedOutreach, 15)}/15</strong></div><div className="pilot-progress-track"><span style={{width:`${Math.min(100,selectedOutreach/15*100)}%`}}/></div></div></div><p className="analytics-footnote">Targets are not guarantees. All records and draft counts are local demo data, not live provider activity.</p></section>
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-heading"><div><h2>Recommended next steps</h2><p>Move from setup to founder-approved action.</p></div><Pill tone="blue">3 steps</Pill></div>
        <div className="checklist">{steps.map((s, i) => <div className="checklist-row" key={s.label}><div className={`checklist-icon ${s.done ? "done" : ""}`}>{s.done ? <CheckCircle2 size={19} /> : <s.icon size={18} />}</div><div className="checklist-copy"><strong>{s.label}</strong><span>{s.detail}</span></div><Link to={s.to} className="round-arrow" aria-label={s.label}><ArrowRight size={16} /></Link></div>)}</div>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>Priority prospects</h2><p>High-fit examples to review first.</p></div><Link to="/leads" className="inline-link">View all <ArrowRight size={15} /></Link></div>
        <div className="priority-list">{prospects.filter(p => p.score >= 90).slice(0, 3).map(p => <Link to={`/prospects/${p.id}`} className="priority-row" key={p.id}><div className="company-avatar">{p.company.slice(0, 1)}</div><div className="priority-copy"><strong>{p.company}</strong><span>{p.person} · {p.role}</span></div><div className="score-mini"><strong>{p.score}</strong><span>fit</span></div></Link>)}</div>
      </section>
    </div>
    <div className="dashboard-grid lower-grid">
      <section className="panel">
        <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest changes in this demo workspace.</p></div><Activity size={18} className="muted-icon" /></div>
        <div className="activity-list">{activities.slice(0, 4).map(a => <div className="activity-row" key={a.id}><div className="activity-dot"><CheckCircle2 size={15} /></div><div><strong>{a.title}</strong><p>{a.detail}</p><small>{a.time}</small></div></div>)}</div>
      </section>
      <section className="panel pilot-summary">
        <div className="panel-heading"><div><h2>15-day founder pilot</h2><p>What the guided pilot is designed to validate.</p></div><div className="pilot-summary-icon"><Compass size={19} /></div></div>
        <div className="pilot-targets"><div><strong>50</strong><span>accounts researched</span></div><div><strong>25</strong><span>qualified accounts</span></div><div><strong>15</strong><span>outreach prospects</span></div></div>
        <p className="muted-copy">These are proposal targets, not guaranteed outputs. This prototype uses a small illustrative dataset.</p>
        <Link to="/pipeline" className="button button-secondary button-full">View pilot scorecard <ArrowRight size={15} /></Link>
      </section>
    </div>
  </div>;
}
