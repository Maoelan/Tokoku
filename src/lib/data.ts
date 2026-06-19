export type Category = {
  id: number;
  name: string;
  sort_order: number;
};

export type Product = {
  id: number;
  name: string;
  category_id: number;
  unit: string;
  stock: number;
  price_sell: number;
  image_url: string | null;
  low_stock_threshold: number;
  show_on_landing: boolean;
  is_active: boolean;
};

export const categories: Category[] = [
  { id: 1, name: 'Semua', sort_order: 1 },
  { id: 2, name: 'Sembako', sort_order: 2 },
  { id: 3, name: 'Minuman', sort_order: 3 },
  { id: 4, name: 'Snack', sort_order: 4 },
  { id: 5, name: 'Kebutuhan Rumah', sort_order: 5 },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Beras 5kg',
    category_id: 2,
    unit: 'karung',
    stock: 20,
    price_sell: 65000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 2,
    name: 'Indomie Goreng',
    category_id: 2,
    unit: 'pcs',
    stock: 50,
    price_sell: 3000,
    image_url: null,
    low_stock_threshold: 10,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 3,
    name: 'Minyak Bimoli 1L',
    category_id: 2,
    unit: 'liter',
    stock: 3,
    price_sell: 18000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 4,
    name: 'Gula Pasir 1kg',
    category_id: 2,
    unit: 'kg',
    stock: 0,
    price_sell: 15000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 5,
    name: 'Aqua 600ml',
    category_id: 3,
    unit: 'botol',
    stock: 24,
    price_sell: 3500,
    image_url: null,
    low_stock_threshold: 12,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 6,
    name: 'Teh Pucuk Harum',
    category_id: 3,
    unit: 'botol',
    stock: 12,
    price_sell: 4000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 7,
    name: 'Chitato Sapi Panggang',
    category_id: 4,
    unit: 'pcs',
    stock: 15,
    price_sell: 6000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
  {
    id: 8,
    name: 'Gas LPG 3kg',
    category_id: 5,
    unit: 'tabung',
    stock: 4,
    price_sell: 22000,
    image_url: null,
    low_stock_threshold: 5,
    show_on_landing: true,
    is_active: true,
  },
];

export type UserRole = 'admin' | 'operator';

export type User = {
  id: string;
  name: string;
  role: UserRole;
};

export type SaleItem = {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price_at_sale: number;
  subtotal: number;
  product_name?: string; // For easy UI rendering
};

export type Sale = {
  id: number;
  user_id: string;
  total_amount: number;
  total_items: number;
  notes: string;
  created_at: string;
  items: SaleItem[];
};

export const mockUsers: User[] = [
  { id: '1', name: 'Mamah', role: 'operator' },
  { id: '2', name: 'Bapak', role: 'operator' },
  { id: '3', name: 'Admin (Developer)', role: 'admin' },
];

export const mockSales: Sale[] = [
  {
    id: 1,
    user_id: '1',
    total_amount: 32000,
    total_items: 6,
    notes: '',
    created_at: new Date().toISOString(),
    items: [
      { id: 1, sale_id: 1, product_id: 2, quantity: 3, price_at_sale: 3000, subtotal: 9000 },
      { id: 2, sale_id: 1, product_id: 3, quantity: 1, price_at_sale: 18000, subtotal: 18000 },
      { id: 3, sale_id: 1, product_id: 6, quantity: 2, price_at_sale: 2500, subtotal: 5000 },
    ]
  }
];
