import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface DeliveryDetailsCardProps {
  showActionLink?: boolean;
}

export const DeliveryDetailsCard: React.FC<DeliveryDetailsCardProps> = ({ showActionLink = false }) => {
  return (
    <div className="profile-card delivery-overview-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Delivery & Logistics</h2>
          <p className="profile-card-subtitle">
            Overview of standard dispatch schedules, courier partners, and tracking services.
          </p>
        </div>

        {showActionLink && (
          <Link to="/delivery-details" className="btn-view-live-tracking" title="View live delivery and tracking details">
            <span>View Live Tracking</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <div className="delivery-features-grid">
        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <Truck size={22} />
          </div>
          <h3 className="feature-title">Express Courier Network</h3>
          <p className="feature-desc">
            All footwear parcels are dispatched via premium insured express couriers with live SMS tracking.
          </p>
        </div>

        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <Clock size={22} />
          </div>
          <h3 className="feature-title">2 - 4 Business Days</h3>
          <p className="feature-desc">
            Main regional centers receive doorstep deliveries within 48-72 hours of dispatch verification.
          </p>
        </div>

        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <ShieldCheck size={22} />
          </div>
          <h3 className="feature-title">Signature Required</h3>
          <p className="feature-desc">
            Every shipment requires OTP or authorized signature confirmation upon drop-off for parcel safety.
          </p>
        </div>
      </div>
    </div>
  );
};
