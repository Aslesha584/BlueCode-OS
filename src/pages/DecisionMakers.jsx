import { ArrowUpRight, Mail, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill } from "../components/UI";

export default function DecisionMakers() {
  const { prospects } = usePrototype();
  const [q, setQ] = useState("");
  const contacts = useMemo(() => prospects.filter(p => `${p.person} ${p.role} ${p.company} ${p.email}`.toLowerCase().includes(q.toLowerCase())), [prospects, q]);
  return <div>
    <PageHeader eyebrow="CONTACT LIST" title="Decision Makers" description="People associated with the example target accounts. Confirm relevance and contact data before use." />
    <div className="contact-toolbar"><div className="search-box"><Search size={17} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search people, roles or companies..." /></div><span className="result-count">{contacts.length} contacts</span></div>
    <div className="contact-grid">{contacts.map(p => <div className="contact-detail-card" key={p.id}><div className="contact-card-top"><div className="contact-avatar large">{p.person.split(" ").map(x => x[0]).join("")}</div><Pill tone={p.score >= 90 ? "hot" : p.score >= 70 ? "high" : p.score >= 50 ? "medium" : "low"}>{p.score} fit</Pill></div><h3>{p.person}</h3><p className="contact-role">{p.role}</p><div className="contact-company"><div className="company-avatar">{p.company.slice(0, 1)}</div><div><strong>{p.company}</strong><span>{p.industry}</span></div></div><div className="contact-email"><Mail size={15} /><span>{p.email}</span></div><div className="contact-card-actions"><Link to={`/prospects/${p.id}`} className="button button-secondary button-full">View intelligence <ArrowUpRight size={15} /></Link></div><div className="source-note">Illustrative mock contact. Not a verified person or email.</div></div>)}</div>
    {contacts.length === 0 && <div className="panel"><div className="empty-state"><Users size={25} /><h3>No contacts found</h3><p>Try searching a different name or company.</p></div></div>}
  </div>;
}
