import { ArrowRight, Info, Sparkles } from "lucide-react";

export function Button({ children, variant = "primary", icon: Icon, className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>
    {children}{Icon && <Icon size={16} />}
  </button>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {action && <div className="page-header-action">{action}</div>}
  </div>;
}

export function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function StatCard({ label, value, note, icon: Icon, tone = "blue" }) {
  return <div className="stat-card">
    <div className={`stat-icon stat-${tone}`}>{Icon && <Icon size={19} />}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {note && <div className="stat-note">{note}</div>}
  </div>;
}

export function EmptyState({ title, detail, action }) {
  return <div className="empty-state">
    <div className="empty-icon"><Sparkles size={22} /></div>
    <h3>{title}</h3><p>{detail}</p>{action}
  </div>;
}

export function DemoNotice({ children = "Prototype demo · Mock data only. Hunter, AI, email and calendar services are not live yet." }) {
  return <div className="demo-notice"><Info size={16} /><span>{children}</span></div>;
}

export function NextLink({ to, children }) {
  return <a className="inline-link" href={to}>{children}<ArrowRight size={15} /></a>;
}
