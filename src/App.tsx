import { useState, useEffect } from "react";
import "./App.css";
import { ProductsSection } from "./components/ProductsSection";
import { BillingSection } from "./components/BillingSection";
import { Product, CartItem, PaymentMethod } from "./types";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleCheckout = (paymentMethod: PaymentMethod) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    alert(`Payment completed via ${paymentMethod}!\nTotal: $${total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>RetailFlow ERP</h1>
      </header>
      
      <main className={`main-layout ${isWideScreen ? 'layout-row' : 'layout-column'}`}>
        <div className="products-container">
          <ProductsSection onAddToCart={handleAddToCart} />
        </div>
        
        <div className="billing-container">
          <BillingSection
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
