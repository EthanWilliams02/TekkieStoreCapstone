import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import {
  ShippingAddressSection,
  ShippingAddressData,
  ShippingAddressErrors,
} from '../components/checkout/ShippingAddressSection';
import {
  PaymentMethodSection,
  PaymentOption,
  CardFormData,
  CardFormErrors,
} from '../components/checkout/PaymentMethodSection';
import { ShipmentMethodCard } from '../components/checkout/ShipmentMethodCard';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';
import { detectCardType } from '../utils/checkoutUtils';
import { deliveryService } from '../services/deliveryService';
import './CheckoutPage.css';

const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_FEE = 150;
const SAVED_SHIPPING_KEY = 'tekkie_store_saved_shipping';
const SAVED_PAYMENT_KEY = 'tekkie_store_saved_payment';
const SAVED_METHOD_KEY = 'tekkie_store_saved_payment_method';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, clearCart } = useCart();
  const { createOrder, refreshOrders } = useOrder();
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user || !user.customerId) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Shipping Form State (Restores previously saved shipping details if available)
  const [shippingData, setShippingData] = useState<ShippingAddressData>(() => {
    try {
      const saved = localStorage.getItem(SAVED_SHIPPING_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved shipping address', e);
    }
    return {
      fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      phone: user?.phone || '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
    };
  });
  const [shippingErrors, setShippingErrors] = useState<ShippingAddressErrors>({});
  const [shippingTouched, setShippingTouched] = useState<Record<string, boolean>>({});

  // Payment Form State (Restores previously saved payment details if available)
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>(() => {
    try {
      const saved = localStorage.getItem(SAVED_METHOD_KEY);
      if (saved === 'card' || saved === 'eft') return saved;
    } catch {
      // fallback
    }
    return 'card';
  });

  const [cardData, setCardData] = useState<CardFormData>(() => {
    try {
      const saved = localStorage.getItem(SAVED_PAYMENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved payment details', e);
    }
    return {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    };
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [cardTouched, setCardTouched] = useState<Record<string, boolean>>({});

  // Persist payment & shipping details in localStorage for client caching
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SHIPPING_KEY, JSON.stringify(shippingData));
    } catch (e) {
      console.error('Failed to persist shipping details', e);
    }
  }, [shippingData]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PAYMENT_KEY, JSON.stringify(cardData));
      localStorage.setItem(SAVED_METHOD_KEY, paymentMethod);
    } catch (e) {
      console.error('Failed to persist payment details', e);
    }
  }, [cardData, paymentMethod]);

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainFormRef = useRef<HTMLDivElement>(null);
  const pendingOrderRef = useRef<any | null>(null);

  // Financial Calculations: Total = Subtotal + Shipping (No VAT during checkout)
  const subtotal = cartTotal;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;

  // Real-time Shipping Validation Logic
  const validateShippingField = (
    field: keyof ShippingAddressData,
    value?: string
  ): string | undefined => {
    const trimmed = (value || '').trim();

    switch (field) {
      case 'fullName': {
        if (!trimmed) return 'Please enter your full name.';
        if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
        return undefined;
      }
      case 'phone': {
        if (!trimmed) return 'Please enter your phone number.';
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length < 10) {
          return 'Phone number must have at least 10 digits.';
        }
        return undefined;
      }
      case 'streetNumber': {
        if (!trimmed) return 'Please enter your street number.';
        // Allows digits and optional single letter suffix like 42 or 42A
        if (!/^\d+[a-zA-Z]?$/.test(trimmed)) {
          return 'Please enter a valid street number (e.g. 42 or 42A).';
        }
        return undefined;
      }
      case 'streetName': {
        if (!trimmed) return 'Please enter your street name.';
        if (trimmed.length < 2) return 'Street name must be at least 2 characters.';
        // Must not be purely numbers
        if (/^\d+$/.test(trimmed)) {
          return 'Street name cannot contain only numbers.';
        }
        return undefined;
      }
      case 'suburb': {
        if (!trimmed) return 'Please enter your suburb.';
        if (/^\d+$/.test(trimmed)) {
          return 'Suburb cannot contain only numbers.';
        }
        return undefined;
      }
      case 'city': {
        if (!trimmed) return 'Please enter your city.';
        // No numbers allowed in city
        if (/\d/.test(trimmed)) {
          return 'City cannot contain numbers.';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
          return 'Please enter a valid city name.';
        }
        return undefined;
      }
      case 'province': {
        if (!trimmed) return 'Please select your province.';
        return undefined;
      }
      case 'postalCode': {
        if (!trimmed) return 'Please enter your 4-digit postal code.';
        if (!/^\d{4}$/.test(trimmed)) {
          return 'Postal code must contain exactly 4 digits.';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  // Real-time Card Validation Logic
  const validateCardField = (
    field: keyof CardFormData,
    value: string
  ): string | undefined => {
    const trimmed = value.trim();

    switch (field) {
      case 'cardNumber': {
        if (!trimmed) return 'Please enter your card number.';
        const clean = trimmed.replace(/\s+/g, '');
        if (clean.length < 16) {
          return 'Card number must contain exactly 16 digits.';
        }
        if (clean.length > 16 || !/^\d{16}$/.test(clean)) {
          return 'Card number must contain exactly 16 digits.';
        }
        return undefined;
      }
      case 'expiryDate': {
        if (!trimmed) return 'Expiry date must be in MM/YY format.';
        if (!/^\d{2}\/\d{2}$/.test(trimmed)) {
          return 'Expiry date must be in MM/YY format.';
        }

        const [monthStr, yearStr] = trimmed.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(`20${yearStr}`, 10);

        if (month < 1 || month > 12) {
          return 'Month must be between 01 and 12.';
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          return 'This card has expired.';
        }

        return undefined;
      }
      case 'cvc': {
        if (!trimmed) return 'Please enter CVC.';
        if (!/^\d{3,4}$/.test(trimmed)) {
          return 'CVC must contain 3 digits.';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleShippingChange = (field: keyof ShippingAddressData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (shippingTouched[field]) {
      const error = validateShippingField(field, value);
      setShippingErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleShippingBlur = (field: keyof ShippingAddressData) => {
    setShippingTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateShippingField(field, shippingData[field]);
    setShippingErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleCardChange = (field: keyof CardFormData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    if (cardTouched[field]) {
      const error = validateCardField(field, value);
      setCardErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleCardBlur = (field: keyof CardFormData) => {
    setCardTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateCardField(field, cardData[field]);
    setCardErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Full Form Validation & Checkout Submission
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checking out.');
      return;
    }

    // 1. Validate All Shipping Fields
    const newShippingErrors: ShippingAddressErrors = {};
    const newShippingTouched: Record<string, boolean> = {};
    let isShippingValid = true;

    (Object.keys(shippingData) as Array<keyof ShippingAddressData>).forEach((field) => {
      newShippingTouched[field] = true;
      const error = validateShippingField(field, shippingData[field]);
      if (error) {
        newShippingErrors[field] = error;
        isShippingValid = false;
      }
    });

    setShippingTouched(newShippingTouched);
    setShippingErrors(newShippingErrors);

    // 2. Validate Payment Fields (if card)
    let isPaymentValid = true;
    const newCardErrors: CardFormErrors = {};
    const newCardTouched: Record<string, boolean> = {};

    if (paymentMethod === 'card') {
      (Object.keys(cardData) as Array<keyof CardFormData>).forEach((field) => {
        newCardTouched[field] = true;
        const error = validateCardField(field, cardData[field]);
        if (error) {
          newCardErrors[field] = error;
          isPaymentValid = false;
        }
      });
      setCardTouched(newCardTouched);
      setCardErrors(newCardErrors);
    }

    // 3. If validation fails, scroll to first error
    if (!isShippingValid || !isPaymentValid) {
      const firstInvalidElement = document.querySelector('.input-error, [aria-invalid="true"]');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInvalidElement as HTMLElement).focus();
      }
      return;
    }

    // 4. Successful validation: Create Order -> Save Delivery Details
    setIsSubmitting(true);

    try {
      const recipientName = shippingData.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Valued Customer');

      const cardClean = cardData.cardNumber.replace(/\s+/g, '');
      const cardLastFour = cardClean.slice(-4) || '4921';
      const cardBrand = detectCardType(cardData.cardNumber);

      const randomTrack = Math.floor(10000000 + Math.random() * 90000000).toString();
      const trackingNumber = `DSV-ZA-${randomTrack}`;

      // 1. Create or retrieve already created Order (prevents duplicate orders on retry)
      let activeOrder = pendingOrderRef.current;
      if (!activeOrder) {
        activeOrder = await createOrder({
          items: cart,
          shippingData,
          recipientName,
          paymentMethod,
          cardLastFour,
          cardBrand,
          subtotal,
          vat: 0,
          shippingFee,
          total: finalTotal,
          trackingNumber,
        });
        pendingOrderRef.current = activeOrder;
      }

      // 2. Save DeliveryDetails linked to that Order
      const deliveryId = `DD-${activeOrder.id}`;

      // Calculate estimated delivery date: 3 business days from now
      const estDate = new Date();
      let added = 0;
      while (added < 3) {
        estDate.setDate(estDate.getDate() + 1);
        const day = estDate.getDay();
        if (day !== 0 && day !== 6) {
          added++;
        }
      }
      const estimatedDeliveryDate = estDate.toISOString().split('T')[0];

      // 3. Save DeliveryDetails with real orderId and full address including province
      await deliveryService.saveDeliveryDetails({
        deliveryId,
        order: {
          orderId: activeOrder.id,
        },
        address: {
          streetNumber: shippingData.streetNumber.trim(),
          streetName: shippingData.streetName.trim(),
          suburb: shippingData.suburb.trim(),
          city: shippingData.city.trim(),
          province: shippingData.province.trim(),
          postalCode: shippingData.postalCode.trim(),
        },
        courier: 'DSV Express Logistics',
        trackingNumber,
        estimatedDeliveryDate,
      });

      // Clear pending order reference on success
      pendingOrderRef.current = null;

      await refreshOrders();

      // Clear the cart on successful checkout
      await clearCart();
      setIsSubmitting(false);

      // Navigate to the Order Confirmation Page
      navigate(`/order-confirmation/${activeOrder.id}`);
    } catch (err: any) {
      console.error('[CheckoutPage] Checkout submission error:', err);
      alert(err?.response?.data?.message || err.message || 'Unable to finalize order and delivery details. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* OBSIDIAN CHECKOUT HEADER SECTION */}
      <section className="checkout-header-section">
        <div className="checkout-container">
          <div className="checkout-header-content">
            <span className="checkout-eyebrow">CHECKOUT & PAYMENT</span>
            <h1 className="checkout-main-title">SECURE CHECKOUT</h1>
            <p className="checkout-header-subtitle">
              Please complete your shipping address and payment details below to finalize your order.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB BAR */}
      <div className="checkout-container">
        <div className="checkout-breadcrumb-bar">
          <nav className="checkout-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="checkout-breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="checkout-breadcrumb-separator">/</span>
            <span className="checkout-breadcrumb-current">Secure Checkout</span>
          </nav>
        </div>
      </div>

      {/* MAIN CHECKOUT BODY SECTION */}
      <main className="checkout-body-section" ref={mainFormRef}>
        <div className="checkout-container">
          {/* 2-COLUMN CHECKOUT LAYOUT */}
          <div className="checkout-layout-grid">
            {/* LEFT COLUMN: Shipping + Payment + Shipment Method */}
            <div className="checkout-main-column">
              {/* Shipping Address Section */}
              <ShippingAddressSection
                formData={shippingData}
                errors={shippingErrors}
                touched={shippingTouched}
                onChange={handleShippingChange}
                onBlur={handleShippingBlur}
              />

              {/* Payment Method Section */}
              <PaymentMethodSection
                paymentMethod={paymentMethod}
                cardData={cardData}
                cardErrors={cardErrors}
                cardTouched={cardTouched}
                onPaymentMethodChange={setPaymentMethod}
                onCardChange={handleCardChange}
                onCardBlur={handleCardBlur}
              />

              {/* Shipment Method Card */}
              <ShipmentMethodCard />
            </div>

            {/* RIGHT COLUMN: Order Summary Card */}
            <div className="checkout-summary-column">
              <CheckoutOrderSummary
                cart={cart}
                cartCount={cartCount}
                subtotal={subtotal}
                shippingFee={shippingFee}
                finalTotal={finalTotal}
                isSubmitting={isSubmitting}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
