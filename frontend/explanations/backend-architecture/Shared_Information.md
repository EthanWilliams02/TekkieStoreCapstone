# Shared Backend Information

## Currency and Financial Data
We have standardized on using `BigDecimal` instead of `double` for all monetary values (e.g., `totalAmount`, `subtotal`, `shippingFee`, prices). 

* **Why:** `BigDecimal` prevents precision loss and rounding errors that commonly occur when performing arithmetic operations with floating-point numbers (`double` or `float`).
* **Usage:** When asserting in tests or setting values, always use `BigDecimal.valueOf(150.50)` instead of passing a primitive `double`.
