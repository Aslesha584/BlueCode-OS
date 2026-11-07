
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill } from "../components/UI";

export default function FollowUps() {
  const { prospects, outreach } = usePrototype();
  const [activeFollowUp, setActiveFollowUp] = useState(1);

  const getFollowUpCount = prospect => {
    const arrayCount = Array.isArray(prospect.followUps)
      ? prospect.followUps.length
      : 0;

    return Math.min(
      2,
      Math.max(
        arrayCount,
        Number(prospect.followUpCount) || 0,
        prospect.followUp2Sent ? 2 : prospect.followUp1Sent ? 1 : 0
      )
    );
  };

  const isStopped = prospect => {
    const status = String(prospect.status || "").toLowerCase();
    const intent = String(
      prospect.replyIntent || prospect.intent || ""
    ).toLowerCase();

    return (
      prospect.meetingBooked === true ||
      Boolean(prospect.bookingLinkSent) ||
      prospect.replyReceived === true ||
      ["not interested", "rejected", "do not contact"].includes(status) ||
      intent === "negative" ||
      status.includes("meeting booked")
    );
  };

  const queue = prospects.filter(prospect => {
    if (isStopped(prospect)) return false;
    const count = getFollowUpCount(prospect);
    const draft = outreach.find(item => item.prospectId === prospect.id);
    const stage = String(draft?.step || "").toLowerCase();
    const status = String(prospect.status || "").toLowerCase();
    return activeFollowUp === 1
      ? count === 0 && (stage === "follow-up 1" || status === "follow-up due")
      : count === 1 && (stage === "follow-up 2" || status === "follow-up 2 due");
  });

  return (
    <div>
      <PageHeader
        eyebrow="PENDING QUEUES"
        title="Follow-ups"
        description="Follow-up opportunities are identified from the conversation stage. Review the suggested message before any real delivery."
      />

      <div className="followup-banner">
        <div className="followup-banner-icon">
          <CalendarClock size={21} />
        </div>
        <div>
          <strong>Automatically identified follow-up stages</strong>
          <p>
            The workspace places eligible prospects into the first or final follow-up queue. It stops when a prospect declines or books a meeting. Actual email delivery requires a connected mailbox.
          </p>
        </div>
        <Pill tone="blue">Demo queue</Pill>
      </div>

      <section className="panel" style={{ padding: "18px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            className={`button ${
              activeFollowUp === 1 ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveFollowUp(1)}
          >
            <Mail size={16} />
            Follow-up 1
          </button>

          <button
            className={`button ${
              activeFollowUp === 2 ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveFollowUp(2)}
          >
            <Mail size={16} />
            Follow-up 2
          </button>
        </div>

        <p style={{ marginTop: "12px", marginBottom: 0 }}>
          {activeFollowUp === 1
            ? "Prospects eligible for their first follow-up."
            : "Prospects who have had Follow-up 1 and are eligible for their second follow-up."}
        </p>
      </section>

      <div className="followup-list">
        {queue.length === 0 ? (
          <section className="panel" style={{ padding: "24px" }}>
            <CheckCircle2 size={22} />
            <h3 style={{ marginTop: "12px" }}>No prospects in Follow-up {activeFollowUp}</h3>
            <p>{activeFollowUp === 1 ? "No sample conversations are currently at the first follow-up stage." : "No sample conversations are currently at the second follow-up stage."}</p>
          </section>
        ) : (
          queue.map(prospect => {
            const draft = outreach.find(
              item => item.prospectId === prospect.id
            );

            return (
              <div className="followup-row" key={prospect.id}>
                <div className="followup-status-icon">
                  <Clock3 size={19} />
                </div>

                <div className="followup-main">
                  <div className="followup-title">
                    <strong>{prospect.company}</strong>
                    <Pill tone="orange">
                      Follow-up {activeFollowUp}
                    </Pill>
                  </div>

                  <p>
                    {activeFollowUp === 1
                      ? "Suggested next step: send a brief, relevant follow-up after the initial outreach window."
                      : "Suggested final touch: refer to the earlier conversation and close the loop respectfully."}
                  </p>

                  <div className="followup-sub">
                    <span>
                      <Mail size={14} />
                      {draft?.subject || `Suggested follow-up · Step ${activeFollowUp}`}
                    </span>
                    <span>
                      {prospect.person} · {prospect.role}
                    </span>
                  </div>
                </div>

                <div className="followup-actions">
                  <Link className="button button-secondary" to={`/prospects/${prospect.id}`}>
                    <ArrowRight size={15} />
                    View prospect
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="info-strip">
        <Clock3 size={18} />
        <p>
          <strong>Automation preview:</strong> the due queue is generated from local demo statuses. Real scheduled sending needs a connected mailbox and backend automation.
        </p>
      </div>
    </div>
  );
}
