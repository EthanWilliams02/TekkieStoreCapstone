import React from 'react';
import { MapPin, Phone, Building, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './DeliveryAddress.css';

export const DeliveryAddress: React.FC = () => {
  const { user } = useAuth();
  
  const recipientName = user ? `${user.firstName} ${user.lastName}` : 'Marcus Redelinghuys';
  const recipientPhone = user?.phone || '+27 82 555 1234';

  return (
    <div className="delivery-address-card">
      <div className="delivery-card-header">
        <div className="delivery-card-icon-wrap">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="delivery-card-title">Delivery Address</h3>
          <p className="delivery-card-subtitle">Destination location for doorstep parcel drop-off.</p>
        </div>
      </div>

      <div className="address-details-body">
        <div className="recipient-row">
          <span className="recipient-name">{recipientName}</span>
          <span className="address-badge">Primary Residential</span>
        </div>

        <div className="address-lines">
          <p className="street-line">42 Kloof Street, Apartment 4B</p>
          <p className="suburb-line">Gardens, Cape Town</p>
          <p className="postal-line">8001, Western Cape, South Africa</p>
        </div>

        <div className="address-meta-list">
          <div className="address-meta-item">
            <Phone size={15} className="meta-icon" />
            <span className="meta-label">Contact Number:</span>
            <span className="meta-value">{recipientPhone}</span>
          </div>

          <div className="address-meta-item">
            <Building size={15} className="meta-icon" />
            <span className="meta-label">Delivery Type:</span>
            <span className="meta-value">Direct Doorstep Delivery</span>
          </div>
        </div>

        <div className="delivery-instructions-box">
          <Info size={16} className="instructions-icon" />
          <div className="instructions-content">
            <span className="instructions-label">Courier Note & Instructions:</span>
            <p className="instructions-text">
              Security gate code #4910. If recipient is unavailable, please leave parcel with building reception desk or call prior to delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
