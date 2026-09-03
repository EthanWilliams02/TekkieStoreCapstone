import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Package,
} from 'lucide-react';
import { useOrder, Order } from '../context/OrderContext';
import { formatPrice } from '../utils/formatters';
import './OrderConfirmation.css';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { activeOrder, getOrderById } = useOrder();

  // Find order by param or activeOrder, or fallback to demo order if directly navigated
  const order: Order = (orderId ? getOrderById(orderId) : null) ||
    activeOrder || {
      id: 'TK-88291',
      orderNumber: '#TK-88291',
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      estimatedArrival: 'Oct 28 - 30',
      status: 'Order Confirmed',
      items: [
        {
          id: 'item-demo-1',
          productId: 'shoe-1',
          name: 'Air Max 90 Obsidian',
          brand: 'Nike',
          price: 2499,
          size: 'UK 9',
          quantity: 1,
          image: '/hero.png',
        },
      ],
      itemsCount: 1,
      subtotal: 2499,
      shippingFee: 0,
      shippingMethod: 'DSV EXPRESS AIR',
      vat: 326,
      total: 2499,
      shippingAddress: {
        recipientName: 'Marcus Redelinghuys',
        streetNumber: '42',
        streetName: 'Sneakerhead Ave',
        suburb: 'Rosebank',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2196',
        fullAddress: '42 Sneakerhead Ave, Rosebank, Johannesburg, Gauteng, 2196',
      },
      paymentMethod: 'card',
      paymentReference: 'VISA-4921',
      trackingNumber: 'DSV-ZA-99482710',
    };

  // Printable / downloadable clean invoice
  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download or print your invoice.');
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px 8px; font-weight: 600;">${item.name} (${item.brand})<br/><span style="font-size: 12px; color: #666;">Size: ${item.size}</span></td>
          <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">${formatPrice(item.price)}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 700;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TekkieStore Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1F2937; margin: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #FD6701; padding-bottom: 20px; }
            .brand { font-size: 26px; font-weight: 900; letter-spacing: 1px; color: #0B0D14; }
            .brand span { color: #FD6701; }
            .meta { font-size: 14px; text-align: right; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            .box { background: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB; }
            .box-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6B7280; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px 8px; background: #0B0D14; color: #fff; font-size: 12px; text-transform: uppercase; }
            .totals { margin-top: 20px; width: 300px; margin-left: auto; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .grand-total { border-top: 2px solid #FD6701; padding-top: 10px; font-size: 18px; font-weight: 800; color: #FD6701; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">TEKKIE<span>STORE</span></div>
            <div class="meta">
              <strong>OFFICIAL RECEIPT</strong><br/>
              Order Ref: ${order.orderNumber}<br/>
              Date: ${order.dateFormatted}
            </div>
          </div>

          <div class="details-grid">
            <div class="box">
              <div class="box-title">Delivered To</div>
              <strong>${order.shippingAddress.recipientName}</strong><br/>
              ${order.shippingAddress.streetNumber} ${order.shippingAddress.streetName}<br/>
              ${order.shippingAddress.suburb}, ${order.shippingAddress.city}<br/>
              ${order.shippingAddress.province}, ${order.shippingAddress.postalCode}<br/>
              South Africa
            </div>
            <div class="box">
              <div class="box-title">Dispatch & Payment Details</div>
              Courier: ${order.shippingMethod}<br/>
              Tracking Ref: ${order.trackingNumber}<br/>
              Payment Method: ${order.paymentMethod === 'card' ? 'Credit / Debit Card' : 'Instant EFT'}<br/>
              Payment Ref: ${order.paymentReference}<br/>
              Estimated Arrival: ${order.estimatedArrival}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${formatPrice(order.subtotal)}</span>
            </div>
            <div class="totals-row">
              <span>Shipping (DSV Air):</span>
              <span>${order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div class="totals-row">
              <span>Estimated VAT (15% incl.):</span>
              <span>${formatPrice(order.vat)}</span>
            </div>
            <div class="totals-row grand-total">
              <span>TOTAL:</span>
              <span>${formatPrice(order.total)}</span>
            </div>
          </div>

          <div class="footer">
            &copy; 2026 SOLE Ltd. All rights reserved. Obsidian Tekkie Collection Drop.<br/>
            Thank you for shopping with TekkieStore. For support, contact support@tekkiestore.co.za
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  const handleTrackMyOrder = () => {
    navigate('/delivery-details');
  };

  const handleContinueShopping = () => {
    navigate('/catalogue');
  };

  return (
    <div className="order-confirmation-page">
      {/* 1. OBSIDIAN HERO HEADER */}
      <section className="confirmation-hero-section">
        <div className="confirmation-container">
          <div className="confirmation-hero-content">
            <span className="confirmation-eyebrow">ORDER STATUS & RECEIPT</span>
            <h1 className="confirmation-main-title">ORDER CONFIRMED</h1>
            <p className="confirmation-hero-subtitle">
              Thank you for your purchase. We've sent a confirmation email with all your order details and live tracking information.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB BAR */}
      <div className="confirmation-container">
        <div className="confirmation-breadcrumb-bar">
          <nav className="confirmation-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Order Confirmation</span>
          </nav>
        </div>
      </div>

      {/* 3. MAIN CONTENT BODY */}
      <main className="confirmation-body-section">
        <div className="confirmation-container">
          {/* 3A. HORIZONTAL ORDER INFORMATION CARD */}
          <div className="order-info-horizontal-bar" aria-label="Order summary details">
            <div className="order-info-unit">
              <span className="info-unit-label">ORDER NUMBER</span>
              <span className="info-unit-value order-num-val">{order.orderNumber}</span>
            </div>

            <div className="order-info-divider" />

            <div className="order-info-unit">
              <span className="info-unit-label">ORDER DATE</span>
              <span className="info-unit-value">{order.dateFormatted}</span>
            </div>

            <div className="order-info-divider" />

            <div className="order-info-unit">
              <span className="info-unit-label">PAYMENT REF</span>
              <span className="info-unit-value">{order.paymentReference}</span>
            </div>

            <div className="order-info-divider" />

            <div className="order-info-unit">
              <span className="info-unit-label">TOTAL AMOUNT</span>
              <span className="info-unit-value total-amount-val">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* 3B. TWO-COLUMN LAYOUT: ORDER SUMMARY (LEFT) & DELIVERY (RIGHT) */}
          <div className="confirmation-layout-grid">
            {/* LEFT COLUMN: ORDER SUMMARY & SECURITY */}
            <div className="confirmation-left-col">
              {/* Order Summary Card */}
              <div className="confirm-card order-summary-card" aria-label="Order Summary">
                <div className="confirm-card-header">
                  <h2 className="confirm-card-title">ORDER SUMMARY</h2>
                  <span className="summary-items-count-badge">
                    {order.itemsCount} {order.itemsCount === 1 ? 'ITEM' : 'ITEMS'}
                  </span>
                </div>

                {/* Purchased Products List */}
                <div className="purchased-items-list" role="list">
                  {order.items.map((item) => (
                    <div key={item.id} className="purchased-item-row" role="listitem">
                      <div className="item-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-product-thumb"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/hero.png';
                          }}
                        />
                        <span className="item-qty-tag">{item.quantity}</span>
                      </div>

                      <div className="item-main-details">
                        <h3 className="item-title">{item.name}</h3>
                        <div className="item-sub-meta">
                          <span className="item-brand">{item.brand}</span>
                          <span className="meta-bullet">•</span>
                          <span className="item-size">Size: {item.size}</span>
                        </div>
                      </div>

                      <div className="item-price-block">
                        <span className="item-price-val">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="item-price-unit">{formatPrice(item.price)} each</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-section-divider" />

                {/* Totals Breakdown */}
                <div className="order-financials-table">
                  <div className="fin-row">
                    <span className="fin-title">Subtotal</span>
                    <span className="fin-data">{formatPrice(order.subtotal)}</span>
                  </div>

                  <div className="fin-row">
                    <span className="fin-title">Shipping</span>
                    <span className="fin-data">
                      {order.shippingFee === 0 ? (
                        <span className="free-express-badge">FREE (EXPRESS AIR)</span>
                      ) : (
                        formatPrice(order.shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="fin-row vat-row">
                    <span className="fin-title-vat">Taxes (15% VAT included)</span>
                    <span className="fin-data-vat">{formatPrice(order.vat)}</span>
                  </div>

                  <div className="summary-section-divider thick" />

                  <div className="fin-row total-highlight-row">
                    <span className="final-total-label">TOTAL</span>
                    <span className="final-total-val">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* SLIM TRUST / SECURITY BAR */}
              <div className="trust-security-card" aria-label="Security and protection verification">
                <div className="trust-security-item">
                  <ShieldCheck size={16} className="security-icon" />
                  <span>3D Secure 2.0 Verified</span>
                </div>
                <div className="trust-security-separator" />
                <div className="trust-security-item">
                  <Check size={16} className="security-icon check" />
                  <span>Buyer Protection Active</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DELIVERY DETAILS & ACTIONS */}
            <div className="confirmation-right-col">
              {/* Delivery Card */}
              <div className="confirm-card delivery-info-card" aria-label="Delivery information">
                <div className="confirm-card-header">
                  <h2 className="confirm-card-title">DELIVERY</h2>
                </div>

                <div className="delivery-card-content">
                  {/* Estimated Arrival */}
                  <div className="delivery-unit arrival-unit">
                    <div className="delivery-unit-icon-wrap">
                      <Calendar size={18} />
                    </div>
                    <div className="delivery-unit-text">
                      <span className="delivery-unit-label">ESTIMATED ARRIVAL</span>
                      <span className="delivery-unit-value arrival-val">{order.estimatedArrival}</span>
                    </div>
                  </div>

                  {/* Shipping To */}
                  <div className="delivery-unit shipping-to-unit">
                    <div className="delivery-unit-icon-wrap">
                      <MapPin size={18} />
                    </div>
                    <div className="delivery-unit-text">
                      <span className="delivery-unit-label">SHIPPING TO</span>
                      <div className="delivery-address-block">
                        <strong className="recipient-name">
                          {order.shippingAddress.recipientName}
                        </strong>
                        <p className="address-line">
                          {order.shippingAddress.streetNumber} {order.shippingAddress.streetName}
                        </p>
                        <p className="address-line">
                          {order.shippingAddress.suburb}, {order.shippingAddress.city}
                        </p>
                        <p className="address-line">
                          {order.shippingAddress.province}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="address-line country">South Africa</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method Highlighted Section */}
                  <div className="delivery-method-highlight-box">
                    <div className="method-left-accent" />
                    <div className="method-box-content">
                      <div className="method-header-row">
                        <span className="method-badge-icon">
                          <Truck size={16} />
                        </span>
                        <strong className="method-title">{order.shippingMethod}</strong>
                      </div>
                      <p className="method-subtitle">
                        Estimated Dispatch within 24 hours with full tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS & PDF DOWNLOAD */}
              <div className="confirmation-actions-group">
                <button
                  type="button"
                  className="btn-track-my-order"
                  onClick={handleTrackMyOrder}
                  aria-label="Track My Order"
                >
                  <Package size={18} />
                  <span>TRACK MY ORDER</span>
                </button>

                <button
                  type="button"
                  className="btn-continue-shopping-orange"
                  onClick={handleContinueShopping}
                  aria-label="Continue Shopping"
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn-download-receipt-link"
                  onClick={handleDownloadInvoice}
                  aria-label="Download PDF Invoice or Receipt"
                >
                  <Download size={15} />
                  <span>Download PDF Invoice / Receipt</span>
                </button>
              </div>
            </div>
          </div>

          {/* CHECKOUT & CONFIRMATION SUB-FOOTER ROW */}
          <div className="confirmation-subfooter-bar">
            <p className="subfooter-copyright">
              &copy; 2026 SOLE Ltd. All rights reserved. Obsidian Tekkie Collection Drop.
            </p>
            <div className="subfooter-links">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              <span className="subfooter-sep">•</span>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              <span className="subfooter-sep">•</span>
              <a href="/shipping" target="_blank" rel="noopener noreferrer">
                Returns & Exchanges
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
