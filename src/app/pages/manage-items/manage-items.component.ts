import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../services/inventory.service';
import { CafeItem } from '../../models/cafe-item';

@Component({
  selector: 'app-manage-items',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-items.component.html',
  styleUrl: './manage-items.component.css'
})
export class ManageItemsComponent {

  categories = ['Hot Food', 'Sweets', 'Beverage', 'Others'];

  items: CafeItem[] = [];
  searchResults: CafeItem[] = [];

  // form fields
  itemId = '';
  name = '';
  category = 'Hot Food';
  quantity = 0;
  price = 0;
  supplier = '';
  stockLevel = 1;
  popular = false;
  comment = '';

  isEditing = false;
  editName = '';

  message = '';

  constructor(private inv: InventoryService) {
    this.items = this.inv.getAll();
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => (this.message = ''), 2500);
  }

  resetForm() {
    this.itemId = '';
    this.name = '';
    this.category = 'Hot Food';
    this.quantity = 0;
    this.price = 0;
    this.supplier = '';
    this.stockLevel = 1;
    this.popular = false;
    this.comment = '';

    this.isEditing = false;
    this.editName = '';
  }

  addItem() {
    const newItem: CafeItem = {
      itemId: this.itemId,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier: this.supplier,
      stockLevel: this.stockLevel,
      popular: this.popular,
      comment: this.comment,
    };

    const result = this.inv.add(newItem);
    if (!result.ok) {
      return this.showMessage(result.error!);
    }

    this.items = this.inv.getAll();
    this.showMessage('Item added.');
    this.resetForm();
  }

  startEdit(item: CafeItem) {
    this.isEditing = true;
    this.editName = item.name;

    this.itemId = item.itemId;
    this.name = item.name;
    this.category = item.category;
    this.quantity = item.quantity;
    this.price = item.price;
    this.supplier = item.supplier;
    this.stockLevel = item.stockLevel;
    this.popular = item.popular;
    this.comment = item.comment;
  }

  saveEdit() {
    const updated: CafeItem = {
      itemId: this.itemId,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier: this.supplier,
      stockLevel: this.stockLevel,
      popular: this.popular,
      comment: this.comment,
    };

    const result = this.inv.updateByName(this.editName, updated);
    if (!result.ok) return this.showMessage(result.error!);

    this.items = this.inv.getAll();
    this.showMessage('Item updated.');
    this.resetForm();
  }

  deleteItem(name: string) {
    if (!confirm(`Delete "${name}"?`)) return;

    const result = this.inv.deleteByName(name);
    if (!result.ok) return this.showMessage(result.error!);

    this.items = this.inv.getAll();
    this.showMessage('Item deleted.');
  }

  search(term: string) {
    this.searchResults = this.inv.searchByName(term);
  }
}

