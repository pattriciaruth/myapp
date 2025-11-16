import { Injectable } from '@angular/core';
import { CafeItem } from '../../models/cafe-item';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private items: CafeItem[] = [];

  getAll(): CafeItem[] {
    return [...this.items]; // return a copy
  }

  getPopular(): CafeItem[] {
    return this.items.filter(i => i.popular);
  }

  searchByName(name: string): CafeItem[] {
    const term = name.trim().toLowerCase();
    if (!term) return [];
    return this.items.filter(i => i.name.toLowerCase().indexOf(term) !== -1);
  }

  add(item: CafeItem): { ok: boolean; error?: string } {
    const exists = this.items.some(
      i => i.itemId.toLowerCase() === item.itemId.toLowerCase()
    );
    if (exists) {
      return { ok: false, error: 'Item ID must be unique.' };
    }
    this.items.push(item);
    return { ok: true };
  }

  findIndexByName(name: string): number {
    const term = name.trim().toLowerCase();
    if (!term) return -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name.toLowerCase() === term) {
        return i;
      }
    }
    return -1;
  }

  updateByName(name: string, updated: CafeItem): { ok: boolean; error?: string } {
    const index = this.findIndexByName(name);
    if (index === -1) {
      return { ok: false, error: `No item found with name "${name}".` };
    }

    // keep ItemID uniqueness
    for (let i = 0; i < this.items.length; i++) {
      if (
        i !== index &&
        this.items[i].itemId.toLowerCase() === updated.itemId.toLowerCase()
      ) {
        return {
          ok: false,
          error: 'Another item already uses this Item ID.'
        };
      }
    }

    this.items[index] = updated;
    return { ok: true };
  }

  deleteByName(name: string): { ok: boolean; error?: string } {
    const index = this.findIndexByName(name);
    if (index === -1) {
      return { ok: false, error: `No item found with name "${name}".` };
    }
    this.items.splice(index, 1);
    return { ok: true };
  }
}
