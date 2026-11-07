import { ArrowRight, Compass, ShieldCheck, Target, Eye, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import founderLogo from "../assets/founder-logo.png";

const LEGAL_VERSION = "demo-2026-11-06";
const LEGAL_DOCUMENTS = [
  { id: "terms", title: "Terms of Service", short: "Terms of Service", intro: "These demo terms describe the basic rules for using BlueCode-OS.", sections: [
    ["Using the service", "BlueCode-OS is a sales workflow and intelligence prototype. You are responsible for the accuracy of information entered into your workspace and for reviewing suggested actions before using them."],
    ["Account security", "Keep your sign-in details confidential. Do not share access with people who are not authorised to use your workspace. Notify the service team if you believe your account has been accessed without permission."],
    ["Acceptable use", "Do not use the service for unlawful, deceptive, abusive, or unauthorised activity. You must comply with applicable laws and the terms of services connected to your account."],
    ["Prototype notice", "Features, availability, integrations, and sample data may change while this product is being evaluated. These demo terms are placeholders and will be replaced with the approved legal document."],
  ]},
  { id: "privacy", title: "Privacy Policy", short: "Privacy Policy", intro: "This demo notice explains the types of information that the prototype may store.", sections: [
    ["Information entered", "The prototype may store account details, startup profile information, prospect information, preferences, and agreement records in the browser's local storage."],
    ["How information is used", "Information is used to display and operate the product experience, preserve your workspace between visits, and record the demo agreement choices you make."],
    ["Storage and security", "Browser storage is not a secure central database. Do not enter confidential, sensitive, or regulated information into this demonstration. A production version requires secure server-side storage and access controls."],
    ["Your choices", "You should only provide information you are authorised to share. The final policy will explain retention, access, deletion, contact details, and any third-party processing."],
  ]},
  { id: "ai", title: "AI Usage Disclaimer", short: "AI Usage Disclaimer", intro: "This demo disclaimer explains the limitations of AI-generated suggestions.", sections: [
    ["Suggestions are assistive", "AI-generated summaries, scores, recommendations, and messages are suggestions only. They may be incomplete, inaccurate, outdated, or unsuitable for a particular situation."],
    ["Human review required", "You must independently review and verify AI output before relying on it, sharing it, or taking action. Do not treat AI output as legal, financial, compliance, or other professional advice."],
    ["No guaranteed outcomes", "The service does not guarantee prospect accuracy, sales performance, meeting bookings, or business results."],
    ["Data handling", "Do not submit confidential or personal information unless you have the necessary rights and the production data-handling terms have been approved."],
  ]},
  { id: "email", title: "Email Outreach Authorization", short: "Email Outreach Authorization", intro: "This demo authorization sets expectations for email outreach activity configured by a workspace user.", sections: [
    ["Authority to contact", "You confirm that you are authorised to configure and manage outreach for the business and email identities you connect to the service."],
    ["Compliance responsibility", "You are responsible for ensuring that recipient data and outreach comply with applicable privacy, marketing, anti-spam, and electronic communications laws."],
    ["Review and approval", "Review recipients, sender identity, message content, and timing before sending. AI-generated content must not be sent automatically without the required review and approval."],
    ["Sender configuration", "Entering a sender email address does not itself verify a domain, establish mailbox ownership, or authorise sending. Production email delivery requires secure backend integration and provider-side verification."],
  ]},
];

const readAccounts = () => {
  try {
    const value = JSON.parse(localStorage.getItem("blueCodeLocalAccountsV1") || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
};

export default function Login() {
  const navigate = useNavigate();
  const { updateAccount, markAccountCreated, startOnboarding } = usePrototype();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [legalDocument, setLegalDocument] = useState(null);
  const [readDocs, setReadDocs] = useState({});
  const [consents, setConsents] = useState({});
  const [openedAt, setOpenedAt] = useState({});
  const allAccepted = LEGAL_DOCUMENTS.every((doc) => consents[doc.id]?.acceptedAt);
  const activeDocument = useMemo(() => LEGAL_DOCUMENTS.find((doc) => doc.id === legalDocument), [legalDocument]);

  const submit = (event) => {
    event.preventDefault(); setError(""); setNotice("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) { setError("Enter your work email address."); return; }
    const accounts = readAccounts();

    if (mode === "forgot") {
      if (newPassword.length < 6) { setError("Choose a new password with at least 6 characters."); return; }
      const accountIndex = accounts.findIndex((account) => account.email === normalizedEmail);
      if (accountIndex < 0) { setError("No local demo account was found for this email address."); return; }
      accounts[accountIndex] = { ...accounts[accountIndex], password: newPassword };
      localStorage.setItem("blueCodeLocalAccountsV1", JSON.stringify(accounts));
      setMode("signin"); setPassword(""); setNewPassword("");
      setNotice("Demo password updated in this browser. Production password recovery requires a secure email-based backend flow.");
      return;
    }

    if (password.length < 6) { setError("Enter a password with at least 6 characters."); return; }
    if (mode === "create") {
      if (!name.trim()) { setError("Enter your name to create your account."); return; }
      if (!allAccepted) { setError("Please open, read, and accept all four required documents."); return; }
      if (accounts.some((account) => account.email === normalizedEmail)) { setError("An account with this email already exists. Please sign in."); return; }
      const agreementRecords = LEGAL_DOCUMENTS.map((doc) => ({
        documentId: doc.id, documentTitle: doc.title, version: LEGAL_VERSION,
        openedAt: openedAt[doc.id] || null,
        readAt: readDocs[doc.id] || null,
        accepted: true,
        acceptedAt: consents[doc.id].acceptedAt,
      }));
      const newAccount = { name: name.trim(), email: normalizedEmail, password, legalConsents: agreementRecords };
      accounts.push(newAccount);
      localStorage.setItem("blueCodeLocalAccountsV1", JSON.stringify(accounts));
      let savedConsentRecords = {};
      try { savedConsentRecords = JSON.parse(localStorage.getItem("blueCodeLegalConsentsV1") || "{}"); } catch { savedConsentRecords = {}; }
      localStorage.setItem("blueCodeLegalConsentsV1", JSON.stringify({ ...savedConsentRecords, [normalizedEmail]: agreementRecords }));
      localStorage.setItem("blueCodeActiveSessionV1", normalizedEmail);
      updateAccount({ name: newAccount.name, email: newAccount.email }); startOnboarding(); navigate("/startup-setup"); return;
    }

    const existingAccount = accounts.find((account) => account.email === normalizedEmail && account.password === password);
    if (!existingAccount) { setError("No matching account found. Create an account first or check your email and password."); return; }
    localStorage.setItem("blueCodeActiveSessionV1", normalizedEmail);
    updateAccount({ name: existingAccount.name, email: existingAccount.email }); markAccountCreated(); navigate("/dashboard");
  };

  const switchMode = (nextMode) => { setMode(nextMode); setError(""); setNotice(""); setLegalDocument(null); };
  const openDocument = (id) => {
    setOpenedAt((current) => ({ ...current, [id]: current[id] || new Date().toISOString() }));
    setLegalDocument(id);
  };
  const toggleConsent = (doc) => {
    setConsents((current) => ({
      ...current,
      [doc.id]: current[doc.id]?.acceptedAt
        ? { acceptedAt: null }
        : { acceptedAt: new Date().toISOString() },
    }));
  };

  return (
    <main className="auth-page">
      <header className="auth-top">
        <a className="brand auth-brand" href="/login">
          <div className="brand-mark"><img src={founderLogo} alt="BlueCode-OS logo" /></div>
          <div><strong>BlueCode-OS</strong><span>Sales intelligence for founders</span></div>
        </a>
      </header>

      <div className="auth-layout">
        <section className="auth-hero">
          <div className="hero-chip"><span className="pulse-dot" />Founder-guided intelligence</div>
          <h1>Find the right customers.<br /><span>Know what to do next.</span></h1>
          <p className="auth-hero-description">Turn your ideal customer profile into a focused prospect workflow with useful insights, relevant context, and founder-approved outreach.</p>
          <div className="hero-steps">
            <div><div className="hero-step-icon"><Target size={20} /></div><span><strong>Prioritize with purpose</strong><small>Understand prospect fit and potential.</small></span></div>
            <div><div className="hero-step-icon"><Compass size={20} /></div><span><strong>Act with context</strong><small>Get clear, actionable next steps.</small></span></div>
            <div><div className="hero-step-icon"><ShieldCheck size={20} /></div><span><strong>Stay in control</strong><small>Review messages before outreach.</small></span></div>
          </div>
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-glow" />
        </section>

        <section className="auth-card-wrap">
          <div className={`auth-card ${mode === "create" ? "auth-card-create" : "auth-card-signin"} ${mode === "forgot" ? "auth-card-forgot" : ""}`}>
            {mode === "signin" && <div className="eyebrow">WELCOME BACK</div>}
            <h2>{mode === "create" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Sign in to AI Sales Copilot"}</h2>
            {mode === "signin" && <p className="auth-description">Sign in to manage your sales workflow.</p>}
            {mode === "forgot" && <p className="auth-description">Enter your account email and choose a new password for this browser demo.</p>}

            <form onSubmit={submit}>
              {mode === "create" && <><label className="field-label" htmlFor="account-name">Full name</label><input id="account-name" className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Enter your name" required /></>}
              <label className="field-label" htmlFor="account-email">Work email</label>
              <input id="account-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@company.com" required />
              {mode !== "forgot" && <><label className="field-label" htmlFor="account-password">Password</label><input id="account-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "create" ? "new-password" : "current-password"} placeholder="Enter your password" minLength={6} required /></>}
              {mode === "forgot" && <><label className="field-label" htmlFor="new-password">New password</label><input id="new-password" className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" placeholder="Enter a new password" minLength={6} required /></>}

              {mode === "create" && <div className="agreement-list">
                <div className="agreement-heading">Required agreements <span>{LEGAL_DOCUMENTS.filter((doc) => consents[doc.id]?.acceptedAt).length} of 4 accepted</span></div>
                {LEGAL_DOCUMENTS.map((doc) => {
                  const hasRead = Boolean(readDocs[doc.id]);
                  const accepted = Boolean(consents[doc.id]?.acceptedAt);
                  return <div className={`agreement-row ${accepted ? "is-accepted" : ""}`} key={doc.id}>
                    <input id={`agreement-${doc.id}`} type="checkbox" checked={accepted} disabled={!hasRead} onChange={() => toggleConsent(doc)} aria-label={`Agree to ${doc.title}`} />
                    <label htmlFor={`agreement-${doc.id}`}>I agree to the <button type="button" className="agreement-document-link" onClick={() => openDocument(doc.id)}>{doc.title}</button></label>
                    <span className={`agreement-status ${hasRead ? "read" : "unread"}`}>{accepted ? <><CheckCircle2 size={15} /> Accepted</> : hasRead ? "Read" : "Read first"}</span>
                  </div>;
                })}
                <p className="agreement-help">Open each document and scroll to the end. Its checkbox will then become available.</p>
              </div>}

              {error && <p className="auth-error" role="alert">{error}</p>}
              {notice && <p className="auth-success" role="status">{notice}</p>}
              <button className="button button-primary button-full" type="submit">{mode === "create" ? "Create account" : mode === "forgot" ? "Update password" : "Sign in"}<ArrowRight size={18} /></button>
            </form>

            {mode === "signin" && <button type="button" className="auth-reset-link" onClick={() => switchMode("forgot")}>Forgot password?</button>}
            {mode === "forgot" && <button type="button" className="auth-reset-link" onClick={() => switchMode("signin")}>Back to sign in</button>}
            {mode !== "forgot" && <p className="auth-switch">{mode === "create" ? "Already have an account?" : "New to BlueCode-OS?"} <button type="button" className="text-button" onClick={() => switchMode(mode === "create" ? "signin" : "create")}>{mode === "create" ? "Sign in" : "Create account"}</button></p>}
            {mode === "create" && <p className="agreement-storage-note">Agreement timestamps are saved in this browser for this prototype. Production audit records must be stored securely on a backend.</p>}
            {mode === "forgot" && <p className="agreement-storage-note">Prototype only: this changes the password stored locally in this browser. A production reset must use a verified, expiring email link.</p>}
          </div>
        </section>
      </div>

      {activeDocument && <div className="legal-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLegalDocument(null); }}>
        <section className="legal-modal legal-reading-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
          <button className="legal-modal-close" type="button" onClick={() => setLegalDocument(null)} aria-label="Close document">×</button>
          <div className="eyebrow">BLUECODE-OS · DEMO DOCUMENT</div>
          <h2 id="legal-modal-title">{activeDocument.title}</h2>
          <p className="legal-placeholder-copy">{activeDocument.intro}</p>
          <div className="legal-demo-warning">DEMO CONTENT — replace with the approved document before public/customer launch.</div>
          <div className="legal-reading-content" onScroll={(event) => {
            const el = event.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
              setReadDocs((current) => ({ ...current, [activeDocument.id]: current[activeDocument.id] || new Date().toISOString() }));
            }
          }}>
            {activeDocument.sections.map(([heading, copy]) => <section key={heading}><h3>{heading}</h3><p>{copy}</p></section>)}
            <p className="legal-end-marker">End of demo document</p>
          </div>
          <div className="legal-modal-actions">
            <span>{readDocs[activeDocument.id] ? "Document read — agreement checkbox is now enabled." : "Scroll through the entire document to enable its agreement checkbox."}</span>
            <button className="button button-primary" type="button" disabled={!readDocs[activeDocument.id]} onClick={() => setLegalDocument(null)}>{readDocs[activeDocument.id] ? "Continue" : "Read to the end"}</button>
          </div>
        </section>
      </div>}
    </main>
  );
}
