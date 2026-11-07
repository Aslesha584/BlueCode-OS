import founderLogo from "../assets/founder-logo.png";
import { useState } from "react";
import { ArrowRight, Link2, ShieldCheck, CalendarDays, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { Button } from "../components/UI";

export default function BookingSetup() {
  const navigate = useNavigate();
  const { bookingUrl, updateBookingUrl, startup } = usePrototype();
  const [link, setLink] = useState(bookingUrl || "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const validate = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !!url.hostname;
    } catch {
      return false;
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmedLink = link.trim();
    if (!validate(trimmedLink)) {
      setError("Enter a complete secure URL beginning with https://");
      return;
    }
    updateBookingUrl(trimmedLink);
    setSaved(true);
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="booking-setup-page">
      <div className="setup-top">
        <a className="brand" href="/login">
          <div className="brand-mark"><img src={founderLogo} alt="BlueCode-OS logo" /></div>
          <div><strong>BlueCode-OS</strong><span>Meeting setup</span></div>
        </a>
        <span className="step-count">REQUIRED SETUP</span>
      </div>
      <div className="setup-progress"><span style={{ width: "100%" }} /></div>

      <main className="setup-container booking-clean-container">
        <div className="setup-step-kicker"><span>04</span> MEETING BOOKING</div>
        <h1>Let interested prospects book a conversation.</h1>
        <p className="setup-intro">Add your public scheduling link so interested prospects can choose a convenient time to meet with you.</p>

        <section className="booking-clean-card" aria-labelledby="booking-link-title">
          <div className="booking-clean-heading">
            <div className="booking-clean-icon"><CalendarDays size={27} /></div>
            <div>
              <span className="booking-clean-eyebrow">YOUR SCHEDULING LINK</span>
              <h2 id="booking-link-title">Connect your booking page</h2>
              <p>Use Calendly or another scheduling service you trust. BlueCode-OS will use this link when suggesting a meeting to a prospect.</p>
            </div>
          </div>

          <div className="calendly-guide booking-calendly-guide">
            <div className="calendly-guide-heading">
              <strong>Get started with Calendly</strong>
              <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer">Visit the official Calendly website <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <form onSubmit={submit} className="booking-clean-form">
            <label className="booking-clean-label" htmlFor="booking-url">Public booking URL</label>
            <div className="input-with-icon booking-clean-input">
              <Link2 size={20} />
              <input
                id="booking-url"
                className="input"
                type="url"
                value={link}
                onChange={(e) => { setLink(e.target.value); setError(""); }}
                placeholder="https://calendly.com/your-name"
                required
              />
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <div className="booking-clean-note">
              <ShieldCheck size={19} />
              <span>Your link is saved in this browser prototype. Scheduling, availability and bookings are handled by your external booking service.</span>
            </div>
            <div className="booking-clean-actions">
              <Button type="submit" icon={ArrowRight}>Save and open dashboard</Button>
              <span> You can update this link later in Settings.</span>
            </div>
          </form>
          {saved && <p className="booking-saved"><CheckCircle2 size={16} /> Link saved.</p>}
        </section>
        <p className="privacy-note">{startup.companyName ? `Workspace: ${startup.companyName}` : "Founder workspace"}</p>
      </main>
    </div>
  );
}
