
import founderLogo from "../assets/founder-logo.png";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  Compass,
  FileBarChart2,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  Target,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePrototype } from "../context/PrototypeContext";
import { DemoNotice } from "./UI";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/startup-setup",
    label: "ICP Builder",
    icon: Target,
  },
  {
    to: "/prospects",
    label: "Prospects",
    icon: Search,
  },
  {
    to: "/leads",
    label: "Leads",
    sub: "Scored & ranked",
    icon: BarChart3,
  },
  {
    to: "/decision-makers",
    label: "Decision Makers",
    sub: "Contact list",
    icon: Users,
  },
  {
    to: "/outreach",
    label: "Outreach",
    sub: "Email workflow",
    icon: Mail,
  },
  {
    to: "/follow-ups",
    label: "Follow-ups",
    sub: "Pending queues",
    icon: Inbox,
  },
  {
    to: "/next-best-action",
    label: "Next Best Action",
    icon: Compass,
  },
  {
    to: "/pipeline",
    label: "Pipeline & Analytics",
    icon: Activity,
  },
  {
    to: "/reports",
    label: "Reports",
    sub: "Pilot & monthly",
    icon: FileBarChart2,
  },
  {
    to: "/settings",
    label: "Settings",
    sub: "Company, users, billing",
    icon: Settings,
  },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { account } = usePrototype();
  const navigate = useNavigate();
  const location = useLocation();

  const title =
    navItems.find((item) => item.to === location.pathname)?.label ||
    "Workspace";

  const sidebar = (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      {/* Brand */}
      <div className="brand">
        <div className="brand-mark">
          <img src={founderLogo} alt="BlueCode-OS logo" />
        </div>

        <div>
          <strong>BlueCode-OS</strong>
          <span>Sales intelligence workspace</span>
        </div>

        <button
          className="icon-button mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main navigation */}
      <div className="nav-label">WORKSPACE</div>

      <nav className="side-nav">
        {navItems.map(({ to, label, sub, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />

            <span className="nav-text">
              <span>{label}</span>
              {sub && <small>{sub}</small>}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom action */}
      <div className="sidebar-bottom">
        <button
          className="nav-link logout-link"
          onClick={() => navigate("/login")}
        >
          <LogOut size={18} />
          <span>Exit demo</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="app-shell">
      {sidebar}

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-area">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <span className="breadcrumb-muted">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{title}</strong>
          </div>

          <div className="topbar-right">
            <span className="prototype-label">
              <span />
              Demo preview
            </span>

            <button
              className="icon-button"
              onClick={() =>
                alert("No live notifications in this prototype.")
              }
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                {(account.name || "A").slice(0, 1).toUpperCase()}
              </div>

              <div>
                <strong>{account.name || "Alex Morgan"}</strong>
                <span>Founder</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main page content */}
        <div className="content-area">
          <DemoNotice />

          <Outlet />

          <footer className="app-footer">
            <span>BlueCode-OS</span>
            <span>
              Founder-guided sales intelligence · Demo data
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
