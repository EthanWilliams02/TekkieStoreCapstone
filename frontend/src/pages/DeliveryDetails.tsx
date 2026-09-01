import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TrackingStatus } from '../components/Delivery/TrackingStatus';
import { DeliveryAddress } from '../components/Delivery/DeliveryAddress';
import { CarrierDetails } from '../components/Delivery/CarrierDetails';
import { ShipmentItems } from '../components/Delivery/ShipmentItems';
import { DeliveryDetailsCard } from '../components/profile/DeliveryDetailsCard';
import './DeliveryDetails.css';

export const DeliveryDetails: React.FC = () => {
  return (
    <div className="delivery-details-page">
      {/* OBSIDIAN HEADER SECTION */}
      <section className="delivery-header-section">
        <div className="delivery-details-container">
          <div className="delivery-header-content">
            <span className="delivery-eyebrow">Tracking & Logistics</span>
            <h1 className="delivery-main-title">DELIVERY DETAILS</h1>
            <p className="delivery-header-subtitle">
              Live tracking, courier dispatch information, destination address, and package contents for your active order.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB BAR */}
      <div className="delivery-details-container">
        <div className="delivery-breadcrumb-bar">
          <nav className="delivery-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="delivery-breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="delivery-breadcrumb-separator">/</span>
            <span className="delivery-breadcrumb-current">Delivery Details</span>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <main className="delivery-body-section">
        <div className="delivery-details-container">
          {/* ORDER META SUMMARY BAR */}
          <div className="order-meta-summary-card">
            <div className="order-meta-info-group">
              <div className="order-meta-unit">
                <span className="meta-unit-label">Order Number</span>
                <span className="meta-unit-value order-id">#TK-84920</span>
              </div>
              <div className="order-meta-unit">
                <span className="meta-unit-label">Date Placed</span>
                <span className="meta-unit-value">28 Aug 2026</span>
              </div>
              <div className="order-meta-unit">
                <span className="meta-unit-label">Estimated Delivery</span>
                <span className="meta-unit-value">03 Sep 2026</span>
              </div>
              <div className="order-meta-unit">
                <span className="meta-unit-label">Shipment Method</span>
                <span className="meta-unit-value">DSV Express Air</span>
              </div>
            </div>

            <Link to="/profile" className="btn-back-dashboard">
              <ArrowLeft size={16} />
              <span>Back to Account</span>
            </Link>
          </div>

          {/* 1. TRACKING PROGRESS STATUS */}
          <TrackingStatus />

          {/* 2. TWO-COLUMN: DELIVERY ADDRESS & CARRIER DETAILS */}
          <div className="delivery-two-col-grid">
            <DeliveryAddress />
            <CarrierDetails />
          </div>

          {/* 3. SHIPMENT ITEMS */}
          <ShipmentItems />

          {/* 4. REUSED DELIVERY & LOGISTICS OVERVIEW CARD */}
          <DeliveryDetailsCard />
        </div>
      </main>
    </div>
  );
};
