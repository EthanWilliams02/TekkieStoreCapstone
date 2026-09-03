import React from 'react';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

export const ShipmentMethodCard: React.FC = () => {
  return (
    <section className="checkout-card shipment-method-card" aria-labelledby="shipment-method-heading">
      <div className="shipment-method-header">
        <div className="shipment-method-icon-box">
          <Truck size={22} className="shipment-truck-icon" />
        </div>
        <div className="shipment-method-titles">
          <div className="shipment-title-row">
            <h2 id="shipment-method-heading" className="card-title shipment-title">
              SHIPMENT METHOD: DSV EXPRESS AIR
            </h2>
            <span className="shipment-badge">TRACKED & INSURED</span>
          </div>
          <p className="shipment-method-desc">
            Estimated Dispatch: Within 24 hours. Tracked delivery directly to your door in 3–5 business days.
          </p>
        </div>
      </div>

      <div className="shipment-features-bar">
        <div className="shipment-feature-item">
          <Clock size={14} />
          <span>Real-time SMS & Email Tracking</span>
        </div>
        <div className="shipment-feature-item">
          <ShieldCheck size={14} />
          <span>Full Transit Loss & Damage Cover</span>
        </div>
      </div>
    </section>
  );
};
