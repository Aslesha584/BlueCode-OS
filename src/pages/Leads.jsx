import { ArrowRight, BarChart3, Filter, Target } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill, StatCard } from "../components/UI";

export default function Leads() {
  const { prospects } = usePrototype();
  const [range, setRange] = useState("All scores");
  const filtered = prospects.filter(p => range === "All scores" || (range === "Hot (90–100)" && p.score >= 90) || (range === "High (70–89)" && p.score >= 70 && p.score < 90) || (range === "Medium (50–69)" && p.score >= 50 && p.score < 70) || (range === "Low (0–49)" && p.score < 50));
  return <div>
    <PageHeader eyebrow="SCORED & RANKED" title="Leads" description="A prioritized view of prospect records with an explainable fit score and a visible workflow status." />
    <div className="stats-grid three-stats"><StatCard label="Hot (90–100)" value={prospects.filter(p => p.score >= 90).length} note="Highest fit tier; verify evidence before outreach" icon={Target} /><StatCard label="High (70–89)" value={prospects.filter(p => p.score >= 70 && p.score < 90).length} note="Review next" icon={BarChart3} tone="violet" /><StatCard label="Medium / Low" value={prospects.filter(p => p.score < 70).length} note="Validate or deprioritize" icon={Filter} tone="orange" /></div>
    <div className="panel">
      <div className="panel-heading"><div><h2>Priority queue</h2><p>Score ranges are prototype display rules, not purchase probabilities.</p></div><select className="compact-select" value={range} onChange={e => setRange(e.target.value)}><option>All scores</option><option>Hot (90–100)</option><option>High (70–89)</option><option>Medium (50–69)</option><option>Low (0–49)</option></select></div>
      <div className="lead-list">{filtered.sort((a,b) => b.score-a.score).map(p => <div className="lead-row" key={p.id}><div className={`lead-score ${p.score >= 90 ? "lead-score-hot" : p.score >= 70 ? "lead-score-high" : p.score >= 50 ? "lead-score-medium" : "lead-score-low"}`}><strong>{p.score}</strong><span>FIT</span></div><div className="lead-main"><div className="lead-title"><strong>{p.company}</strong><Pill tone={p.priority.toLowerCase()}>{p.priority} priority</Pill></div><p>{p.fit[0]}. {p.fit[1]}.</p><div className="lead-meta"><span>{p.person} · {p.role}</span><span>{p.industry}</span><span>{p.location}</span></div></div><div className="lead-right"><Pill>{p.status}</Pill><Link className="table-action" to={`/prospects/${p.id}`}><ArrowRight size={17} /></Link></div></div>)}</div>
    </div>
    <div className="info-strip"><Target size={18} /><p><strong>Scoring principle:</strong> the score should explain fit against the approved ICP. Timing signals should be shown separately, with provenance and confidence; ICP fit alone is not buying intent.</p></div>
  </div>;
}
