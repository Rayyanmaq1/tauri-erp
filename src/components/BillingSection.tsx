import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '../types';

interface BillingSectionProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [discount, setDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    onCheckout(selectedPayment);
  };

  return (
    <div className="billing-section">
      <div className="billing-header">
        <h2>Billing</h2>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>No items in cart</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-info">
                  <h4>{item.product.name}</h4>
                  <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-controls">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="qty-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                  <div className="cart-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals Section */}
      <div className="billing-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="discount-row">
          <label>Discount (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="discount-input"
          />
        </div>

        <div className="total-row discount-amount">
          <span>Discount Amount:</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>

        <div className="total-row grand-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="payment-options">
        <h3>Payment Method</h3>
        <div className="payment-buttons">
          <button
            className={`payment-btn ${selectedPayment === 'cash' ? 'active' : ''}`}
            onClick={() => setSelectedPayment('cash')}
          >
            💵 Cash
          </button>
          <button
            className={`payment-btn ${selectedPayment === 'card' ? 'active' : ''}`}
            onClick={() => setSelectedPayment('card')}
          >
            💳 Card
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button style={{ marginBottom: '2rem' }} onClick={handleCheckout} className="checkout-btn">
        Complete Payment (${total.toFixed(2)})
      </button>
    </div>
  );
};
