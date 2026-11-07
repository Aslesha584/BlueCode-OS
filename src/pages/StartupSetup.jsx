import { ArrowLeft, ArrowRight, Building2, Check, FileText, Upload, X, RefreshCw, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { Button } from "../components/UI";
import founderLogo from "../assets/founder-logo.png";

const OBJECTIVE = "Book Qualified Discovery Conversations";
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 1500 * 1024;

const formatSize = bytes => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const readFile = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
  reader.readAsDataURL(file);
});

export default function StartupSetup() {
  const navigate = useNavigate();
  const { startup, account, saveStartup, updateStartup, updateAccount } = usePrototype();
  const [form, setForm] = useState(() => ({
    ...startup,
    founderName: account?.name || "",
    website: startup.website || "",
    problemSolved: startup.problemSolved || "",
    documents: Array.isArray(startup.documents) ? startup.documents : [],
    objective: OBJECTIVE
  }));
  const [documentCategory, setDocumentCategory] = useState("Company Profile");
  const [fileError, setFileError] = useState("");
  const [replaceId, setReplaceId] = useState(null);
  const replaceInput = useRef(null);

  const update = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    if (key === "founderName") updateAccount({ name: value });
    else updateStartup({ [key]: value });
  };

  const addFiles = async event => {
    const files = Array.from(event.target.files || []);
    const replacing = event.target === replaceInput.current;
    const replacingId = replacing ? replaceId : null;
    let documents = [...form.documents];
    setFileError("");

    try {
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`${file.name} exceeds the 1 MB per-file limit in this browser prototype.`);
          continue;
        }
        const oldFile = replacingId ? documents.find(item => item.id === replacingId) : null;
        const usedBytes = documents.reduce((total, item) => total + (item.size || 0), 0) - (oldFile?.size || 0);
        if (usedBytes + file.size > MAX_TOTAL_FILE_SIZE) {
          setFileError("Company documents are limited to 1.5 MB total in this browser prototype.");
          continue;
        }
        const dataUrl = await readFile(file);
        const item = {
          id: replacingId || `company-doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: file.type || "Unknown file type",
          size: file.size,
          category: oldFile?.category || documentCategory,
          dataUrl,
          uploadedAt: new Date().toISOString()
        };
        documents = replacingId
          ? documents.map(doc => doc.id === replacingId ? item : doc)
          : [...documents, item];
      }
      update("documents", documents);
    } catch (error) {
      setFileError(error.message || "Unable to read the selected file.");
    } finally {
      event.target.value = "";
      setReplaceId(null);
    }
  };

  const removeDocument = id => update("documents", form.documents.filter(item => item.id !== id));

  const submit = event => {
    event.preventDefault();
    if (!form.founderName?.trim()) return;
    updateAccount({ name: form.founderName.trim() });
    saveStartup({ ...form, objective: OBJECTIVE });
    navigate("/icp-builder");
  };

  return <div className="setup-page">
    <div className="setup-top"><a className="brand" href="/login"><div className="brand-mark">
      <img src={founderLogo} alt="BlueCode-OS logo" />
    </div><div><strong>BlueCode-OS</strong><span>Founder onboarding</span></div></a><span className="step-count">STEP 1 OF 3</span></div>
    <div className="setup-progress"><span style={{ width: "33.33%" }} /></div>
    <div className="setup-container">
      <div className="setup-step-kicker"><span>01</span> YOUR STARTUP</div>
      <h1>First, tell us about your business.</h1>
      <p className="setup-intro">Share the essentials so prospect matching and outreach can use the right company context.</p>
      <div className="step-indicators">
        <div className="step-indicator active"><span>1</span><div><strong>Startup setup</strong><small>Company context</small></div></div>
        <div className="step-indicator"><span>2</span><div><strong>Define your ICP</strong><small>Target customers</small></div></div>
        <div className="step-indicator"><span>3</span><div><strong>Review & approve</strong><small>ICP draft</small></div></div>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-card-heading"><div className="section-icon"><Building2 size={19} /></div><div><h2>Company information</h2><p>Only the details needed to understand what you offer.</p></div></div>
        <div className="form-grid">
          <div className="form-field full-field">
            <label>Your full name <span>*</span></label>
            <input className="input" required value={form.founderName || ""} onChange={e => update("founderName", e.target.value)} placeholder="Enter your full name" autoComplete="name" />
            <small className="field-help">We’ll use your name for your welcome message and email sign-off.</small>
          </div>
          <div className="form-field">
            <label>Company / startup name <span>*</span></label>
            <input className="input" required value={form.companyName || ""} onChange={e => update("companyName", e.target.value)} placeholder="e.g. Acme Technologies" />
          </div>
          <div className="form-field">
            <label>Company website</label>
            <input className="input" type="url" value={form.website || ""} onChange={e => update("website", e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="form-field full-field">
            <label>What does your company sell or provide? <span>*</span></label>
            <textarea className="input textarea" required rows={3} value={form.product || ""} onChange={e => update("product", e.target.value)} placeholder="Describe your product or service in a few clear sentences." />
          </div>
          <div className="form-field full-field">
            <label>What problem does your product / service solve? <span>*</span></label>
            <textarea className="input textarea" required rows={2} value={form.problemSolved || ""} onChange={e => update("problemSolved", e.target.value)} placeholder="What challenge does it help customers address?" />
          </div>
        </div>

        <div className="form-card-heading sender-email-heading">
          <div className="section-icon"><Mail size={19} /></div>
          <div><h2>Dedicated outreach email</h2><p>Connect a company-owned sender address for prospect outreach and replies through Amazon SES.</p></div>
        </div>
        <div className="ses-setup-panel">
          <div className="ses-intro">
            <strong>Use an email address on your startup’s domain</strong>
            <p>Use an inbox your team owns, such as founder@yourcompany.com, to send approved outreach and receive replies.</p>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Dedicated sender email</label>
              <input className="input" type="email" value={form.senderEmail || ""} onChange={e => update("senderEmail", e.target.value)} placeholder="founder@yourcompany.com" autoComplete="email" />
            </div>
            <div className="form-field">
              <label>Sending domain</label>
              <input className="input" value={form.sendingDomain || ""} onChange={e => update("sendingDomain", e.target.value)} placeholder="yourcompany.com" />
            </div>
          </div>
          <div className="ses-status-grid">
            <div className="ses-status-item"><span className={`ses-status-dot ${form.senderEmailVerified ? "verified" : "pending"}`} /><div><strong>Email ownership</strong><small>{form.senderEmailVerified ? "Verified" : "Verification pending"}</small></div></div>
            <div className="ses-status-item"><span className={`ses-status-dot ${form.sesDomainVerified ? "verified" : "pending"}`} /><div><strong>Domain verification</strong><small>{form.sesDomainVerified ? "Verified with Amazon SES" : "Waiting for DNS verification"}</small></div></div>
            <div className="ses-status-item"><span className={`ses-status-dot ${form.sesDkimVerified ? "verified" : "pending"}`} /><div><strong>DKIM authentication</strong><small>{form.sesDkimVerified ? "Configured" : "Waiting for DKIM records"}</small></div></div>
          </div>
          <div className="ses-guidance">
            <h3>Setup steps</h3>
            <ol>
              <li><strong>Verify your email address.</strong> We’ll send a confirmation message to the sender inbox you provide.</li>
              <li><strong>Verify your domain.</strong> Amazon SES provides a unique DNS TXT record. Add it with your domain provider, then wait for verification.</li>
              <li><strong>Enable DKIM.</strong> Add the DKIM CNAME records generated by Amazon SES to your domain’s DNS settings.</li>
            </ol>
            <p className="ses-record-placeholder">Your domain’s exact DNS records will be shown here when Amazon SES is connected.</p>
          </div>
          <div className="ses-actions">
            <button type="button" className="button button-secondary" disabled title="Available after backend integration">Verify sender email</button>
            <span>Verification becomes available when the email and Amazon SES services are connected.</span>
          </div>
        </div>

        <div className="form-card-heading supporting-doc-heading">
          <div className="section-icon"><FileText size={19} /></div>
          <div><h2>Company profile & portfolio</h2><p>Upload the documents that can support prospect research and personalized outreach.</p></div>
        </div>
        <div className="form-grid document-upload-grid">
          <div className="form-field">
            <label>Document type</label>
            <select className="input" value={documentCategory} onChange={e => setDocumentCategory(e.target.value)}>
              <option>Company Profile</option>
              <option>Portfolio</option>
              <option>Case Study</option>
              <option>Other Supporting Document</option>
            </select>
          </div>
          <div className="form-field">
            <label>Upload documents</label>
            <label className="button button-secondary upload-doc-button">
              <Upload size={19} aria-hidden="true" /><span>Choose files</span>
              <input type="file" multiple onChange={addFiles} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg" />
            </label>
          </div>
        </div>
        <div className="document-list">
          {form.documents.length === 0 && <p className="document-empty">No documents uploaded yet. Add a company profile, portfolio, case study, or supporting document when available.</p>}
          {form.documents.map(doc => <div className="document-row" key={doc.id}>
            <FileText size={18} />
            <div className="document-row-copy">
              <strong>{doc.name}</strong>
              <span>{doc.category} · {doc.type} · {formatSize(doc.size || 0)}</span>
              <small>Available for individual selection in Outreach</small>
            </div>
            <button type="button" className="document-icon-action" title={`Replace ${doc.name}`} aria-label={`Replace ${doc.name}`} onClick={() => { setReplaceId(doc.id); replaceInput.current?.click(); }}><RefreshCw size={15} /></button>
            <button type="button" className="document-icon-action remove" title={`Remove ${doc.name}`} aria-label={`Remove ${doc.name}`} onClick={() => removeDocument(doc.id)}><X size={16} /></button>
          </div>)}
        </div>
        <input ref={replaceInput} type="file" className="visually-hidden-file" onChange={addFiles} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg" />
        {fileError && <p className="file-error" role="alert">{fileError}</p>}
        <div className="form-note"><Check size={16} /> Documents are saved in this browser prototype and can be selected individually for each outreach email. No files are sent automatically.</div>
        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={() => navigate("/login")}><ArrowLeft size={16} /> Back</button>
          <Button type="submit" icon={ArrowRight}>Continue to ICP Builder</Button>
        </div>
      </form>
      <p className="privacy-note">Demo data and uploaded documents are stored in this browser only. No backend or external service is connected.</p>
    </div>
  </div>;
}
