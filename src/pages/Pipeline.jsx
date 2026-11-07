
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Search,
  Send,
  Target,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import "./Pipeline.css";

const pipelineStages = [
  { label: "Ready to contact", number: "01" },
  { label: "Contacted", number: "02" },
  { label: "Interested", number: "03" },
  { label: "Booking link sent", number: "04" },
  { label: "Meeting booked", number: "05" },
];

const normalize = (value) =>
  String(value ?? "").trim().toLowerCase();

function getStatus(prospect) {
  return normalize(prospect.status || prospect.stage || "Target");
}

function getIntent(prospect) {
  return normalize(
    prospect.intent ||
      prospect.replyIntent ||
      prospect.replyStatus ||
      ""
  );
}

function hasPositiveIntent(prospect) {
  return getIntent(prospect).startsWith("positive");
}

function hasNegativeIntent(prospect) {
  return getIntent(prospect).startsWith("negative");
}

function hasNeutralIntent(prospect) {
  return getIntent(prospect).startsWith("neutral");
}

function getIntentLabel(prospect) {
  if (hasNegativeIntent(prospect)) return "Negative";
  if (hasPositiveIntent(prospect)) return "Positive";
  if (hasNeutralIntent(prospect)) return "Neutral";
  return "";
}

function isBooked(prospect) {
  const status = getStatus(prospect);

  return (
    prospect.meetingBooked === true ||
    Boolean(prospect.meetingBookedAt) ||
    status === "booked" ||
    status.includes("meeting booked")
  );
}

function isNotInterested(prospect) {
  const status = getStatus(prospect);

  return (
    hasNegativeIntent(prospect) ||
    status === "not interested" ||
    status === "rejected" ||
    status === "do not contact" ||
    status.includes("not interested") ||
    status.includes("do not contact")
  );
}

function isBookingLinkSent(prospect) {
  const status = getStatus(prospect);

  return (
    prospect.bookingLinkSent === true ||
    Boolean(prospect.bookingLinkSentAt) ||
    status.includes("booking link sent") ||
    status === "link sent"
  );
}

// Positive replies count only when reply intent is actually positive.
// Sending a booking link or booking a meeting is not itself a reply.
function isPositive(prospect) {
  return hasPositiveIntent(prospect) && !isNotInterested(prospect);
}

function getFollowUpCount(prospect) {
  const followUps = Array.isArray(prospect.followUps)
    ? prospect.followUps
    : Array.isArray(prospect.followups)
      ? prospect.followups
      : [];

  const recordedCount = followUps.filter(
    (item) =>
      item?.sent === true ||
      normalize(item?.status) === "sent" ||
      Boolean(item?.sentAt)
  ).length;

  const numericCount = Math.max(
    0,
    Number(
      prospect.followUpCount ??
        prospect.followupCount ??
        prospect.followUpsSent ??
        0
    ) || 0
  );

  const flagCount =
    prospect.followUp2Sent === true ||
    prospect.followup2Sent === true
      ? 2
      : prospect.followUp1Sent === true ||
          prospect.followup1Sent === true
        ? 1
        : 0;

  return Math.min(
    2,
    Math.max(recordedCount, numericCount, flagCount)
  );
}

function isFollowUpDue(prospect) {
  if (
    isBooked(prospect) ||
    isNotInterested(prospect) ||
    isPositive(prospect) ||
    isBookingLinkSent(prospect)
  ) {
    return false;
  }

  if (getFollowUpCount(prospect) >= 2) {
    return false;
  }

  const status = getStatus(prospect);

  return (
    prospect.followUpDue === true ||
    prospect.nextFollowUpDue === true ||
    status.includes("follow-up due") ||
    status.includes("follow up due") ||
    status.includes("follow-up needed") ||
    status.includes("follow up needed")
  );
}

function getPipelineStage(prospect) {
  const status = getStatus(prospect);

  if (isNotInterested(prospect)) return "Not interested";
  if (isBooked(prospect)) return "Meeting booked";
  if (isBookingLinkSent(prospect)) return "Booking link sent";
  if (isPositive(prospect)) return "Interested";

  if (
    status.includes("contact") ||
    status.includes("follow-up") ||
    status.includes("follow up") ||
    status.includes("repl") ||
    status.includes("email sent") ||
    status.includes("outreach sent") ||
    status.includes("queued for prospecting")
  ) {
    return "Contacted";
  }

  return "Ready to contact";
}

function getNextAction(prospect) {
  if (isNotInterested(prospect)) {
    return {
      label: "Outreach stopped",
      type: "stopped",
      to: null,
    };
  }

  if (isBooked(prospect)) {
    return {
      label: "Meeting confirmed",
      type: "complete",
      to: null,
    };
  }

  if (isBookingLinkSent(prospect)) {
    return {
      label: "Check booking status",
      type: "booking-sent",
      to: "/follow-ups",
    };
  }

  if (isPositive(prospect)) {
    return {
      label: "Share booking link",
      type: "send-booking",
      to: "/outreach",
    };
  }

  if (isFollowUpDue(prospect)) {
    return {
      label: `Review follow-up ${getFollowUpCount(prospect) + 1}`,
      type: "followup",
      to: "/follow-ups",
    };
  }

  const status = getStatus(prospect);

  if (
    status.includes("contact") ||
    status.includes("email sent") ||
    status.includes("outreach sent") ||
    status.includes("repl") ||
    status.includes("follow-up") ||
    status.includes("follow up")
  ) {
    return {
      label: "Check reply status",
      type: "followup",
      to: "/follow-ups",
    };
  }

  return {
    label: "Prepare outreach",
    type: "outreach",
    to: "/outreach",
  };
}

function getStageClass(stage) {
  if (stage === "Meeting booked") return "success";
  if (stage === "Not interested") return "muted";
  if (stage === "Booking link sent") return "booking";
  if (stage === "Interested") return "positive";
  if (stage === "Contacted") return "contacted";
  return "ready";
}

function MetricCard({ icon: Icon, label, value, description, tone }) {
  return (
    <article className="meeting-metric-card">
      <div className={`meeting-metric-icon ${tone}`}>
        <Icon size={21} aria-hidden="true" />
      </div>

      <div className="meeting-metric-label">{label}</div>
      <div className="meeting-metric-value">{value}</div>

      <div className="meeting-metric-description">
        {description}
      </div>
    </article>
  );
}

export default function Pipeline() {
  const prototype = usePrototype();

  const prospects = Array.isArray(prototype.prospects)
    ? prototype.prospects
    : [];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const enrichedProspects = useMemo(
    () =>
      prospects.map((prospect, index) => ({
        ...prospect,
        id: prospect.id ?? prospect._id ?? index,
        pipelineStage: getPipelineStage(prospect),
        nextAction: getNextAction(prospect),
      })),
    [prospects]
  );

  const metrics = useMemo(
    () => ({
      positiveReplies: enrichedProspects.filter(
        (prospect) => isPositive(prospect)
      ).length,

      bookingLinksSent: enrichedProspects.filter(
        (prospect) => isBookingLinkSent(prospect)
      ).length,

      meetingsBooked: enrichedProspects.filter(
        (prospect) => isBooked(prospect)
      ).length,

      followUpsNeeded: enrichedProspects.filter(
        (prospect) => isFollowUpDue(prospect)
      ).length,
    }),
    [enrichedProspects]
  );

  const stageCounts = useMemo(
    () =>
      pipelineStages.map((stage) => ({
        ...stage,
        count: enrichedProspects.filter(
          (prospect) => prospect.pipelineStage === stage.label
        ).length,
      })),
    [enrichedProspects]
  );

  const visibleProspects = useMemo(() => {
    const query = normalize(search);

    return enrichedProspects
      .filter((prospect) => {
        const company = normalize(prospect.company);
        const industry = normalize(prospect.industry);
        const person = normalize(
          prospect.decisionMaker?.name ||
            prospect.decisionMakerName ||
            prospect.contactName ||
            prospect.person
        );

        const matchesSearch =
          !query ||
          company.includes(query) ||
          industry.includes(query) ||
          person.includes(query);

        let matchesFilter = true;

        if (filter === "positive") {
          matchesFilter = isPositive(prospect);
        } else if (filter === "booking") {
          matchesFilter = isBookingLinkSent(prospect);
        } else if (filter === "followup") {
          matchesFilter = isFollowUpDue(prospect);
        } else if (filter === "booked") {
          matchesFilter = isBooked(prospect);
        } else if (filter === "contacted") {
          matchesFilter =
            prospect.pipelineStage === "Contacted";
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const priority = (prospect) => {
          if (isBooked(prospect)) return 1;
          if (isBookingLinkSent(prospect)) return 2;
          if (isPositive(prospect)) return 3;
          if (isFollowUpDue(prospect)) return 4;
          if (isNotInterested(prospect)) return 6;
          return 5;
        };

        return priority(a) - priority(b);
      });
  }, [enrichedProspects, search, filter]);

  return (
    <main className="meeting-page">
      <header className="meeting-page-header">
        <div className="meeting-header-copy">
          <div className="meeting-eyebrow">
            <CalendarCheck size={15} />
            SALES WORKSPACE
          </div>

          <h1>Pipeline &amp; Analytics</h1>

          <p>
            Track your prospects from first contact to a
            confirmed meeting. See what needs attention next.
          </p>
        </div>

        <div className="meeting-header-actions">
          <Link
            to="/settings"
            className="meeting-secondary-button"
          >
            <CalendarClock size={17} />
            Booking settings
          </Link>

          <Link
            to="/outreach"
            className="meeting-primary-button"
          >
            <Send size={17} />
            Start outreach
          </Link>
        </div>
      </header>

      <div className="meeting-demo-notice">
        <Activity size={18} />

        <div>
          <strong>Prototype demo · Mock data only</strong>
          <span>
            Hunter, AI, email, and calendar connections are
            not live. Metrics reflect the current demo data.
          </span>
        </div>
      </div>

      <section className="meeting-section">
        <div className="meeting-section-heading">
          <div>
            <h2>Meeting performance</h2>
            <p>
              The key numbers that show progress toward booked meetings.
            </p>
          </div>
        </div>

        <div className="meeting-metrics-grid">
          <MetricCard
            icon={MessageCircle}
            label="Positive replies"
            value={metrics.positiveReplies}
            description="Prospects with positive reply intent"
            tone="purple"
          />

          <MetricCard
            icon={Send}
            label="Booking links sent"
            value={metrics.bookingLinksSent}
            description="Awaiting booking confirmation"
            tone="blue"
          />

          <MetricCard
            icon={CalendarCheck}
            label="Meetings booked"
            value={metrics.meetingsBooked}
            description="Confirmed meetings only"
            tone="green"
          />

          <MetricCard
            icon={Clock3}
            label="Follow-ups due"
            value={metrics.followUpsNeeded}
            description="Eligible for follow-up, maximum two"
            tone="orange"
          />
        </div>
      </section>

      <section className="meeting-section">
        <div className="meeting-section-heading">
          <div>
            <h2>Journey to a meeting</h2>
            <p>
              Each prospect appears in one current active stage.
            </p>
          </div>
        </div>

        <div
          className="meeting-pipeline"
          aria-label="Prospect pipeline stages"
        >
          {stageCounts.map((stage, index) => (
            <div
              className="meeting-pipeline-stage"
              key={stage.label}
            >
              <div className="meeting-pipeline-stage-top">
                <span className="meeting-pipeline-count">{stage.count}</span>
              </div>

              <div className="meeting-pipeline-label">
                {stage.label}
              </div>

              <div className="meeting-pipeline-track">
                <div
                  className={`meeting-pipeline-fill stage-${index}`}
                  style={{
                    width: `${
                      enrichedProspects.length
                        ? (stage.count / enrichedProspects.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {enrichedProspects.some(
          (prospect) => prospect.pipelineStage === "Not interested"
        ) && (
          <p className="meeting-pipeline-note">
            Negative replies are excluded from the active stages.
          </p>
        )}
      </section>

      <section className="meeting-section">
        <div className="meeting-section-heading">
          <div>
            <h2>Prospects &amp; next actions</h2>
            <p>
              Review each prospect and continue with the appropriate next step.
            </p>
          </div>

          <Link
            to="/follow-ups"
            className="meeting-text-link"
          >
            View follow-ups <ArrowRight size={16} />
          </Link>
        </div>

        <div className="meeting-prospect-toolbar">
          <label className="meeting-search">
            <Search size={17} aria-hidden="true" />

            <input
              type="search"
              placeholder="Search company or decision-maker"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search prospects by company, industry, or decision-maker"
            />
          </label>

          <select
            className="meeting-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter prospects"
          >
            <option value="all">All prospects</option>
            <option value="contacted">Contacted</option>
            <option value="positive">Positive replies</option>
            <option value="booking">Booking link sent</option>
            <option value="followup">Follow-ups due</option>
            <option value="booked">Meeting booked</option>
          </select>
        </div>

        <div className="meeting-results-label">
          Showing {visibleProspects.length} matching prospect
          {visibleProspects.length === 1 ? "" : "s"}
        </div>

        <div className="meeting-prospect-list">
          {visibleProspects.length > 0 ? (
            visibleProspects.slice(0, 10).map((prospect) => {
              const action = prospect.nextAction;
              const booked = isBooked(prospect);
              const declined = isNotInterested(prospect);
              const intentLabel = getIntentLabel(prospect);
              const company = (
                prospect.company || "Unnamed company"
              ).trim();

              return (
                <article
                  className="meeting-prospect-row"
                  key={prospect.id}
                >
                  <div className="meeting-company-avatar">
                    {company.charAt(0).toUpperCase() || "C"}
                  </div>

                  <div className="meeting-prospect-main">
                    <div className="meeting-company-name">
                      {company}
                    </div>

                    <div className="meeting-prospect-meta">
                      {prospect.decisionMaker?.name ||
                        prospect.decisionMaker?.title ||
                        prospect.decisionMakerName ||
                        prospect.person ||
                        prospect.industry ||
                        "Decision-maker not specified"}
                    </div>

                    {(prospect.buyingSignal || prospect.signal) && (
                      <div className="meeting-prospect-signal">
                        <Zap size={13} />
                        <span>
                          {prospect.buyingSignal || prospect.signal}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="meeting-prospect-status">
                    <span
                      className={`meeting-status-pill ${getStageClass(
                        prospect.pipelineStage
                      )}`}
                    >
                      {prospect.pipelineStage}
                    </span>

                    {intentLabel && (
                      <span
                        className={`meeting-intent-label intent-${intentLabel.toLowerCase()}`}
                      >
                        Reply: {intentLabel}
                      </span>
                    )}
                  </div>

                  <div className="meeting-prospect-action">
                    {booked ? (
                      <span className="meeting-action-complete">
                        <CheckCircle2 size={15} />
                        Confirmed
                      </span>
                    ) : declined ? (
                      <span className="meeting-action-muted">
                        <XCircle size={15} />
                        Stopped
                      </span>
                    ) : (
                      <Link
                        to={action.to || "/pipeline"}
                        className="meeting-row-action"
                      >
                        {action.label}
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="meeting-empty-state">
              <Users size={30} />

              <strong>No matching prospects</strong>

              <p>
                Try another search term or choose a different filter.
              </p>

              {(search || filter !== "all") && (
                <button
                  type="button"
                  className="meeting-reset-button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                >
                  Clear search and filters
                </button>
              )}
            </div>
          )}
        </div>

        {visibleProspects.length > 10 && (
          <div className="meeting-list-footer">
            Showing the first 10 of {visibleProspects.length} matching
            prospects. Use search and filters to narrow the list.
          </div>
        )}
      </section>

      <section className="meeting-next-step">
        <div className="meeting-next-icon">
          <Target size={23} />
        </div>

        <div className="meeting-next-copy">
          <h2>The goal: a confirmed meeting</h2>
          <p>
            Find the right prospects, send relevant outreach, understand
            replies, and help interested people book. Once a meeting
            is confirmed, the startup takes over.
          </p>
        </div>

        <Link
          to="/outreach"
          className="meeting-primary-button meeting-next-button"
        >
          Continue outreach <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
