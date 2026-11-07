import { ArrowLeft, ArrowRight, CheckCircle2, Edit3, Globe2, Sparkles, Target, Users, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { Button, DemoNotice, Pill } from "../components/UI";
import founderLogo from "../assets/founder-logo.png";
export default function ICPReview() {
  const navigate = useNavigate();
  const { startup, account, icp, approveIcp } = usePrototype();
  if (!icp) return <div className="standalone"><h2>No ICP draft yet</h2><button className="button button-primary" onClick={() => navigate("/icp-builder")}>Build an ICP</button></div>;
  const industries = Array.isArray(icp.industries) && icp.industries.length
    ? icp.industries
    : (Array.isArray(icp.discoveryCriteria?.industry) ? icp.discoveryCriteria.industry : icp.discoveryCriteria?.industries || []);
  const roles = Array.isArray(icp.roles) && icp.roles.length
    ? icp.roles
    : (Array.isArray(icp.discoveryCriteria?.decisionMakerRoles) ? icp.discoveryCriteria.decisionMakerRoles : icp.discoveryCriteria?.roles || []);
  const companySize = icp.size || icp.discoveryCriteria?.employeeRange || "Not specified";
  const geography = icp.geography || icp.discoveryCriteria?.geography || "Not specified";
  const targetProblem = icp.painPoints || icp.discoveryCriteria?.targetProblem || "Not specified";
  const targetCompanyTypes = icp.targetCompanyTypes || icp.discoveryCriteria?.targetCompanyTypes || "Not specified";
  const approve = () => {
    approveIcp();
    navigate("/booking-setup");
  };
  return <div className="setup-page">
    <div className="setup-top"><a className="brand" href="/login"><div className="brand-mark">
  <img src={founderLogo} alt="BlueCode-OS logo" />
</div><div><strong>BlueCode-OS</strong><span>ICP review</span></div></a><span className="step-count">STEP 3 OF 3</span></div>
    <div className="setup-progress"><span style={{ width: "100%" }} /></div>
    <div className="setup-container wide">
      <div className="setup-step-kicker"><span>03</span> REVIEW BEFORE APPROVAL</div>
      <h1>Your proposed ideal customer profile.</h1>
      <p className="setup-intro">Review your targeting criteria. After approval, you’ll add a booking link so interested prospects can request a conversation.</p>
      <div className="generated-banner"><div className="generated-spark"><Sparkles size={21} /></div><div><strong>ICP draft prepared</strong><p>Based on your startup context and selected criteria. You remain in control of approval.</p></div><Pill tone="blue">Draft</Pill></div>
      <div className="icp-preview-card">
        <div className="icp-preview-head"><div><span className="eyebrow">PROFILE NAME</span><h2>{account?.name?.trim() || icp.name || "Primary ICP"}</h2><p>{startup.companyName || "Your startup"} · Book Qualified Discovery Conversations</p></div><button className="button button-secondary" onClick={() => navigate("/icp-builder")}><Edit3 size={15} /> Edit criteria</button></div>
        <div className="icp-preview-grid">
          <div className="icp-detail"><div className="icp-detail-icon"><Building2Icon /></div><span>INDUSTRIES</span><div className="tag-wrap">{industries.length ? industries.map(x => <Pill key={x} tone="blue">{x}</Pill>) : <span className="icp-review-empty">No industries selected</span>}</div></div>
          <div className="icp-detail"><div className="icp-detail-icon"><Users size={18} /></div><span>COMPANY SIZE</span><strong>{companySize}</strong></div>
          <div className="icp-detail"><div className="icp-detail-icon"><Globe2 size={18} /></div><span>GEOGRAPHY</span><strong>{geography}</strong></div>
          <div className="icp-detail full"><div className="icp-detail-icon"><Users size={18} /></div><span>TARGET BUYER ROLES</span><div className="tag-wrap">{roles.length ? roles.map(x => <Pill key={x}>{x}</Pill>) : <span className="icp-review-empty">No decision-maker roles selected</span>}</div></div>
          <div className="icp-detail full"><span>TARGET COMPANY TYPES</span><p>{targetCompanyTypes}</p></div>
          <div className="icp-detail full"><span>TARGET CUSTOMER PROBLEM</span><p>{targetProblem}</p></div>
          <div className="icp-detail full"><span>YOUR PRODUCT / SERVICE</span><p>{startup.product || "Not specified"}</p></div>
          <div className="icp-detail full"><span>PROBLEM YOUR PRODUCT SOLVES</span><p>{startup.problemSolved || "Not specified"}</p></div>
          <div className="icp-detail full"><span>COMPANY WEBSITE</span><p>{startup.website || "Not provided"}</p></div>
          <div className="icp-detail full"><span>SUPPORTING DOCUMENTS</span><p>{(startup.documents || []).length ? startup.documents.map(doc => doc.name).join(", ") : "No documents uploaded"}</p></div>
        </div>
        <div className="icp-review-note"><CheckCircle2 size={17} /><span>Approval makes this the active ICP for this prototype workflow. Prospect fit examples remain illustrative mock data.</span></div>
        <div className="form-actions"><button className="button button-ghost" onClick={() => navigate("/icp-builder")}><ArrowLeft size={16} /> Back to builder</button><Button onClick={approve} icon={ArrowRight}>Approve ICP & set up meeting link</Button></div>
      </div>
    </div>
  </div>;
}
function Building2Icon() { return <Target size={18} />; }
