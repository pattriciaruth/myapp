// src/app/models/cafe-item.ts
export interface CafeItem {
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  stockLevel: number; // 1 (low) to 5 (full)
  popular: boolean;
  comment: string;
}
