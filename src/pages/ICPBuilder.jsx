import { ArrowLeft, ArrowRight, Check, CircleHelp, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { Button } from "../components/UI";
import founderLogo from "../assets/founder-logo.png";

const OBJECTIVE = "Book Qualified Discovery Conversations";
const industries = ["B2B SaaS", "Technology", "IT Services", "FinTech", "Healthcare", "Education", "Manufacturing", "Retail", "Logistics", "Business Services", "Other"];
const roles = ["Founder", "CEO", "HR Manager", "HR Director", "Operations Manager", "COO", "Head of Operations", "Other"];

export default function ICPBuilder() {
  const navigate = useNavigate();
  const { startup, account, icp, icpDraft, updateIcpDraft, saveIcp } = usePrototype();
  const savedForm = icpDraft || icp || {};
  const [form, setForm] = useState(() => ({
    name: account?.name?.trim() || (savedForm.name && savedForm.name !== "Primary ICP" ? savedForm.name : "Primary ICP"),
    industries: Array.isArray(savedForm.industries) ? savedForm.industries : [],
    size: savedForm.size || "",
    geography: savedForm.geography || startup.geography || "India",
    roles: Array.isArray(savedForm.roles) ? savedForm.roles : [],
    painPoints: savedForm.painPoints || "",
    targetCompanyTypes: savedForm.targetCompanyTypes || "",
    objective: OBJECTIVE
  }));
  const [validationError, setValidationError] = useState("");
  const [customIndustryInput, setCustomIndustryInput] = useState(() => (savedForm.industries || []).filter(item => !industries.includes(item)).join(", "));
  const [customRoleInput, setCustomRoleInput] = useState(() => (savedForm.roles || []).filter(item => !roles.includes(item)).join(", "));

  const persist = next => {
    setForm(next);
    updateIcpDraft({
      ...next,
      objective: OBJECTIVE,
      companyDocuments: startup.documents || [],
      discoveryCriteria: {
        industry: next.industries,
        geography: next.geography,
        employeeRange: next.size,
        decisionMakerRoles: next.roles,
        targetProblem: next.painPoints,
        targetCompanyTypes: next.targetCompanyTypes,
        companyDescription: startup.product || "",
        problemSolved: startup.problemSolved || ""
      }
    });
  };
  const update = (key, value) => persist({ ...form, [key]: value });
  const toggle = (key, value) => update(key, form[key].includes(value)
    ? form[key].filter(item => item !== value)
    : [...form[key], value]);
  const parseTypedValues = value => [...new Set(String(value || "")
    .split(/[,;\n]/)
    .map(item => item.trim().replace(/\s+/g, " "))
    .filter(Boolean))];
  const updateTypedValues = (key, value) => {
    const presets = key === "industries" ? industries : roles;
    const typed = parseTypedValues(value);
    update(key, [...new Set([...form[key].filter(item => presets.includes(item)), ...typed])]);
  };

  const submit = event => {
    event.preventDefault();
    if (!form.industries.length) {
      setValidationError("Select at least one target industry.");
      return;
    }
    if (!form.roles.length) {
      setValidationError("Select at least one target decision-maker role.");
      return;
    }
    if (!form.geography.trim() || !form.painPoints.trim()) {
      setValidationError("Enter the target geography and the problem your ideal customers may be facing.");
      return;
    }
    // Commit any text still in the custom-value fields before saving the ICP.
    const finalIndustries = [...new Set([...form.industries, ...parseTypedValues(customIndustryInput)])];
    const finalRoles = [...new Set([...form.roles, ...parseTypedValues(customRoleInput)])];
    const finalIcp = {
      ...form,
      industries: finalIndustries,
      roles: finalRoles,
      name: account?.name?.trim() || form.name || "Primary ICP",
      objective: OBJECTIVE,
      companyDocuments: startup.documents || [],
      generatedAt: new Date().toISOString(),
      discoveryCriteria: {
        industry: finalIndustries,
        industries: finalIndustries,
        geography: form.geography,
        employeeRange: form.size,
        decisionMakerRoles: finalRoles,
        roles: finalRoles,
        targetProblem: form.painPoints,
        targetCompanyTypes: form.targetCompanyTypes,
        companyDescription: startup.product || "",
        problemSolved: startup.problemSolved || ""
      }
    };
    updateIcpDraft(finalIcp);
    saveIcp(finalIcp);
    navigate("/icp-review");
  };

  return <div className="setup-page">
    <div className="setup-top"><a className="brand" href="/login"><div className="brand-mark">
      <img src={founderLogo} alt="BlueCode-OS logo" />
    </div><div><strong>BlueCode-OS</strong><span>Ideal customer profile</span></div></a><span className="step-count">STEP 2 OF 3</span></div>
    <div className="setup-progress"><span style={{ width: "66.66%" }} /></div>
    <div className="setup-container wide">
      <div className="setup-step-kicker"><span>02</span> DEFINE YOUR IDEAL CUSTOMER</div>
      <h1>Who should your team focus on?</h1>
      <p className="setup-intro">Choose the industries, company size, location and decision-makers that best match your offer.</p>

      <form className="form-card" onSubmit={submit}>
        <div className="form-card-heading"><div className="section-icon"><Target size={19} /></div><div><h2>Ideal customer profile</h2><p>Only the essential criteria used to match relevant companies.</p></div></div>
        <div className="form-grid">
          <div className="form-field full-field">
            <label>Target industries <span>*</span></label>
            <div className="choice-grid">{industries.map(item => <button type="button" key={item} className={`choice-chip ${form.industries.includes(item) ? "choice-selected" : ""}`} onClick={() => toggle("industries", item)}>{form.industries.includes(item) && <Check size={14} />}{item}</button>)}</div>
            <div className="custom-add custom-values-input">
              <input className="input" value={customIndustryInput} onChange={e => { setCustomIndustryInput(e.target.value); updateTypedValues("industries", e.target.value); }} onBlur={() => { const normalized = parseTypedValues(customIndustryInput).join(", "); setCustomIndustryInput(normalized); updateTypedValues("industries", normalized); }} placeholder="Type another industry (separate multiple entries with commas)" aria-label="Additional target industries" />
            </div>
            {form.industries.filter(item => !industries.includes(item)).length > 0 && <div className="tag-wrap icp-custom-selected-values">{form.industries.filter(item => !industries.includes(item)).map(item => <span className="choice-chip choice-selected" key={item}><Check size={13} />{item}</span>)}</div>}
          </div>

          <div className="form-field">
            <label>Target geography <span>*</span></label>
            <input className="input" value={form.geography} onChange={e => update("geography", e.target.value)} placeholder="e.g. India, Bengaluru, Southeast Asia" required />
          </div>
          <div className="form-field">
            <label htmlFor="target-company-size">Target company size <span>*</span></label>
            <input id="target-company-size" className="input company-size-text" type="text" value={form.size} onChange={e => update("size", e.target.value)} placeholder="e.g. 25–75 employees, 100+ employees" required autoComplete="off" />

          </div>

          <div className="form-field full-field">
            <label>Target decision-maker roles <span>*</span></label>
            <div className="choice-grid">{roles.map(item => <button type="button" key={item} className={`choice-chip ${form.roles.includes(item) ? "choice-selected" : ""}`} onClick={() => toggle("roles", item)}>{form.roles.includes(item) && <Check size={14} />}{item}</button>)}</div>
            <div className="custom-add custom-values-input">
              <input className="input" value={customRoleInput} onChange={e => { setCustomRoleInput(e.target.value); updateTypedValues("roles", e.target.value); }} onBlur={() => { const normalized = parseTypedValues(customRoleInput).join(", "); setCustomRoleInput(normalized); updateTypedValues("roles", normalized); }} placeholder="Type another decision-maker role (use commas for multiple roles)" aria-label="Additional decision-maker roles" />
            </div>
            {form.roles.filter(item => !roles.includes(item)).length > 0 && <div className="tag-wrap icp-custom-selected-values">{form.roles.filter(item => !roles.includes(item)).map(item => <span className="choice-chip choice-selected" key={item}><Check size={13} />{item}</span>)}</div>}
          </div>

          <div className="form-field full-field">
            <label htmlFor="target-company-types">What types of companies do you want to contact as potential customers?</label>
            <textarea id="target-company-types" className="input textarea" rows={3} value={form.targetCompanyTypes} onChange={e => update("targetCompanyTypes", e.target.value)} placeholder="For example: early-stage B2B SaaS companies, manufacturing firms modernising operations, or mid-sized businesses expanding into new markets." />
            <small className="field-help">Describe your ideal customer in your own words. You can mention business model, growth stage, industry niche or buying situation.</small>
          </div>

          <div className="form-field full-field">
            <label>What problem should your target companies ideally be facing? <span>*</span></label>
            <textarea className="input textarea" rows={3} required value={form.painPoints} onChange={e => update("painPoints", e.target.value)} placeholder="Describe the business challenge your product or service can help solve." />
          </div>
        </div>

        <div className="objective-fixed"><strong>Sales objective</strong><span>{OBJECTIVE}</span></div>
        <div className="form-note"><CircleHelp size={16} /> Trigger, buying signal and intent are evaluated from prospect evidence. You do not need to fill them in here. Only evidence supported by the sample record is displayed; unverified items are clearly labelled.</div>
        {validationError && <p className="file-error" role="alert">{validationError}</p>}
        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={() => navigate("/startup-setup")}><ArrowLeft size={16} /> Back</button>
          <Button type="submit" icon={Sparkles}>Generate ICP draft</Button>
        </div>
      </form>
    </div>
  </div>;
}
