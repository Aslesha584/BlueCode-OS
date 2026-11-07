
import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Link2,
  Save,
  ShieldCheck,
  Users,
  LockKeyhole,
  Mail,
  Search,
  Sparkles,
} from "lucide-react";

import { usePrototype } from "../context/PrototypeContext";
import { PageHeader, Pill } from "../components/UI";

const plans = [
  {
    name: "Starter",
    users: 1,
    prospects: "100",
    searches: "50",
    emails: "100",
    price: 1999,
    trialDays: 15,
    description:
      "A simple starting point for founders exploring AI-powered sales.",
  },
  {
    name: "Growth",
    users: 3,
    prospects: "500",
    searches: "250",
    emails: "500",
    price: 3999,
    trialDays: 0,
    description:
      "For a small team building a repeatable sales pipeline.",
  },
  {
    name: "Pro",
    users: 10,
    prospects: "2,000",
    searches: "1,000",
    emails: "2,000",
    price: 7999,
    trialDays: 0,
    description:
      "For teams managing a broader prospecting workflow.",
  },
];

export default function SettingsPage() {
  const {
    startup,
    updateStartup,
    bookingUrl,
    updateBookingUrl,
    account,
    updateAccount,
    selectedPlan,
    selectPlan,
  } = usePrototype();

  const [company, setCompany] = useState({ ...startup });
  const [user, setUser] = useState({ ...account });
  const [link, setLink] = useState(bookingUrl);
  const [saved, setSaved] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [checkoutNotice, setCheckoutNotice] = useState("");

  const validLink = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const save = () => {
    if (!validLink(link)) {
      setLinkError(
        "Enter a complete HTTPS booking URL before saving."
      );
      return;
    }

    setLinkError("");
    updateStartup(company);
    updateAccount(user);
    updateBookingUrl(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const choosePlan = (plan) => {
    selectPlan(plan.name);
    setCheckoutPlan(plan);
    setCheckoutNotice("");
    setPaymentMethod("card");
  };

  return (
    <div>
      <PageHeader
        eyebrow="WORKSPACE CONFIGURATION"
        title="Settings"
        description="Manage your startup, founder profile, meeting link, integrations and subscription allowances."
        action={
          <button
            className="button button-primary"
            onClick={save}
          >
            <Save size={16} />
            Save settings
          </button>
        }
      />

      {saved && (
        <div className="save-success">
          <CheckCircle2 size={17} />
          Settings saved in this browser for the demo.
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-main">
          {/* Company Profile */}
          <section className="panel settings-panel">
            <div className="settings-section-title">
              <div className="section-icon">
                <Building2 size={19} />
              </div>

              <div>
                <h2>Company profile</h2>
                <p>
                  Startup context for prospect research and
                  personalization.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Company name</label>
                <input
                  className="input"
                  value={company.companyName || ""}
                  onChange={(e) =>
                    setCompany((s) => ({
                      ...s,
                      companyName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Target geography</label>
                <select
                  className="input"
                  value={company.geography || "India"}
                  onChange={(e) =>
                    setCompany((s) => ({
                      ...s,
                      geography: e.target.value,
                    }))
                  }
                >
                  <option>India</option>
                  <option>India and Southeast Asia</option>
                  <option>North America</option>
                  <option>United Kingdom</option>
                  <option>Global</option>
                </select>
              </div>

              <div className="form-field full-field">
                <label>Product description</label>
                <textarea
                  className="input textarea"
                  rows={3}
                  value={company.product || ""}
                  onChange={(e) =>
                    setCompany((s) => ({
                      ...s,
                      product: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field full-field">
                <label>Sales objective</label>
                <input
                  className="input"
                  value="Book Qualified Discovery Conversations"
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>
          </section>

          {/* Meeting Booking Link */}
          <section className="panel settings-panel">
            <div className="settings-section-title">
              <div className="section-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <h2>Meeting booking link</h2>
                <p>
                  Required workspace setting used for meeting
                  suggestions.
                </p>
              </div>

              <Pill tone={validLink(link) ? "green" : "orange"}>
                {validLink(link) ? "Link added" : "Required"}
              </Pill>
            </div>

            <div className="form-field">
              <label>Calendly or custom booking URL</label>

              <div className="input-with-icon">
                <Link2 size={17} />

                <input
                  className="input"
                  type="url"
                  placeholder="https://calendly.com/your-name/intro"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    setLinkError("");
                  }}
                />
              </div>

              {linkError && (
                <p className="auth-error" role="alert">
                  {linkError}
                </p>
              )}

              <small className="field-help">
                Use a complete HTTPS URL. This demo saves the
                link locally; no calendar service is connected.
              </small>
            </div>

            {link && validLink(link) && (
              <div className="booking-preview">
                <CheckCircle2 size={16} />
                <span>Secure URL format looks valid.</span>

                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open booking link"
                >
                  <ArrowUpRight size={15} />
                </a>
              </div>
            )}
          </section>

          {/* Founder Profile */}
          <section className="panel settings-panel">
            <div className="settings-section-title">
              <div className="section-icon">
                <Users size={19} />
              </div>

              <div>
                <h2>Founder profile</h2>
                <p>
                  Basic details shown in your workspace.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Display name</label>
                <input
                  className="input"
                  value={user.name || ""}
                  onChange={(e) =>
                    setUser((s) => ({
                      ...s,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Work email</label>
                <input
                  className="input"
                  type="email"
                  value={user.email || ""}
                  onChange={(e) =>
                    setUser((s) => ({
                      ...s,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          </div>

        <aside className="settings-side">
          {/* Integrations */}
          <section className="panel settings-panel integration-settings-panel">
            <div className="settings-section-title integration-settings-heading">
              <div className="section-icon">
                <ShieldCheck size={19} />
              </div>
              <div>
                <h2>Integrations</h2>
                <p className="integration-intro">
                  Research services are managed centrally by Blue Code. You do not need to connect a separate data-provider account.
                </p>
              </div>
            </div>

            <div className="integration-row">
              <div className="integration-logo ai-logo">H</div>
              <div className="integration-copy">
                <strong>Hunter.io</strong>
                <span className="integration-description">
                  Used for supported business email discovery. Blue Code manages the provider connection; secure backend configuration is still being completed.
                </span>
              </div>
              <Pill tone="orange">Backend setup pending</Pill>
            </div>

            <div className="integration-row">
              <div className="integration-logo ai-logo">AI</div>
              <div className="integration-copy">
                <strong>AI intelligence</strong>
                <span className="integration-description">
                  Supports ICP interpretation, prospect-fit explanations, research summaries and next-best-action recommendations.
                </span>
              </div>
              <Pill>Prototype</Pill>
            </div>
          </section>
        </aside>
      </div>

      {/* Checkout Preview Modal */}
      {checkoutPlan && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setCheckoutPlan(null);
            }
          }}
        >
          <div
            className="modal-card checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <button
              className="modal-close"
              onClick={() => setCheckoutPlan(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="modal-icon">
              <CreditCard size={22} />
            </div>

            <div className="eyebrow">CHECKOUT PREVIEW</div>

            <h2 id="checkout-title">
              Continue with {checkoutPlan.name}
            </h2>

            <p>
              Review your selected plan and applicable GST.
              No payment will be taken in this prototype.
            </p>

            <div className="checkout-summary">
              <strong>{checkoutPlan.name}</strong>

              <span>
                {checkoutPlan.users} user
                {checkoutPlan.users > 1 ? "s" : ""} ·{" "}
                {checkoutPlan.prospects} AI prospects ·{" "}
                {checkoutPlan.searches} DM searches ·{" "}
                {checkoutPlan.emails} emails
              </span>

              {checkoutPlan.name === "Starter" && (
                <div className="checkout-trial-note">
                  <Sparkles size={15} />
                  15-day free trial. Subscription billing
                  begins after the trial, subject to the
                  configured billing terms.
                </div>
              )}

              {/* Simplified checkout pricing */}
              <div className="checkout-price-row">
                <span>Monthly subscription</span>
                <strong>
                  ₹
                  {checkoutPlan.price.toLocaleString("en-IN")}
                  /month + 18% GST
                </strong>
              </div>
            </div>

            <div className="payment-methods">
              <button
                type="button"
                className={
                  paymentMethod === "card"
                    ? "payment-method selected"
                    : "payment-method"
                }
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard size={18} />

                <span>
                  <strong>Credit card</strong>
                  <small>
                    Secure provider checkout in production
                  </small>
                </span>

                {paymentMethod === "card" && (
                  <CheckCircle2 size={16} />
                )}
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "debit"
                    ? "payment-method selected"
                    : "payment-method"
                }
                onClick={() => setPaymentMethod("debit")}
              >
                <CreditCard size={18} />

                <span>
                  <strong>Debit card</strong>
                  <small>
                    Availability depends on payment provider
                  </small>
                </span>

                {paymentMethod === "debit" && (
                  <CheckCircle2 size={16} />
                )}
              </button>
            </div>

            <div className="modal-notice">
              <LockKeyhole size={16} />
              Payment gateway and backend verification are
              not connected. Do not enter real card details
              in this demo.
            </div>

            {checkoutNotice && (
              <p className="auth-error" role="status">
                {checkoutNotice}
              </p>
            )}

            <button
              className="button button-primary button-full"
              onClick={() =>
                setCheckoutNotice(
                  "Checkout is a preview only. Configure a payment gateway and backend before accepting real payments."
                )
              }
            >
              Continue to secure checkout
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
