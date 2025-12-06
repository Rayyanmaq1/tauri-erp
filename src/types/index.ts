export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cash' | 'card';
