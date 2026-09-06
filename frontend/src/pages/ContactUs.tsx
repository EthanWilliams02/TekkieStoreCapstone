import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
  Tag,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import './ContactUs.css';

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full Name cannot be empty.';
        if (value.trim().length < 2) return 'Full Name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email Address cannot be empty.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return undefined;
      case 'subject':
        if (!value.trim()) return 'Subject cannot be empty.';
        return undefined;
      case 'message':
        if (!value.trim()) return 'Message cannot be empty.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters long.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (touched[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldError = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true,
    });

    // Validate all fields
    const nameErr = validateField('fullName', formData.fullName);
    const emailErr = validateField('email', formData.email);
    const subErr = validateField('subject', formData.subject);
    const msgErr = validateField('message', formData.message);

    const validationErrors: FormErrors = {
      fullName: nameErr,
      email: emailErr,
      subject: subErr,
      message: msgErr,
    };

    setErrors(validationErrors);

    // If any validation error exists, block submission
    if (nameErr || emailErr || subErr || msgErr) {
      return;
    }

    setIsSubmitting(true);

    // Simulate successful submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setTouched({});
      setErrors({});
    }, 800);
  };

  return (
    <div className="contact-page">
      {/* OBSIDIAN HEADER SECTION */}
      <section className="contact-header-section">
        <div className="contact-container">
          <div className="contact-header-content">
            <span className="contact-eyebrow">Get in Touch</span>
            <h1 className="contact-main-title">CONTACT US</h1>
            <p className="contact-header-subtitle">
              Have questions about sneaker sizing, parcel dispatch, or return procedures?
              Our dedicated customer team is here to assist your footwear journey.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB BAR */}
      <div className="contact-container">
        <div className="contact-breadcrumb-bar">
          <nav className="contact-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="contact-breadcrumb-link">Home</Link>
            <span className="contact-breadcrumb-separator">/</span>
            <span className="contact-breadcrumb-current">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="contact-body-section">
        <div className="contact-container">
          <div className="contact-layout-grid">
            
            {/* LEFT COLUMN: FORM */}
            <div className="contact-card">
              <div className="contact-card-header">
                <h2 className="contact-card-title">Send a Message</h2>
                <p className="contact-card-subtitle">
                  Fill in the details below and we will respond within 24 business hours.
                </p>
              </div>

              {/* FRIENDLY MESSAGE ON TOPIC ASSISTANCE */}
              <div className="contact-help-topics">
                <div className="contact-help-intro">
                  We are here to help you with:
                </div>
                <div className="contact-topics-tags">
                  <span className="contact-topic-tag">Orders</span>
                  <span className="contact-topic-tag">Products</span>
                  <span className="contact-topic-tag">Payments</span>
                  <span className="contact-topic-tag">Deliveries</span>
                  <span className="contact-topic-tag">Returns</span>
                  <span className="contact-topic-tag">Account Assistance</span>
                  <span className="contact-topic-tag">General Questions</span>
                </div>
              </div>

              {submitSuccess && (
                <div className="contact-success-banner" role="status">
                  <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 className="contact-success-title">Message Received!</h3>
                    <p className="contact-success-desc">
                      Thank you for contacting TekkieStore. Our customer support team has received your query and will reply via email shortly.
                    </p>
                  </div>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form-row">
                  {/* FULL NAME */}
                  <div className="contact-form-group">
                    <label htmlFor="fullName" className="contact-form-label">
                      Full Name *
                    </label>
                    <div className="contact-input-wrapper">
                      <User size={18} className="contact-input-icon" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`contact-input ${touched.fullName && errors.fullName ? 'error' : ''}`}
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(touched.fullName && errors.fullName)}
                        aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
                      />
                    </div>
                    {touched.fullName && errors.fullName && (
                      <span className="contact-error-msg" id="fullName-error">
                        <AlertCircle size={14} />
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div className="contact-form-group">
                    <label htmlFor="email" className="contact-form-label">
                      Email Address *
                    </label>
                    <div className="contact-input-wrapper">
                      <Mail size={18} className="contact-input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`contact-input ${touched.email && errors.email ? 'error' : ''}`}
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <span className="contact-error-msg" id="email-error">
                        <AlertCircle size={14} />
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* SUBJECT */}
                <div className="contact-form-group">
                  <label htmlFor="subject" className="contact-form-label">
                    Subject *
                  </label>
                  <div className="contact-input-wrapper">
                    <Tag size={18} className="contact-input-icon" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className={`contact-input ${touched.subject && errors.subject ? 'error' : ''}`}
                      placeholder="e.g. Question about order tracking or shoe sizing"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.subject && errors.subject)}
                      aria-describedby={touched.subject && errors.subject ? 'subject-error' : undefined}
                    />
                  </div>
                  {touched.subject && errors.subject && (
                    <span className="contact-error-msg" id="subject-error">
                      <AlertCircle size={14} />
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-label">
                    Message *
                  </label>
                  <div className="contact-input-wrapper">
                    <MessageSquare size={18} className="contact-input-icon textarea-icon" />
                    <textarea
                      id="message"
                      name="message"
                      className={`contact-textarea ${touched.message && errors.message ? 'error' : ''}`}
                      placeholder="Please provide as much detail as possible so we can assist you quickly..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      aria-invalid={Boolean(touched.message && errors.message)}
                      aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                    />
                  </div>
                  {touched.message && errors.message && (
                    <span className="contact-error-msg" id="message-error">
                      <AlertCircle size={14} />
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: CONTACT INFO */}
            <aside className="contact-info-col" aria-label="TekkieStore Contact Information">
              <div className="contact-info-box">
                <div className="info-box-header">
                  <div className="info-box-icon">
                    <HelpCircle size={22} />
                  </div>
                  <h2 className="info-box-title">Direct Contacts</h2>
                </div>

                <div className="info-box-list">
                  {/* EMAIL */}
                  <div className="info-item">
                    <Mail size={20} className="info-item-icon" />
                    <div className="info-item-content">
                      <span className="info-item-label">Email Support</span>
                      <span className="info-item-value">
                        <a href="mailto:support@tekkiestore.co.za">support@tekkiestore.co.za</a>
                      </span>
                      <span className="info-item-subtext">Quick response within 24 hours</span>
                    </div>
                  </div>

                  {/* PHONE / CUSTOMER SUPPORT */}
                  <div className="info-item">
                    <Phone size={20} className="info-item-icon" />
                    <div className="info-item-content">
                      <span className="info-item-label">Customer Support</span>
                      <span className="info-item-value">
                        <a href="tel:+27215550199">+27 (0) 21 555 0199</a>
                      </span>
                      <span className="info-item-subtext">Toll-free national hotline</span>
                    </div>
                  </div>

                  {/* BUSINESS HOURS */}
                  <div className="info-item">
                    <Clock size={20} className="info-item-icon" />
                    <div className="info-item-content">
                      <span className="info-item-label">Business Hours</span>
                      <span className="info-item-value">Mon – Fri: 08:00 – 17:00</span>
                      <span className="info-item-value">Sat: 09:00 – 13:00</span>
                      <span className="info-item-subtext">Sunday & Public Holidays: Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ QUICK LINK */}
              <div className="contact-faq-callout">
                <h3 className="faq-callout-title">Quick Answers</h3>
                <p className="faq-callout-desc">
                  Looking for immediate answers regarding shipping timelines, sneaker sizing conversions, or exchange rules?
                </p>
                <Link to="/faq" className="faq-callout-btn">
                  <span>Browse FAQ</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
};
