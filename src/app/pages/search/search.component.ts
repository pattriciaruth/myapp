import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { CafeItem } from '../../models/cafe-item';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  categories = ['All', 'Hot Food', 'Sweets', 'Beverage', 'Others'];

  nameTerm = '';
  selectedCategory = 'All';
  popularOnly = false;

  results: CafeItem[] = [];

  constructor(private inv: InventoryService) {
    this.applyFilters();
  }

  applyFilters() {
    let items = this.inv.getAll();

    // filter by name
    if (this.nameTerm.trim()) {
      const term = this.nameTerm.trim().toLowerCase();
      items = items.filter((i) =>
        i.name.toLowerCase().includes(term)
      );
    }

    // filter by category
    if (this.selectedCategory !== 'All') {
      items = items.filter((i) => i.category === this.selectedCategory);
    }

    // filter by popular
    if (this.popularOnly) {
      items = items.filter((i) => i.popular);
    }

    this.results = items;
  }

  clearFilters() {
    this.nameTerm = '';
    this.selectedCategory = 'All';
    this.popularOnly = false;
    this.applyFilters();
  }
}

