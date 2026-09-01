import React, { useState } from 'react';
import { Truck, ShieldCheck, ExternalLink, RefreshCw, PhoneCall, Mail } from 'lucide-react';
import './CarrierDetails.css';

export const CarrierDetails: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const handleRefreshTracking = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage('Latest status updated: Parcel in transit to Cape Town Hub.');
      setTimeout(() => setRefreshMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="carrier-details-card">
      <div className="carrier-card-header">
        <div className="carrier-card-icon-wrap">
          <Truck size={20} />
        </div>
        <div className="carrier-title-block">
          <h3 className="carrier-card-title">Carrier & Dispatch Information</h3>
          <p className="carrier-card-subtitle">Official courier partner handling your shipment.</p>
        </div>
      </div>

      <div className="carrier-details-body">
        <div className="carrier-brand-row">
          <div className="carrier-brand-info">
            <span className="carrier-name">DSV Express Logistics</span>
            <span className="carrier-service-tier">Standard Express Door-to-Door</span>
          </div>
          <span className="carrier-verified-badge">
            <ShieldCheck size={14} />
            <span>Fully Insured</span>
          </span>
        </div>

        <div className="carrier-specs-grid">
          <div className="carrier-spec-box">
            <span className="spec-label">Service Level</span>
            <span className="spec-value">Priority Air Freight</span>
          </div>

          <div className="carrier-spec-box">
            <span className="spec-label">Transit Time</span>
            <span className="spec-value">2 - 4 Business Days</span>
          </div>

          <div className="carrier-spec-box">
            <span className="spec-label">Origin Hub</span>
            <span className="spec-value">Johannesburg (JHB)</span>
          </div>

          <div className="carrier-spec-box">
            <span className="spec-label">Destination Hub</span>
            <span className="spec-value">Cape Town (CPT)</span>
          </div>
        </div>

        <div className="carrier-contact-row">
          <div className="contact-chip">
            <PhoneCall size={14} className="contact-chip-icon" />
            <span>+27 11 396 9000</span>
          </div>
          <div className="contact-chip">
            <Mail size={14} className="contact-chip-icon" />
            <span>tracking@za.dsv.com</span>
          </div>
        </div>

        {refreshMessage && (
          <div className="refresh-status-banner">
            <span>{refreshMessage}</span>
          </div>
        )}

        <div className="carrier-actions-footer">
          <button
            type="button"
            className={`btn-carrier-action secondary ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefreshTracking}
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            <span>{isRefreshing ? 'Updating...' : 'Sync Status'}</span>
          </button>

          <a
            href="https://www.dsv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-carrier-action primary"
          >
            <span>Courier Portal</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
};
