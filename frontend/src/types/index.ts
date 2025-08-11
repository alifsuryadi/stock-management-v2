// frontend/src/types/index.ts
export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: "male" | "female";
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
}

export interface Transaction {
  id: number;
  type: "stock_in" | "stock_out";
  adminId: number;
  notes?: string;
  createdAt: string;
  admin?: Admin;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transactionId: number;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface CreateTransactionDto {
  type: "stock_in" | "stock_out";
  notes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

// Login response interface
export interface LoginResponse {
  access_token: string;
  admin: Admin;
}

// API Error interface
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}
