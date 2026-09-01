import React, { useState } from 'react';
import { Check, Clock, Truck, Package, MapPin, Copy, CheckCircle2 } from 'lucide-react';
import './TrackingStatus.css';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ReactNode;
}

export const TrackingStatus: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const trackingNumber = 'DSV-ZA-99482710';

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps: TrackingStep[] = [
    {
      id: 'step-1',
      title: 'Order Confirmed',
      description: 'Order placed & payment verified successfully.',
      date: '28 Aug 2026',
      time: '10:15 AM',
      location: 'Tekkie Store Online Vault, JHB',
      status: 'completed',
      icon: <Check size={16} />,
    },
    {
      id: 'step-2',
      title: 'Packed & Quality Checked',
      description: 'Shoes inspected, boxed in premium packaging, and tagged.',
      date: '29 Aug 2026',
      time: '14:30 PM',
      location: 'Central Fulfillment Hub, JHB',
      status: 'completed',
      icon: <Package size={16} />,
    },
    {
      id: 'step-3',
      title: 'Dispatched & In Transit',
      description: 'Handed over to DSV Express. Departed regional sorting facility.',
      date: '01 Sep 2026',
      time: '08:45 AM',
      location: 'Cape Town Regional Sorting Hub',
      status: 'current',
      icon: <Truck size={16} />,
    },
    {
      id: 'step-4',
      title: 'Out for Delivery',
      description: 'Assigned to courier van for final doorstep drop-off.',
      date: '03 Sep 2026',
      time: 'Est. 09:00 AM',
      location: 'Local Cape Town Delivery Depot',
      status: 'upcoming',
      icon: <Clock size={16} />,
    },
    {
      id: 'step-5',
      title: 'Delivered',
      description: 'Recipient signature and OTP confirmation required.',
      date: '03 Sep 2026',
      time: 'Est. 17:00 PM',
      location: 'Delivery Address (Cape Town)',
      status: 'upcoming',
      icon: <MapPin size={16} />,
    },
  ];

  return (
    <div className="tracking-status-card">
      <div className="tracking-status-header">
        <div className="tracking-header-left">
          <div className="tracking-badge-row">
            <span className="tracking-status-pill in-transit">
              <span className="pulse-dot" />
              IN TRANSIT
            </span>
            <span className="estimated-pill">
              Estimated Delivery: <strong>Thursday, 03 Sep 2026</strong>
            </span>
          </div>
          <h2 className="tracking-title">Live Tracking Progress</h2>
          <p className="tracking-subtitle">
            Your package is on schedule with our premium express courier network.
          </p>
        </div>

        <div className="tracking-header-right">
          <div className="tracking-number-box">
            <span className="tracking-label">Tracking Number</span>
            <div className="tracking-value-row">
              <span className="tracking-id">{trackingNumber}</span>
              <button
                type="button"
                className={`btn-copy-tracking ${copied ? 'copied' : ''}`}
                onClick={handleCopyTracking}
                title="Copy tracking number to clipboard"
                aria-label="Copy tracking number"
              >
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE PROGRESS STEPS */}
      <div className="tracking-timeline-wrapper">
        <div className="tracking-steps-container">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`tracking-step-item step-${step.status}`}
            >
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`step-connector ${
                    step.status === 'completed' && steps[idx + 1].status !== 'upcoming'
                      ? 'connector-active'
                      : ''
                  }`}
                />
              )}

              {/* Step Circle Indicator */}
              <div className="step-circle-wrap">
                <div className="step-circle">
                  {step.icon}
                </div>
              </div>

              {/* Step Details */}
              <div className="step-content">
                <div className="step-header-meta">
                  <span className="step-time">{step.date} • {step.time}</span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
                <span className="step-location">
                  <MapPin size={12} />
                  <span>{step.location}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
