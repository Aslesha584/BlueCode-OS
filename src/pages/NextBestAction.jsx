
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleStop,
  Compass,
  Mail,
  Search,
  Sparkles,
  Users,
  Target,
  ShieldCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill } from "../components/UI";

const getScore = (prospect) =>
  Number(prospect.score ?? prospect.icpFitScore ?? 0);

const getPriority = (score) => {
  if (score >= 90) return "Hot";
  if (score >= 70) return "High";
  if (score >= 50) return "Medium";
  return "Low";
};

export default function NextBestAction() {
  const { prospects = [], bookingUrl } = usePrototype();

  const [draftStatus, setDraftStatus] = useState("Pending Approval");

  // Exclude low-fit prospects from the eligible targeting count.
  const eligibleProspects = prospects
    .filter((prospect) => getScore(prospect) >= 50)
    .sort((a, b) => getScore(b) - getScore(a));

  const priorityProspects = eligibleProspects.filter(
    (prospect) => getScore(prospect) >= 70
  );

  const featuredProspect = eligibleProspects[0];

  const companyName = featuredProspect
    ? featuredProspect.company || featuredProspect.name || "your selected company"
    : "your selected company";

  const companyIndustry =
    featuredProspect?.industry || "the company's industry";

  const companyId = featuredProspect?.id || "p1";

  const picks = [
    {
      icon: Search,
      title: "Research before reaching out",
      detail:
        "For accounts with missing timing evidence, verify the company context before referencing a buying signal.",
      to: featuredProspect ? `/prospects/${companyId}` : "/prospects",
      label: "Review research",
    },
    {
      icon: Mail,
      title: "Review a founder-approved email draft",
      detail:
        "Check personalization and ensure every claim is grounded in the visible record.",
      to: "/outreach",
      label: "Review drafts",
    },
    {
      icon: CalendarDays,
      title: "Offer a meeting when the prospect is interested",
      detail: bookingUrl
        ? `Your demo booking link is configured: ${bookingUrl}`
        : "Add your own booking URL in Settings before using it in a meeting invitation.",
      to: "/settings",
      label: bookingUrl ? "Review booking settings" : "Add booking link",
    },
    {
      icon: Users,
      title: "Confirm the decision-maker",
      detail:
        "Validate the person's role and business contact details before sending.",
      to: "/decision-makers",
      label: "Review contacts",
    },
    {
      icon: CircleStop,
      title: "Stop when the fit or consent is not right",
      detail:
        "Respect opt-outs and do not continue outreach when a prospect is not a fit.",
      to: "/follow-ups",
      label: "Review queue",
    },
  ];

  const handleApproval = () => {
    setDraftStatus("Approved in prototype");
  };

  const handleRejection = () => {
    setDraftStatus("Rejected in prototype");
  };

  return (
    <div className="next-best-action-page">
      <PageHeader
        eyebrow="RECOMMENDED NEXT STEP"
        title="Next Best Action"
        description="Your AI sales copilot recommends what to do next, prepares outreach drafts, and keeps you in control of every email."
      />

      {/* Daily recommendation */}
      <section className="panel nba-daily-panel">
        <div className="nba-daily-heading">
          <div className="nba-feature-icon">
            <Sparkles size={24} />
          </div>

          <div className="nba-daily-heading-copy">
            <div className="eyebrow">YOUR DAILY SALES PLAN</div>
            <h2>What should you focus on today?</h2>
            <p>
              Prioritize qualified prospects and review the suggested
              outreach before sending.
            </p>
          </div>
        </div>

        <div className="nba-daily-stats">
          <div className="nba-daily-stat">
            <div className="nba-stat-icon">
              <Target size={20} />
            </div>
            <div>
              <strong>{eligibleProspects.length}</strong>
              <span>Companies eligible for targeting</span>
            </div>
          </div>

          <div className="nba-daily-stat">
            <div className="nba-stat-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>{priorityProspects.length}</strong>
              <span>High-priority prospects</span>
            </div>
          </div>

          <div className="nba-daily-stat">
            <div className="nba-stat-icon">
              <Clock size={20} />
            </div>
            <div>
              <strong>{draftStatus === "Pending Approval" ? "1" : "0"}</strong>
              <span>Sample draft awaiting review</span>
            </div>
          </div>
        </div>

        <div className="nba-daily-recommendation">
          <div className="nba-recommendation-copy">
            <Pill tone="blue">Today's recommendation</Pill>

            <h3>
              {eligibleProspects.length} companies can be targeted today
            </h3>

            <p>
              Start with high-fit companies, validate their available
              information, and personalize your outreach. Low-fit prospects
              are excluded from this targeting recommendation.
            </p>
          </div>

          <Link className="button button-primary" to="/prospects">
            View prospects <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Outreach approval */}
      <section className="panel nba-approval-panel">
        <div className="nba-approval-heading">
          <div className="nba-feature-icon">
            <Mail size={23} />
          </div>

          <div className="nba-approval-heading-copy">
            <div className="eyebrow">FOUNDER APPROVAL REQUIRED</div>
            <h2>Review your suggested outreach</h2>
            <p>
              Review the example email below. Approve or reject the draft
              before proceeding to the outreach workflow.
            </p>
          </div>

          <Pill
            tone={
              draftStatus === "Pending Approval"
                ? "blue"
                : draftStatus === "Approved in prototype"
                  ? "green"
                  : undefined
            }
          >
            {draftStatus}
          </Pill>
        </div>

        <div className="nba-email-preview">
          <div className="nba-email-meta">
            <span>Company</span>
            <strong>{companyName}</strong>
          </div>

          <div className="nba-email-meta">
            <span>Industry</span>
            <strong>{companyIndustry}</strong>
          </div>

          <div className="nba-email-meta">
            <span>Subject</span>
            <strong>
              Exploring how we could support {companyName}
            </strong>
          </div>

          <div className="nba-email-body">
            <span className="eyebrow">SUGGESTED EMAIL DRAFT</span>

            <p>Hello,</p>

            <p>
              I’m reaching out because our solution may be relevant to
              {` ${companyName}`} and your team's goals in {companyIndustry}.
              I would love to learn more about your current challenges and
              explore whether we could help.
            </p>

            <p>
              Would you be open to a brief conversation?
            </p>

            <p>Best regards,</p>
            <p>[Your name and company]</p>
          </div>

          <div className="nba-approval-notice">
            <ShieldCheck size={21} />
            <div>
              <strong>Please approve to do the outreach</strong>
              <p>
                Review the message and verify company details before
                proceeding. Approval in this prototype does not send an email.
              </p>
            </div>
          </div>

          <div className="nba-approval-actions">
            <Link className="button button-secondary" to="/outreach">
              <Mail size={16} />
              Review outreach
            </Link>

            <div className="nba-approval-buttons">
              <button
                type="button"
                className="button button-secondary"
                onClick={handleRejection}
                disabled={draftStatus === "Rejected in prototype"}
              >
                <XCircle size={16} />
                Reject
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={handleApproval}
                disabled={draftStatus === "Approved in prototype"}
              >
                <CheckCircle2 size={16} />
                Approve draft
              </button>
            </div>
          </div>

          {draftStatus !== "Pending Approval" && (
            <p className="nba-prototype-status" role="status">
              {draftStatus === "Approved in prototype"
                ? "Draft marked as approved locally. No email has been sent."
                : "Draft marked as rejected locally. No email has been sent."}
              {" "}
              Refreshing the page resets this prototype status.
            </p>
          )}
        </div>
      </section>

      {/* Existing action playbook */}
      <div className="section-title-row">
        <div>
          <h2>Action playbook</h2>
          <p>Choose the action that matches the current context.</p>
        </div>
      </div>

      <div className="nba-list">
        {picks.map((pick, index) => (
          <div className="nba-row" key={pick.title}>
            <div className="nba-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="nba-icon">
              <pick.icon size={19} />
            </div>

            <div className="nba-copy">
              <strong>{pick.title}</strong>
              <p>{pick.detail}</p>
            </div>

            <Link className="button button-secondary" to={pick.to}>
              {pick.label} <ArrowRight size={15} />
            </Link>
          </div>
        ))}
      </div>

      <div className="caution-note large-caution">
        <Sparkles size={17} />
        <span>
          This page currently uses prototype data and a sample email template.
          Live recommendations, AI-generated personalized drafts, persistent
          approvals, and email sending require backend and service integration.
        </span>
      </div>
    </div>
  );
}
