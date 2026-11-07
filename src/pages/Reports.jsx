
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  FileBarChart2,
  Target,
  Users,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

import founderLogo from "../assets/founder-logo.png";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill } from "../components/UI";

const contactedStages = [
  "contacted",
  "follow-up due",
  "interested",
  "meeting requested",
  "meeting booked",
];

const intentHas = (value, word) =>
  String(value || "").toLowerCase().includes(word);

const pct = (n, d) =>
  d ? `${Math.round((n / d) * 100)}%` : "—";

export default function Reports() {
  const {
    startup,
    icp,
    prospects = [],
    outreach = [],
    selectedPlan,
  } = usePrototype();

  const [reportType, setReportType] = useState("pilot");
  const [period, setPeriod] = useState("30");

  /*
   * PROTOTYPE ELIGIBILITY
   *
   * These flags must eventually come from the backend.
   * Do not use frontend flags as the final billing security check.
   */
  const pilotReportReady = startup?.trialCompleted === true;

  const completedBillingMonths = Number(
    startup?.completedBillingMonths || 0
  );

  const monthlyReportReady = completedBillingMonths > 0;

  const reportReady =
    reportType === "pilot"
      ? pilotReportReady
      : monthlyReportReady;

  const stats = useMemo(() => {
    const contacted = prospects.filter((p) =>
      contactedStages.includes(
        String(p.status || "").toLowerCase()
      )
    );

    const replies = prospects.filter((p) =>
      ["positive", "neutral", "negative"].some((keyword) =>
        intentHas(p.intent, keyword)
      )
    );

    const positive = prospects.filter((p) =>
      intentHas(p.intent, "positive")
    );

    const neutral = prospects.filter((p) =>
      intentHas(p.intent, "neutral")
    );

    const negative = prospects.filter((p) =>
      intentHas(p.intent, "negative")
    );

    const booked = prospects.filter(
      (p) =>
        String(p.status || "").toLowerCase() ===
        "meeting booked"
    );

    const requested = prospects.filter((p) =>
      ["meeting requested", "meeting booked"].includes(
        String(p.status || "").toLowerCase()
      )
    );

    const qualified = prospects.filter(
      (p) => Number(p.score ?? p.icpFitScore ?? 0) >= 70
    );

    const drafts = outreach.filter((item) =>
      /needs review|draft/i.test(item.status || "")
    );

    const queued = outreach.filter((item) =>
      /queued|scheduled|approved/i.test(item.status || "")
    );

    return {
      total: prospects.length,
      qualified: qualified.length,
      decisionMakers: prospects.filter(
        (p) => p.person && p.role
      ).length,
      contacted: contacted.length,
      replies: replies.length,
      positive: positive.length,
      neutral: neutral.length,
      negative: negative.length,
      booked: booked.length,
      requested: requested.length,
      drafts: drafts.length,
      queued: queued.length,
    };
  }, [prospects, outreach]);

  const quota =
    selectedPlan === "Growth"
      ? { prospects: 500, dm: 250, emails: 500, users: 3 }
      : selectedPlan === "Pro"
        ? {
            prospects: 2000,
            dm: 1000,
            emails: 2000,
            users: 10,
          }
        : {
            prospects: 100,
            dm: 50,
            emails: 100,
            users: 1,
          };

  const typeTitle =
    reportType === "pilot"
      ? "15-Day Founder Pilot Report"
      : "Monthly Client Report";

  const reportPeriod =
    reportType === "pilot"
      ? "Pilot period · First 15 days"
      : `Monthly reporting period · ${period} days`;

  const availabilityMessage =
    reportType === "pilot"
      ? pilotReportReady
        ? "15-day pilot report is available."
        : "Available after the 15-day pilot is completed."
      : monthlyReportReady
        ? "Monthly report is available."
        : "Available after your first paid billing month.";

  const exportReport = () => {
    if (!reportReady) return;

    const report = document.querySelector(".report-document");
    if (!report) return;

    // Build a lightweight, directly downloadable PDF from the report's visible text.
    const rawLines = (report.innerText || "")
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const wrap = (value, max = 92) => {
      const words = value.split(" ");
      const rows = [];
      let row = "";
      words.forEach((word) => {
        const next = row ? `${row} ${word}` : word;
        if (next.length > max && row) {
          rows.push(row);
          row = word;
        } else row = next;
      });
      if (row) rows.push(row);
      return rows;
    };
    const lines = rawLines.flatMap((line) => wrap(line));
    const pages = [];
    for (let i = 0; i < lines.length; i += 48) pages.push(lines.slice(i, i + 48));

    const objects = [];
    const addObject = (body) => { objects.push(body); return objects.length; };
    const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    const pageIds = [];
    const contentIds = [];
    pages.forEach((pageLines) => {
      const commands = ["BT", "/F1 9 Tf", "48 795 Td", "13 TL"];
      pageLines.forEach((line, index) => {
        const safe = line.normalize("NFKD").replace(/[^\x20-\x7E]/g, "");
        const escaped = safe.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        if (index) commands.push("T*");
        commands.push(`(${escaped}) Tj`);
      });
      commands.push("ET");
      const stream = commands.join("\n");
      const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      contentIds.push(contentId);
      pageIds.push(addObject(""));
    });
    const pagesId = addObject("");
    pageIds.forEach((pageId, index) => {
      objects[pageId - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentIds[index]} 0 R >>`;
    });
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
    const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `BlueCode-OS-${reportType}-report.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <PageHeader
        eyebrow="CLIENT REPORTING"
        title="Reports and Performance"
        description="Clear reporting on prospecting, outreach engagement, and progress toward qualified customer meetings."
        action={
          <button
            type="button"
            className="button button-primary reports-export"
            onClick={exportReport}
            disabled={!reportReady}
            title={
              reportReady
                ? "Download this report as PDF"
                : "This report is not available yet"
            }
          >
            <ArrowDownToLine size={16} />
            {reportReady ? "Download Report" : "Report Locked"}
          </button>
        }
      />

      <div className="reports-notice no-print">
        <FileBarChart2 size={18} />

        <div>
          <strong>Prototype report preview</strong>
          <p>
            Figures are derived from illustrative demo records, not
            live client activity. Trial and billing eligibility also
            use prototype flags until the backend is connected.
          </p>
        </div>

        <Pill tone="blue">Demo data</Pill>
      </div>

      <div className="reports-controls no-print">
        <div
          className="reports-type-switch"
          role="group"
          aria-label="Report type"
        >
          <button
            type="button"
            className={reportType === "pilot" ? "selected" : ""}
            aria-pressed={reportType === "pilot"}
            onClick={() => setReportType("pilot")}
          >
            <Sparkles size={16} />
            Free 15-Day Pilot
          </button>

          <button
            type="button"
            className={reportType === "monthly" ? "selected" : ""}
            aria-pressed={reportType === "monthly"}
            onClick={() => setReportType("monthly")}
          >
            <CalendarDays size={16} />
            Monthly Client Report
          </button>
        </div>

        {reportType === "monthly" && (
          <label className="reports-period">
            Period
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="30">30 days</option>
              <option value="28">28 days</option>
              <option value="31">31 days</option>
            </select>
          </label>
        )}

        <div
          className={`reports-availability ${
            reportReady ? "is-available" : "is-locked"
          }`}
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "6px",
            fontSize: "12px",
            lineHeight: "1.4",
          }}
        >
          <span
            className="reports-availability-icon"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: reportReady ? "#16A34A" : "inherit",
            }}
          >
            {reportReady ? (
              <CheckCircle2 size={14} />
            ) : (
              <CalendarDays size={14} />
            )}
          </span>

          <span
            style={{
              fontSize: "12px",
              lineHeight: "1.4",
            }}
          >
            {availabilityMessage}
          </span>
        </div>
      </div>

      <article className="report-document">
        <header className="report-document-head">
          <div className="report-brand">
            <img
              src={founderLogo}
              alt="BlueCode-OS logo"
              className="report-brand-logo"
              style={{
                width: "45px",
                height: "45px",
                objectFit: "contain",
              }}
            />

            <div className="report-brand-copy">
              <strong>BlueCode-OS</strong>
              <span>AI Sales Copilot · Client report</span>
            </div>
          </div>

          <div className="report-document-badge">
            <Pill tone="blue">
              {reportType === "pilot"
                ? "FREE PILOT"
                : "MONTHLY PLAN"}
            </Pill>
          </div>

          <h2>{typeTitle}</h2>
          <p>{reportPeriod}</p>

          <div className="report-meta">
            <span>
              <Building2Fallback />
              <strong>{startup?.companyName || "Your startup"}</strong>
            </span>

            <span>
              Plan:{" "}
              <strong>
                {reportType === "pilot"
                  ? "Starter trial"
                  : selectedPlan || "Not specified"}
              </strong>
            </span>

            <span>
              ICP:{" "}
              <strong>
                {icp?.name ||
                  icp?.title ||
                  "Saved target profile"}
              </strong>
            </span>
          </div>
        </header>

        <section className="report-section">
          <div className="report-section-title">
            <span>01</span>
            <div>
              <h3>Executive Summary</h3>
              <p>
                Activity and progress toward arranging qualified
                customer meetings.
              </p>
            </div>
          </div>

          <div className="report-kpis">
            <div>
              <span>Prospects researched</span>
              <strong>{stats.total}</strong>
              <small>Illustrative records</small>
            </div>

            <div>
              <span>Qualified prospects</span>
              <strong>{stats.qualified}</strong>
              <small>ICP score ≥ 70</small>
            </div>

            <div>
              <span>Replies classified</span>
              <strong>{stats.replies}</strong>
              <small>Intent labels in demo</small>
            </div>

            <div>
              <span>Meetings booked</span>
              <strong>{stats.booked}</strong>
              <small>Current demo stage</small>
            </div>
          </div>

          <p className="report-summary-copy">
            The workflow is designed to identify relevant companies,
            surface decision-makers, support founder-approved outreach,
            interpret replies, and recommend the next action most likely
            to move a prospect toward a meeting. Replace this summary
            with verified period-over-period results when live
            integrations are connected.
          </p>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>02</span>
            <div>
              <h3>ICP & Targeting Performance</h3>
              <p>
                How closely discovered prospects match the agreed
                target profile.
              </p>
            </div>
          </div>

          <div className="report-detail-grid">
            <div className="report-detail-card">
              <span>ICP fit rate</span>
              <strong>{pct(stats.qualified, stats.total)}</strong>
              <small>
                Prospects scoring 70+ / all sample prospects
              </small>
            </div>

            <div className="report-detail-card">
              <span>Target profile</span>
              <strong>
                {icp?.name || icp?.title || "Saved ICP"}
              </strong>
              <small>
                Review industry, geography, company size and roles
                in ICP Builder.
              </small>
            </div>

            <div className="report-detail-card">
              <span>Best next improvement</span>
              <strong>Validate fit signals</strong>
              <small>
                Prioritise evidence-backed matches; do not infer
                urgency when signals are unavailable.
              </small>
            </div>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>03</span>
            <div>
              <h3>Prospect & Decision-Maker Intelligence</h3>
              <p>
                Account discovery, relevant contacts and evidence
                for outreach timing.
              </p>
            </div>
          </div>

          <div className="report-metric-list">
            <div>
              <span>
                <Users size={16} />
                Companies researched
              </span>
              <strong>{stats.total}</strong>
            </div>

            <div>
              <span>
                <Target size={16} />
                Qualified prospects
              </span>
              <strong>{stats.qualified}</strong>
            </div>

            <div>
              <span>
                <Users size={16} />
                Records with a decision-maker and role
              </span>
              <strong>{stats.decisionMakers}</strong>
            </div>
          </div>

          <div className="report-tip">
            <Sparkles size={16} />
            <p>
              <strong>Why Now?</strong> Use only verified triggers
              or buying signals with a clear source and date. If
              evidence is unavailable, report it as unavailable
              rather than inventing a reason to contact.
            </p>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>04</span>
            <div>
              <h3>Outreach & Reply Performance</h3>
              <p>
                Separate prepared drafts from actual sends and
                verified replies.
              </p>
            </div>
          </div>

          <div className="report-detail-grid">
            <div className="report-detail-card">
              <span>Drafts awaiting review</span>
              <strong>{stats.drafts}</strong>
              <small>Drafts are not counted as sent</small>
            </div>

            <div className="report-detail-card">
              <span>Queued / approved demo items</span>
              <strong>{stats.queued}</strong>
              <small>
                Not evidence of a real email send
              </small>
            </div>

            <div className="report-detail-card">
              <span>Replies classified</span>
              <strong>{stats.replies}</strong>
              <small>Demo intent labels only</small>
            </div>
          </div>

          <div className="report-intent-grid">
            <div>
              <span className="intent-dot positive" />
              Positive <strong>{stats.positive}</strong>
            </div>

            <div>
              <span className="intent-dot neutral" />
              Neutral <strong>{stats.neutral}</strong>
            </div>

            <div>
              <span className="intent-dot negative" />
              Negative <strong>{stats.negative}</strong>
            </div>
          </div>

          <p className="report-small-note">
            Email delivery, bounce rate, reply rate and positive
            reply rate should be calculated only from verified
            provider events. This prototype does not send email
            or connect to Hunter.
          </p>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>05</span>
            <div>
              <h3>Meeting Metrix</h3>
              <p>
                The primary outcome is helping clients arrange
                customer meetings.
              </p>
            </div>
          </div>

          <div className="report-meeting-grid">
            <div>
              <CalendarDays size={19} />
              <span>Meeting requested</span>
              <strong>{stats.requested}</strong>
            </div>

            <div>
              <CalendarCheck size={19} />
              <span>Meeting booked</span>
              <strong>{stats.booked}</strong>
            </div>

            <div>
              <CheckCircle2 size={19} />
              <span>Meeting attended</span>
              <strong>Not tracked</strong>
            </div>
          </div>

          <p className="report-small-note">
            Meeting requests and bookings must be confirmed through
            actual workflow/calendar records in production. Attendance
            is not tracked until a reliable source is connected.
          </p>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>06</span>
            <div>
              <h3>AI Recommendations & Next Steps</h3>
              <p>
                Practical actions to improve the chances of arranging
                a qualified meeting.
              </p>
            </div>
          </div>

          <ol className="report-next-steps">
            <li>
              <strong>Prioritise high-fit prospects.</strong>
              <span>
                Start with qualified accounts and confirm
                decision-maker relevance before outreach.
              </span>
            </li>

            <li>
              <strong>Personalise and review each message.</strong>
              <span>
                Use verified context and founder approval before
                any email is sent.
              </span>
            </li>

            <li>
              <strong>Follow up based on reply intent.</strong>
              <span>
                Respond appropriately to positive and neutral
                replies; respect negative replies and opt-outs.
              </span>
            </li>

            <li>
              <strong>Make booking friction low.</strong>
              <span>
                Include the client's configured booking link
                when relevant and track confirmed bookings.
              </span>
            </li>
          </ol>
        </section>

        <section className="report-section report-usage-section">
          <div className="report-section-title">
            <span>07</span>
            <div>
              <h3>Usage & Plan Allowances</h3>
              <p>
                Customer-facing allowance usage only. Internal
                AI/API cost caps are intentionally excluded.
              </p>
            </div>
          </div>

          <div className="report-usage-grid">
            <div>
              <span>Plan</span>
              <strong>
                {reportType === "pilot"
                  ? "Starter trial"
                  : selectedPlan || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Team members allowed</span>
              <strong>{quota.users}</strong>
            </div>

            <div>
              <span>Prospect research allowance</span>
              <strong>{quota.prospects.toLocaleString()}</strong>
            </div>

            <div>
              <span>Decision-maker search allowance</span>
              <strong>{quota.dm.toLocaleString()}</strong>
            </div>

            <div>
              <span>Email allowance</span>
              <strong>{quota.emails.toLocaleString()}</strong>
            </div>
          </div>

          <p className="report-small-note">
            Allowances are plan references for this prototype,
            not live metering. Production reports should show
            actual usage from server-side records.
          </p>
        </section>
      </article>
    </div>
  );
}

function Building2Fallback() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: 2,
        background: "currentColor",
        marginRight: 5,
      }}
    />
  );
}
