import React, { useState } from 'react';
import { Product } from '../types';
import productsData from '../data/products.json';

interface ProductsSectionProps {
  onAddToCart: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onAddToCart }) => {
  const [products] = useState<Product[]>(productsData as Product[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.barcode.includes(query) ||
      product.price.toString().includes(query)
    );
  });

  const handleBarcodeSearch = () => {
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      onAddToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found!');
    }
  };

  const handleBarcodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBarcodeSearch();
    }
  };

  return (
    <div className="products-section">
      <div className="products-header">
        <h2>Products</h2>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, category, barcode, or price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')} 
            className="clear-search-btn"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Barcode Section */}
      <div className="barcode-section">
        <input
          type="text"
          placeholder="Enter or scan barcode..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyPress={handleBarcodeKeyPress}
          className="barcode-input"
        />
        <button onClick={handleBarcodeSearch} className="barcode-btn">
          🔍 Scan
        </button>
      </div>

      {/* Products Grid */}
       {filteredProducts.length != 0  && (
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => onAddToCart(product)}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
       )}

      {filteredProducts.length === 0 && searchQuery.trim() && (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="clear-filter-btn"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
