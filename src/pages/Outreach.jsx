
import {
  CheckCircle2,
  Clipboard,
  Mail,
  Send,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  MessageCircle,
  Ban,
  BrainCircuit,
  Inbox,
  Clock3,
  FileText,
  Paperclip,
  Upload,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePrototype } from "../context/PrototypeContext";
import { useSearchParams } from "react-router-dom";
import { PageHeader, Pill } from "../components/UI";

const STORAGE_KEY = "aiFounderOsSelectedConversation";

const formatFileSize = bytes => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

function buildInitialEmail(draft, prospect, startup, founder, selectedFiles = [], variant = 0) {
  if (!draft) return "";
  const firstName = (draft.person || "there").trim().split(/\s+/)[0];
  const company = draft.company || prospect?.company || "your team";
  const founderCompany = startup?.companyName?.trim() || "our company";
  const product = startup?.product?.trim() || "our product and service";
  const problem = startup?.problemSolved?.trim() || "the business problem we are focused on solving";
  const score = Number(prospect?.score ?? prospect?.icpFitScore ?? 0);
  const verifiedContext = prospect?.businessContextVerified === true && prospect?.businessContext
    ? `I also found this verified context about ${company}: ${prospect.businessContext}${prospect.businessContextSource ? ` Source: ${prospect.businessContextSource}.` : ""}`
    : "";
  const openingOptions = [
    score >= 90
      ? `I’m reaching out because there may be a possible fit between ${company} and the work we are doing at ${founderCompany}.`
      : score >= 70
        ? `I’m reaching out to explore whether our work at ${founderCompany} may be relevant to your team at ${company}.`
        : `I wanted to ask a brief question to understand whether our work at ${founderCompany} could be relevant to ${company}.`,
    `I wanted to introduce myself and briefly explain why I thought a conversation with ${company} could be worthwhile.`,
    `I’m contacting you to see whether the challenge we focus on at ${founderCompany} is relevant to any current priorities at ${company}.`
  ];
  const opening = openingOptions[variant % openingOptions.length];
  const evidenceParagraph = verifiedContext
    ? `${verifiedContext}\n\n`
    : `I don’t want to assume that this is a current priority or that your team is experiencing this challenge. I would rather check whether it is relevant before making that assumption.\n\n`;
  const valueOptions = [
    score >= 90
      ? `If this is an area your team is reviewing, I would be glad to explain our approach, answer your questions and understand whether it fits your requirements.`
      : `If this challenge is relevant to your team, I can share a concise overview and learn whether it is worth exploring.`,
    `I would value the chance to understand how your team approaches this today and share only the parts of our solution that may be relevant.`,
    `If this is worth exploring, I can walk you through our approach and learn what a useful outcome would look like for your team.`
  ];
  const valueParagraph = valueOptions[variant % valueOptions.length];
  const hasPortfolio = Array.isArray(startup?.documents) && startup.documents.some(file =>
    /portfolio|case study/i.test(`${file.category || ""} ${file.name || ""}`)
  );
  const proofLine = selectedFiles.length
    ? `For context, I have attached ${selectedFiles.map(file => file.name).join(", ")}.`
    : hasPortfolio
      ? "I can also share a relevant portfolio or case-study example to provide context on our work."
      : "I can share further product details or relevant examples if that would be useful.";
  return `Hi ${firstName},\n\n${opening}\n\nI’m ${founder}, reaching out from ${founderCompany}. We provide ${product}, focused on helping teams address ${problem}.\n\n${evidenceParagraph}${valueParagraph}\n\n${proofLine}\n\nWould you be open to a 20-minute qualified discovery conversation? The goal would be to understand your current priorities, share the relevant details, and determine whether there is a genuine fit. If this is not a priority, I completely understand.\n\nBest regards,\n${founder}`;
}



function getKey(item) {
  return item ? String(item.id) : "";
}

// Follow-up drafts can be retained in local storage from an earlier account.
// Keep the message unchanged, but always render its closing signature from the
// currently signed-in account.
function personalizeFollowUpSignature(body, founderName) {
  if (typeof body !== "string" || !body.trim()) return body || "";
  const signature = String(founderName || "").trim() || "Founder";
  return body.replace(
    /(\n(?:Best regards|Best|Kind regards|Regards),\s*\n)[^\n]*\s*$/i,
    `$1${signature}`
  );
}

function classifyReply(reply) {
  const text = String(reply || "").toLowerCase();

  const negativePatterns = [
    "not interested",
    "isn't something we're looking for",
    "is not something we're looking for",
    "no longer interested",
    "please don't contact",
    "do not contact",
    "remove me",
    "not a fit",
    "not looking for",
    "unsubscribe",
    "stop emailing"
  ];

  const positivePatterns = [
    "schedule a call",
    "book a meeting",
    "book a call",
    "let's meet",
    "lets meet",
    "sounds interesting",
    "interested",
    "love to learn more",
    "happy to discuss",
    "set up a meeting",
    "available next week",
    "sounds great",
    "like to learn more",
    "yes, let's do it",
    "yes lets do it",
    "can we schedule",
    "could we schedule",
    "please send your calendar",
    "please share your calendly",
    "share your calendly",
    "happy to take a call",
    "open to a call",
    "let's talk",
    "lets talk",
    "sounds good",
    "send me your availability",
    "what times are available",
    "i'd be interested",
    "i would be interested",
    "would love to connect"
  ];

  if (negativePatterns.some(pattern => text.includes(pattern))) {
    return "negative";
  }

  if (positivePatterns.some(pattern => text.includes(pattern))) {
    return "positive";
  }

  return "neutral";
}

const responseTemplates = {
  positive: [
    {
      subject: "Let's schedule a conversation",
      body: (firstName, company, url, founder, startup) => {
        const product = startup?.product?.trim() || "our solution";
        const problem = startup?.problemSolved?.trim();
        return `Hi ${firstName},

Thank you for your positive reply. I'm glad this is relevant to your team at ${company}.

I'd be happy to arrange a short discovery conversation to understand your current priorities${problem ? ` around ${problem}` : ""} and show you how ${product} may be relevant. We can also discuss your questions and decide together whether there is a useful next step.

Please use my Calendly link below to choose a convenient time:
${url}

Once you've selected a slot, Calendly will send the meeting confirmation automatically.

Looking forward to speaking with you.

Best regards,
${founder}`;
      }
    },
    {
      subject: "Great to hear from you — let's connect",
      body: (firstName, company, url, founder, startup) => {
        const product = startup?.product?.trim() || "our approach";
        return `Hi ${firstName},

Thanks for your reply. It would be great to continue the conversation with your team at ${company}.

I'd like to learn more about what you are looking to improve and share a focused walkthrough of ${product}, based on what matters to your team.

You can select a suitable time using my Calendly link:
${url}

Calendly will confirm the selected meeting time and send the calendar invitation.

Looking forward to meeting you.

Best regards,
${founder}`;
      }
    }
  ],
  neutral: [
    {
      subject: "Re: A little more information",
      body: (firstName, company, url, founder) => `Hi ${firstName},

Thanks for getting back to me.

I'd be happy to share more details about our solution and how it could be relevant to your team's needs at ${company}.

Is there a particular feature or challenge you'd like me to explain? I'll share the most relevant information.

Best,
${founder}`
    },
    {
      subject: "Re: Exploring a potential fit",
      body: (firstName, company, url, founder) => `Hi ${firstName},

Thanks for your response.

I'd be glad to explain our approach in more detail and clarify how it may be relevant to ${company}.

What would be most useful for you to understand at this stage?

Best regards,
${founder}`
    }
  ],
  negative: [
    {
      subject: "Thank you for letting me know",
      body: (firstName, company, url, founder) => `Hi ${firstName},

Thank you for letting me know. I understand, and I appreciate you taking the time to respond.

I'll close the loop here and won't send further follow-ups about this opportunity.

Wishing you and the ${company} team all the best.

Best regards,
${founder}`
    }
  ]
};

export default function Outreach() {
  const {
    outreach = [],
    updateOutreach,
    updateReplyIntent,
    markBookingLinkSentDemo,
    prospects = [],
    bookingUrl,
    account,
    startup
  } = usePrototype();

  const rawFounderName = account?.name?.trim() || "";
  const founderLooksLikeHandle = /\\d|[._-]/.test(rawFounderName);
  const founder = !rawFounderName || founderLooksLikeHandle
    ? "Founder"
    : rawFounderName;

  // Restore the last opened conversation.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedProspectId = searchParams.get("prospectId");
  const [selectedId, setSelectedId] = useState(() => {
    const requested = outreach.find(item => String(item.prospectId) === String(requestedProspectId));
    const savedId = localStorage.getItem(STORAGE_KEY);
    return getKey(requested) || (outreach.some(item => getKey(item) === savedId) ? savedId : getKey(outreach[0]));
  });

  const [copied, setCopied] = useState(false);
  const [responseVersion, setResponseVersion] = useState(0);
  const [initialEmailVersion, setInitialEmailVersion] = useState(0);
  const [sentResponses, setSentResponses] = useState({});
  const [attachmentError, setAttachmentError] = useState("");

  useEffect(() => {
    if (!requestedProspectId) return;
    const matching = outreach.find(item => String(item.prospectId) === String(requestedProspectId));
    if (matching && getKey(matching) !== selectedId) {
      setSelectedId(getKey(matching));
      localStorage.setItem(STORAGE_KEY, getKey(matching));
    }
  }, [requestedProspectId, outreach, selectedId]);

  const draft = outreach.find(item => getKey(item) === selectedId) || outreach[0];

  const prospect = draft
    ? prospects.find(item => String(item.id) === String(draft.prospectId))
    : null;

  // Use the selected prospect's own reply where available.
  const incomingReply = draft
    ? draft.incomingReply ||
      draft.replyText ||
      draft.receivedReply ||
      prospect?.incomingReply ||
      prospect?.replyText ||
      ""
    : "";
  const hasIncomingReply = Boolean(String(incomingReply).trim());
  const intent = hasIncomingReply ? classifyReply(incomingReply) : "neutral";

  useEffect(() => {
    if (!draft || !hasIncomingReply || typeof updateReplyIntent !== "function") return;

    const label = intent.charAt(0).toUpperCase() + intent.slice(1);

    if (
      String(draft.intent || "").toLowerCase() !== intent ||
      draft.replyReceived !== true
    ) {
      updateReplyIntent(draft.id, label);
    }
  }, [draft?.id, draft?.intent, draft?.replyReceived, intent, hasIncomingReply, updateReplyIntent]);

  const firstName = (draft?.person || "there").trim().split(/\s+/)[0];
  const company = draft?.company || prospect?.company || "your team";
  const email = prospect?.email || draft?.email || "No verified email available";
  // A clearly illustrative Calendly URL keeps positive-reply demo examples complete.
  // Replace it with the founder's saved booking URL when one is configured.
  const hasFounderBookingUrl = Boolean(bookingUrl?.trim());
  const savedBookingUrl = bookingUrl?.trim() || "https://calendly.com/your-name/20min";

  const options = responseTemplates[intent] || responseTemplates.neutral;
  const responseDraft = options[responseVersion % options.length];

  const responseBody = responseDraft.body(
    firstName,
    company,
    savedBookingUrl,
    founder,
    startup
  );

  const responseAlreadySent = Boolean(sentResponses[selectedId]);
  const availableDocuments = Array.isArray(startup?.documents) ? startup.documents : [];
  const selectedAttachmentIds = Array.isArray(draft?.selectedAttachments) ? draft.selectedAttachments : [];
  const extraAttachments = Array.isArray(draft?.extraAttachments) ? draft.extraAttachments : [];
  const selectedAttachmentFiles = [
    ...availableDocuments.filter(file => selectedAttachmentIds.includes(file.id)),
    ...extraAttachments.filter(file => selectedAttachmentIds.includes(file.id))
  ];

  const isInitialEmail = !draft?.step || draft.step === "Initial email";
  const subjectFocus = (startup?.problemSolved || "your team's current priorities").split(/[.!?]/)[0].slice(0, 65);
  const subjectOptions = [
    `A question about ${subjectFocus} at ${company}`,
    `Exploring a potential fit with ${company}`,
    `Could we compare notes on ${subjectFocus}?`
  ];
  const initialEmailSubject = draft?.subjectCustomized || !isInitialEmail
    ? draft.subject
    : subjectOptions[initialEmailVersion % subjectOptions.length];
  // A saved initial draft must belong to the currently signed-in account.
  // Older drafts have no ownerEmail and may contain another account's founder/company details.
  const draftBelongsToActiveAccount = Boolean(
    draft?.ownerEmail && account?.email &&
    String(draft.ownerEmail).trim().toLowerCase() === String(account.email).trim().toLowerCase()
  );
  const initialEmailBody = !isInitialEmail
    ? personalizeFollowUpSignature(draft?.body || "", founder)
    : (draft?.initialEmailCustomized && draftBelongsToActiveAccount)
      ? draft.body || ""
      : buildInitialEmail(draft, prospect, startup, founder, selectedAttachmentFiles, initialEmailVersion);

  const regenerateInitialEmail = () => {
    const nextVersion = initialEmailVersion + 1;
    const subjectOptions = [
      `A question about ${subjectFocus} at ${company}`,
      `Exploring a potential fit with ${company}`,
      `Could we compare notes on ${subjectFocus}?`
    ];
    const nextSubject = subjectOptions[nextVersion % subjectOptions.length];
    const nextBody = buildInitialEmail(draft, prospect, startup, founder, selectedAttachmentFiles, nextVersion);
    setInitialEmailVersion(nextVersion);
    setCopied(false);
    updateOutreach(draft.id, { subject: nextSubject, body: nextBody, ownerEmail: account?.email || "", subjectCustomized: true, initialEmailCustomized: true, status: "Needs review" });
  };

  const toggleAttachment = (id, checked) => {
    const next = checked
      ? [...new Set([...selectedAttachmentIds, id])]
      : selectedAttachmentIds.filter(item => item !== id);
    updateOutreach(draft.id, { selectedAttachments: next, status: "Needs review" });
  };

  const addExtraAttachments = async event => {
    const files = Array.from(event.target.files || []);
    setAttachmentError("");
    let current = [...extraAttachments];
    try {
      for (const file of files) {
        if (file.size > 512 * 1024) {
          setAttachmentError(`${file.name} exceeds the 512 KB per-file limit in this browser prototype.`);
          continue;
        }
        const currentBytes = current.reduce((sum, item) => sum + (item.size || 0), 0);
        const otherDraftBytes = outreach
          .filter(item => String(item.id) !== String(draft.id))
          .reduce((sum, item) => sum + (Array.isArray(item.extraAttachments)
            ? item.extraAttachments.reduce((inner, attachment) => inner + (attachment.size || 0), 0)
            : 0), 0);
        if (otherDraftBytes + currentBytes + file.size > 512 * 1024) {
          setAttachmentError("Additional attachments are limited to 512 KB total across this browser workspace.");
          continue;
        }
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
          reader.readAsDataURL(file);
        });
        current = [...current, {
          id: `outreach-doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          type: file.type || "Unknown file type",
          size: file.size,
          category: "Additional attachment",
          dataUrl
        }];
      }
      updateOutreach(draft.id, { extraAttachments: current, status: "Needs review" });
    } catch (error) {
      setAttachmentError(error.message || "Unable to read the selected attachment.");
    } finally {
      event.target.value = "";
    }
  };

  const removeExtraAttachment = id => {
    updateOutreach(draft.id, {
      extraAttachments: extraAttachments.filter(item => item.id !== id),
      selectedAttachments: selectedAttachmentIds.filter(item => item !== id),
      status: "Needs review"
    });
  };

  const selectConversation = (item, event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const id = getKey(item);

    // Keep the selected conversation in React state, the URL and local storage
    // so selection works consistently from both Prospects and the left list.
    setSelectedId(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* storage may be unavailable */ }
    if (item?.prospectId) setSearchParams({ prospectId: String(item.prospectId) }, { replace: true });
    setCopied(false);
    setResponseVersion(0);
    setInitialEmailVersion(0);
  };

  const copyText = async text => {
    setCopied(false);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      alert("Please select and copy the email manually.");
    }
  };

  const sendResponseDemo = () => {
    if (!hasIncomingReply) {
      alert("A response cannot be prepared until an actual incoming reply is available.");
      return;
    }
    updateOutreach(draft.id, {
      responseIntent: intent,
      responseSubject: responseDraft.subject,
      responseBody,
      responseSentDemo: true
    });

    if (intent === "positive") {
      markBookingLinkSentDemo(draft.id);
    }

    setSentResponses(current => ({
      ...current,
      [selectedId]: true
    }));
  };

  if (!draft) {
    return (
      <div>
        <PageHeader
          eyebrow="SALES ENGAGEMENT"
          title="Outreach"
          description="Manage prospect conversations and personalized email responses."
        />
        <section className="panel">
          <p>No email drafts are available yet. Create drafts from Prospects first.</p>
        </section>
      </div>
    );
  }

  const intentLabel = hasIncomingReply
    ? intent.charAt(0).toUpperCase() + intent.slice(1)
    : "Not received";
  const IntentIcon = intent === "positive"
    ? CalendarDays
    : intent === "neutral"
      ? MessageCircle
      : Ban;

  const intentTone = !hasIncomingReply
    ? "neutral"
    : intent === "positive"
      ? "green"
      : intent === "neutral"
        ? "orange"
        : "red";

  return (
    <div>
      <PageHeader
        eyebrow="SALES ENGAGEMENT"
        title="Outreach"
        description="Manage prospect emails, understand replies, and move promising conversations toward meetings."
      />

      <div className="outreach-layout">
        <section className="panel draft-list-panel">
          <div className="panel-heading">
            <div>
              <h2>Prospect conversations</h2>
              <p>{outreach.length} conversations</p>
            </div>
            <Inbox size={19} className="muted-icon" />
          </div>

          {outreach.map(item => {
            const isSelected = selectedId === getKey(item);

            return (
              <button
                type="button"
                className={`draft-list-item ${isSelected ? "draft-selected" : ""}`}
                key={item.id}
                aria-pressed={isSelected}
                aria-label={`Open email conversation with ${item.company}, ${item.person}`}
                title={`Open ${item.company} email`}
                data-conversation-id={item.id}
                onClick={event => selectConversation(item, event)}
              >
                <div className="draft-list-icon">
                  <Mail size={17} />
                </div>
                <div className="draft-list-copy">
                  <strong>{item.company}</strong>
                  <span>{item.person}</span>
                  <small>{item.status || "Outreach in progress"}</small>
                </div>
                <Pill
                  tone={
                    isSelected
                      ? "green"
                      : item.status?.toLowerCase().includes("approved")
                        ? "green"
                        : "orange"
                  }
                >
                  {isSelected ? "Open" : "View"}
                </Pill>
              </button>
            );
          })}
        </section>

        <section className="panel email-editor">
          <div className="email-editor-header">
            <div>
              <div className="eyebrow">PROSPECT CONVERSATION</div>
              <h2>{draft.company}</h2>
              <p>{draft.person}</p>
            </div>
            <Pill tone={intentTone}>Reply: {intentLabel}</Pill>
          </div>

          <div className="email-meta">
            <span>Contact</span>
            <strong>{draft.person} &lt;{email}&gt;</strong>
          </div>

          <div className="panel" style={{ marginTop: "18px", padding: "18px" }}>
            <div className="email-editor-header">
              <div>
                <div className="eyebrow">{isInitialEmail ? "INITIAL OUTREACH" : "CURRENT OUTREACH STEP"}</div>
                <h3>{isInitialEmail ? "Initial email" : draft.step}</h3>
              </div>
              <Mail size={18} />
            </div>

            <label className="field-label">Subject</label>
            <input
              className="input initial-email-subject"
              value={initialEmailSubject}
              onChange={event => updateOutreach(draft.id, { subject: event.target.value, subjectCustomized: true, status: "Needs review" })}
            />

            <label className="field-label">Complete email preview</label>
            <textarea
              className="input email-body"
              value={initialEmailBody}
              onChange={event => updateOutreach(draft.id, { body: event.target.value, ownerEmail: account?.email || "", initialEmailCustomized: true, status: "Needs review" })}
              rows={12}
            />

            {isInitialEmail && <div className="outreach-attachments">
              <div className="outreach-attachments-heading">
                <div><strong><Paperclip size={16} /> Attachments for this prospect</strong><span>Select only the documents relevant to this email. Nothing is attached automatically.</span></div>
                <label className="button button-secondary attachment-upload-button">
                  <Upload size={15} /> Add file
                  <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg" onChange={addExtraAttachments} />
                </label>
              </div>

              {availableDocuments.length > 0 ? (
                <div className="attachment-choice-list">
                  {availableDocuments.map(file => (
                    <label className="attachment-choice" key={file.id}>
                      <input type="checkbox" checked={selectedAttachmentIds.includes(file.id)} onChange={event => toggleAttachment(file.id, event.target.checked)} />
                      <FileText size={16} />
                      <span><strong>{file.name}</strong><small>{file.category || "Company document"} · {file.type || "File"} · {formatFileSize(file.size || 0)}</small></span>
                    </label>
                  ))}
                </div>
              ) : <p className="document-empty">No company profile or portfolio files uploaded in ICP onboarding yet.</p>}

              {extraAttachments.length > 0 && <div className="attachment-choice-list">
                {extraAttachments.map(file => (
                  <div className="attachment-choice" key={file.id}>
                    <input type="checkbox" aria-label={`Select ${file.name}`} checked={selectedAttachmentIds.includes(file.id)} onChange={event => toggleAttachment(file.id, event.target.checked)} />
                    <FileText size={16} />
                    <span><strong>{file.name}</strong><small>Additional attachment · {file.type} · {formatFileSize(file.size)}</small></span>
                    <button type="button" className="document-icon-action remove" onClick={() => removeExtraAttachment(file.id)} aria-label={`Remove ${file.name}`}><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>}

              <div className="selected-attachments-preview">
                <strong>Selected for this email ({selectedAttachmentFiles.length})</strong>
                {selectedAttachmentFiles.length
                  ? selectedAttachmentFiles.map(file => <span key={file.id}><FileText size={13} /> {file.name}</span>)
                  : <small>No attachments selected.</small>}
              </div>
              {attachmentError && <p className="file-error" role="alert">{attachmentError}</p>}
              <p className="attachment-prototype-note">Attachment selection and preview are local prototype functionality. Actual email attachment transmission requires backend integration.</p>
            </div>}

            <div className="email-editor-actions">
              {isInitialEmail && <button type="button" className="button button-secondary" onClick={regenerateInitialEmail}>
                <RefreshCw size={15} /> Regenerate email
              </button>}
              <button
                type="button"
                className="button button-secondary"
                onClick={() => copyText(`To: ${email}\nSubject: ${initialEmailSubject}\n\n${initialEmailBody}`)}
              >
                <Clipboard size={15} />
                Copy email
              </button>

              <button
                type="button"
                className="button button-primary"
                disabled={String(draft.status || "").toLowerCase().includes("approved")}
                onClick={() => updateOutreach(draft.id, {
                  subject: initialEmailSubject,
                  body: initialEmailBody,
                  subjectCustomized: true,
                  initialEmailCustomized: true,
                  status: "Approved (demo)"
                })}
              >
                <CheckCircle2 size={16} />
                {String(draft.status || "").toLowerCase().includes("approved") ? "Draft approved" : "Approve draft"}
              </button>

              <button
                type="button"
                className="button button-secondary"
                disabled
                title="Connect an email provider to enable sending"
              >
                <Send size={15} />
                Send email (connect mailbox)
              </button>

            </div>
          </div>

          {hasIncomingReply ? <>
            <section className="panel reply-panel" style={{ marginTop: "18px", padding: "18px" }}>
              {intent === "positive" && <div className="positive-intent-banner" role="status"><CheckCircle2 size={17} /><span><strong>Positive intent detected</strong><small>This prospect is open to a conversation. The suggested next step is a personalized meeting invitation with your Calendly booking link.</small></span></div>}
              <div className="email-editor-header">
                <div><div className="eyebrow">INCOMING EMAIL</div><h3><Inbox size={18} style={{ verticalAlign: "middle", marginRight: "6px" }} />Prospect’s reply</h3></div>
                <Pill tone={intentTone}>{intentLabel} reply</Pill>
              </div>
              <div className="email-meta"><span>From</span><strong>{draft.person} &lt;{email}&gt;</strong></div>
              <div className="email-meta"><span>Subject</span><strong>Re: {draft.subject}</strong></div>
              <div className="incoming-reply-body">{incomingReply}</div>
              <div className="draft-context" style={{ marginTop: "14px" }}><BrainCircuit size={17} /><span><strong>Reply analysis:</strong> This sample reply is classified as {intentLabel.toLowerCase()}.</span></div>
            </section>

            <section className="panel reply-panel" style={{ marginTop: "18px", padding: "18px" }}>
              <div className="email-editor-header">
                <div><div className="eyebrow">REPLY RESPONSE DRAFT</div><h3><IntentIcon size={19} style={{ verticalAlign: "middle", marginRight: "6px" }} />{intent === "positive" ? "Meeting-booking email" : intent === "neutral" ? "Personalized reply" : "Closing response"}</h3></div>
                <Pill tone={intentTone}>{intentLabel} reply</Pill>
              </div>
              <p>{intent === "positive" ? "The prospect has expressed interest. Review this meeting invitation." : intent === "neutral" ? "A concise response is ready based on the prospect’s question." : "This response acknowledges the decline and closes the conversation respectfully."}</p>
              <div className="email-meta"><span>To</span><strong>{draft.person} &lt;{email}&gt;</strong></div>
              <div className="email-meta"><span>Subject</span><strong>{responseDraft.subject}</strong></div>
              <label className="field-label">Email preview</label>
              <textarea className="input email-body" value={responseBody} readOnly rows={8} />
              {intent === "positive" && <div className="meeting-booking-preview" style={{ marginTop: "14px" }}><CalendarDays size={17} /><div><strong>Calendly booking link included</strong><a href={savedBookingUrl} target="_blank" rel="noreferrer">{savedBookingUrl}</a><small>{hasFounderBookingUrl ? "Using the booking URL saved in your workspace." : "Illustrative demo link — add your own Calendly URL in Booking Setup before real outreach."}</small></div><ExternalLink size={14} /></div>}
              {intent === "negative" && <div className="draft-context" style={{ marginTop: "14px" }}><Ban size={17} /><span>Further follow-ups should stop for this prospect.</span></div>}
              <div className="email-editor-actions" style={{ marginTop: "18px" }}>
                <button type="button" className="button button-secondary" onClick={() => copyText(`To: ${email}\nSubject: ${responseDraft.subject}\n\n${responseBody}`)}><Clipboard size={15} />{copied ? "Copied email" : "Copy response"}</button>
                <button type="button" className="button button-secondary" onClick={() => { setCopied(false); setResponseVersion(current => current + 1); }}><RefreshCw size={15} />Regenerate</button>
                <button type="button" className="button button-primary" disabled={responseAlreadySent} onClick={sendResponseDemo}><Send size={15} />{responseAlreadySent ? "Response recorded" : intent === "positive" ? "Record meeting invitation" : "Record response"}</button>
              </div>
              {responseAlreadySent && <div className="draft-context" style={{ marginTop: "14px" }}><CheckCircle2 size={17} /><span>Response action recorded in this demo. No real email was delivered.</span></div>}
            </section>
          </> : <div className="no-reply-card" role="status"><div className="no-reply-icon"><Inbox size={20} /></div><div><strong>No reply yet</strong><p>This prospect has not replied to the initial email in this demo. Reply details and response tools will appear here when a reply is available.</p></div></div>}

          <p className="outreach-action-note" style={{ marginTop: "16px" }}>
            <Clock3 size={13} />
            Prototype workflow · Incoming replies, classification, and sending
            are simulated. The future product will connect these steps to
            authorized email and AI services.
          </p>
        </section>
      </div>
    </div>
  );
}
