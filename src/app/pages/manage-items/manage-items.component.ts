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
  // Categories for the drop-down
  categories = ['Hot Food', 'Sweets', 'Beverage', 'Others'];

  // Items currently shown in the table (after sort/filter)
  items: CafeItem[] = [];
  // Separate list for instant search results
  searchResults: CafeItem[] = [];

  // Form fields
  itemId = '';
  name = '';
  category = 'Hot Food';
  quantity = 0;
  price = 0;
  supplier = '';
  stockLevel = 1;
  popular = false;
  comment = '';

  // Editing state
  isEditing = false;
  editName = '';

  // Feedback + validation
  successMessage = '';
  errorMessage = '';
  validationErrors: string[] = [];

  // Extra features: sorting + low-stock filter
  sortOption = 'name-asc';       // default sort
  showLowStockOnly = false;      // show only stock <= 2

  constructor(private inv: InventoryService) {
    // Initialise items when component loads
    this.refreshItemsView();
  }

  /** Refresh items from the service and apply sort + low-stock filter. */
  private refreshItemsView(): void {
    let list = this.inv.getAll();

    if (this.showLowStockOnly) {
      list = list.filter(i => i.stockLevel <= 2);
    }

    switch (this.sortOption) {
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'stock-asc':
        list.sort((a, b) => a.stockLevel - b.stockLevel);
        break;
      case 'stock-desc':
        list.sort((a, b) => b.stockLevel - a.stockLevel);
        break;
    }

    this.items = list;
  }

  /** Small helper to show success messages that fade out. */
  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    // clear after a short time
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /** Helper to show error messages. */
  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
  }

  /** Validate the form and build a list of validationErrors. */
  private validateForm(): boolean {
    const errors: string[] = [];

    if (!this.itemId.trim()) {
      errors.push('Item ID is required.');
    }
    if (!this.name.trim()) {
      errors.push('Name is required.');
    }
    if (!this.category.trim()) {
      errors.push('Category is required.');
    }
    if (this.quantity == null || this.quantity < 0) {
      errors.push('Quantity must be 0 or greater.');
    }
    if (this.price == null || this.price < 0) {
      errors.push('Price must be 0 or greater.');
    }
    if (this.stockLevel < 1 || this.stockLevel > 5) {
      errors.push('Stock level must be between 1 and 5.');
    }

    this.validationErrors = errors;

    if (errors.length > 0) {
      this.showError('Please fix the issues listed below.');
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  /** Reset the form back to its default state. */
  resetForm(): void {
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
    this.validationErrors = [];
    this.errorMessage = '';
  }

  /** Add a new inventory item (if the form is valid and ID is unique). */
  addItem(): void {
    if (!this.validateForm()) {
      return;
    }

    const newItem: CafeItem = {
      itemId: this.itemId.trim(),
      name: this.name.trim(),
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier: this.supplier.trim(),
      stockLevel: this.stockLevel,
      popular: this.popular,
      comment: this.comment.trim()
    };

    const result = this.inv.add(newItem);
    if (!result.ok) {
      this.showError(result.error!);
      return;
    }

    this.refreshItemsView();
    this.showSuccess('Item added successfully.');
    this.resetForm();
  }

  /** Start editing an existing item by loading values back into the form. */
  startEdit(item: CafeItem): void {
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

    this.validationErrors = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  /** Save changes for the item being edited. */
  saveEdit(): void {
    if (!this.validateForm()) {
      return;
    }

    const updated: CafeItem = {
      itemId: this.itemId.trim(),
      name: this.name.trim(),
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier: this.supplier.trim(),
      stockLevel: this.stockLevel,
      popular: this.popular,
      comment: this.comment.trim()
    };

    const result = this.inv.updateByName(this.editName, updated);
    if (!result.ok) {
      this.showError(result.error!);
      return;
    }

    this.refreshItemsView();
    this.showSuccess('Item updated successfully.');
    this.resetForm();
  }

  /** Delete an item by its name (with confirmation). */
  deleteItem(name: string): void {
    if (!confirm(`Delete "${name}"?`)) {
      return;
    }

    const result = this.inv.deleteByName(name);
    if (!result.ok) {
      this.showError(result.error!);
      return;
    }

    this.refreshItemsView();
    this.showSuccess('Item deleted.');
  }

  /** Search for items by name (used in the right-hand search box). */
  search(term: string): void {
    this.searchResults = this.inv.searchByName(term);
  }

  /** React to sort drop-down changes. */
  onSortChange(): void {
    this.refreshItemsView();
  }

  /** React to the "low stock only" checkbox. */
  onFilterChange(): void {
    this.refreshItemsView();
  }
}

