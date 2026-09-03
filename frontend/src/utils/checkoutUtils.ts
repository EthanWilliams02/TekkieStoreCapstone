/**
 * South African Provinces for Address Selection
 */
export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

/**
 * Validates card number using the Luhn Algorithm.
 */
export const validateLuhn = (cardNumberStr: string): boolean => {
  const digits = cardNumberStr.replace(/\s+/g, '');
  if (!digits || digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (isNaN(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Detects card brand based on card number prefix.
 */
export const detectCardType = (cardNumberStr: string): 'visa' | 'mastercard' | 'unknown' => {
  const clean = cardNumberStr.replace(/\s+/g, '');
  if (!clean) return 'unknown';

  if (/^4/.test(clean)) {
    return 'visa';
  }

  // Mastercard: 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(clean)) {
    return 'mastercard';
  }

  return 'unknown';
};
