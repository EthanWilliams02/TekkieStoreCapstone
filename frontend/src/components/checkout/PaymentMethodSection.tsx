import React from 'react';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { CreditCard, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { detectCardType } from '../../utils/checkoutUtils';

export type PaymentOption = 'card' | 'eft';

export interface CardFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface CardFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

interface PaymentMethodSectionProps {
  paymentMethod: PaymentOption;
  cardData: CardFormData;
  cardErrors: CardFormErrors;
  cardTouched: Record<string, boolean>;
  onPaymentMethodChange: (method: PaymentOption) => void;
  onCardChange: (field: keyof CardFormData, value: string) => void;
  onCardBlur: (field: keyof CardFormData) => void;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  cardData,
  cardErrors,
  cardTouched,
  onPaymentMethodChange,
  onCardChange,
  onCardBlur,
}) => {
  const cardType = detectCardType(cardData.cardNumber);

  // Format Card Number into groups of 4 digits: "XXXX XXXX XXXX" (exactly 12 digits max)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const parts = raw.match(/.{1,4}/g) || [];
    const formatted = parts.join(' ');
    onCardChange('cardNumber', formatted);
  };

  // Format Expiry Date: "MM/YY"
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    onCardChange('expiryDate', raw);
  };

  // Format CVC: max 3 or 4 digits
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    onCardChange('cvc', raw);
  };

  return (
    <section className="checkout-card payment-card" aria-labelledby="payment-heading">
      <div className="card-header">
        <h2 id="payment-heading" className="card-title">
          <span className="card-title-icon" aria-hidden="true">💳</span>
          PAYMENT METHOD
        </h2>
      </div>

      <div className="payment-options-container" role="radiogroup" aria-labelledby="payment-heading">
        {/* OPTION 1: CREDIT / DEBIT CARD */}
        <div
          className={`payment-option-box ${paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => onPaymentMethodChange('card')}
          role="radio"
          aria-checked={paymentMethod === 'card'}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onPaymentMethodChange('card');
            }
          }}
        >
          <div className="payment-option-header">
            <div className="payment-radio-left">
              <span className={`custom-radio ${paymentMethod === 'card' ? 'checked' : ''}`} aria-hidden="true">
                {paymentMethod === 'card' && <span className="radio-dot" />}
              </span>
              <div className="payment-option-title-group">
                <span className="payment-option-title">Credit / Debit Card</span>
                <span className="payment-option-desc">Visa, Mastercard with 3D Secure 2.0</span>
              </div>
            </div>

            <div className="payment-brand-badges" aria-label="Accepted card providers">
              <div className={`brand-badge ${cardType === 'visa' ? 'active-brand' : ''}`} title="Visa">
                <FaCcVisa size={28} className="visa-icon" />
              </div>
              <div className={`brand-badge ${cardType === 'mastercard' ? 'active-brand' : ''}`} title="Mastercard">
                <FaCcMastercard size={28} className="mastercard-icon" />
              </div>
            </div>
          </div>

          {/* Expandable Card Form */}
          {paymentMethod === 'card' && (
            <div
              className="card-subform"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {/* Card Number */}
              <div className="form-group">
                <div className="label-with-badge">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number <span className="required-star">*</span>
                  </label>
                  {cardType !== 'unknown' && (
                    <span className="detected-card-pill">
                      {cardType === 'visa' ? 'Visa Detected' : 'Mastercard Detected'}
                    </span>
                  )}
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="cardNumber"
                    name="cardNumber"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    onBlur={() => onCardBlur('cardNumber')}
                    className={`form-input ${
                      cardTouched.cardNumber && cardErrors.cardNumber ? 'input-error' : ''
                    } ${
                      cardTouched.cardNumber && !cardErrors.cardNumber && cardData.cardNumber
                        ? 'input-valid'
                        : ''
                    }`}
                    aria-invalid={Boolean(cardTouched.cardNumber && cardErrors.cardNumber)}
                    aria-describedby={cardErrors.cardNumber ? 'cardNumber-error' : undefined}
                    required
                  />
                  <div className="input-end-icon">
                    {cardTouched.cardNumber && !cardErrors.cardNumber && cardData.cardNumber ? (
                      <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
                    ) : (
                      <CreditCard size={18} className="neutral-icon" aria-hidden="true" />
                    )}
                  </div>
                </div>
                {cardTouched.cardNumber && cardErrors.cardNumber && (
                  <p id="cardNumber-error" className="field-error-msg" role="alert">
                    <AlertCircle size={14} />
                    <span>{cardErrors.cardNumber}</span>
                  </p>
                )}
              </div>

              {/* Expiry Date & CVC */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date <span className="required-star">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardData.expiryDate}
                      onChange={handleExpiryChange}
                      onBlur={() => onCardBlur('expiryDate')}
                      className={`form-input ${
                        cardTouched.expiryDate && cardErrors.expiryDate ? 'input-error' : ''
                      } ${
                        cardTouched.expiryDate && !cardErrors.expiryDate && cardData.expiryDate
                          ? 'input-valid'
                          : ''
                      }`}
                      aria-invalid={Boolean(cardTouched.expiryDate && cardErrors.expiryDate)}
                      aria-describedby={cardErrors.expiryDate ? 'expiryDate-error' : undefined}
                      required
                    />
                    {cardTouched.expiryDate && !cardErrors.expiryDate && cardData.expiryDate && (
                      <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
                    )}
                  </div>
                  {cardTouched.expiryDate && cardErrors.expiryDate && (
                    <p id="expiryDate-error" className="field-error-msg" role="alert">
                      <AlertCircle size={14} />
                      <span>{cardErrors.expiryDate}</span>
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <div className="label-with-badge">
                    <label htmlFor="cvc" className="form-label">
                      CVC / CVV <span className="required-star">*</span>
                    </label>
                    <span className="cvc-hint-text">3 digits</span>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="cvc"
                      name="cvc"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                      maxLength={4}
                      value={cardData.cvc}
                      onChange={handleCvcChange}
                      onBlur={() => onCardBlur('cvc')}
                      className={`form-input ${cardTouched.cvc && cardErrors.cvc ? 'input-error' : ''} ${
                        cardTouched.cvc && !cardErrors.cvc && cardData.cvc ? 'input-valid' : ''
                      }`}
                      aria-invalid={Boolean(cardTouched.cvc && cardErrors.cvc)}
                      aria-describedby={cardErrors.cvc ? 'cvc-error' : undefined}
                      required
                    />
                    <div className="input-end-icon">
                      {cardTouched.cvc && !cardErrors.cvc && cardData.cvc ? (
                        <CheckCircle2 size={16} className="valid-icon" aria-hidden="true" />
                      ) : (
                        <ShieldCheck size={16} className="neutral-icon" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                  {cardTouched.cvc && cardErrors.cvc && (
                    <p id="cvc-error" className="field-error-msg" role="alert">
                      <AlertCircle size={14} />
                      <span>{cardErrors.cvc}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OPTION 2: INSTANT EFT */}
        <div
          className={`payment-option-box ${paymentMethod === 'eft' ? 'selected' : ''}`}
          onClick={() => onPaymentMethodChange('eft')}
          role="radio"
          aria-checked={paymentMethod === 'eft'}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onPaymentMethodChange('eft');
            }
          }}
        >
          <div className="payment-option-header">
            <div className="payment-radio-left">
              <span className={`custom-radio ${paymentMethod === 'eft' ? 'checked' : ''}`} aria-hidden="true">
                {paymentMethod === 'eft' && <span className="radio-dot" />}
              </span>
              <div className="payment-option-title-group">
                <div className="eft-title-row">
                  <span className="payment-option-title">Instant EFT (Ozow / Capitec Pay)</span>
                  <span className="zero-fees-badge">
                    <Zap size={11} />
                    ZERO FEES
                  </span>
                </div>
                <span className="payment-option-desc">Immediate clearance from your South African banking app</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'eft' && (
            <div className="eft-info-box" onClick={(e) => e.stopPropagation()}>
              <div className="eft-banks-list">
                <span className="bank-pill">Capitec Pay</span>
                <span className="bank-pill">FNB</span>
                <span className="bank-pill">Standard Bank</span>
                <span className="bank-pill">ABSA</span>
                <span className="bank-pill">Nedbank</span>
                <span className="bank-pill">TymeBank</span>
                <span className="bank-pill">Investec</span>
              </div>
              <p className="eft-instruction-text">
                When you click <strong>Place Secure Order</strong>, you will be securely redirected to authenticate and approve the payment with your banking application. No card details required.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
