import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/interfaces';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="search-page">
      <div class="container">
        <h1>Search Results</h1>
        <p class="search-query" *ngIf="query">Showing results for "{{ query }}"</p>
        <div class="book-grid" *ngIf="books.length > 0">
          <a *ngFor="let book of books" [routerLink]="'/book/' + book.slug" class="book-card">
            <div class="book-card-image">
              <img [src]="book.cover_image" [alt]="book.title" />
            </div>
            <div class="book-card-info">
              <h3 class="book-card-title">{{ book.title }}</h3>
              <p class="book-card-subtitle">{{ book.subtitle }}</p>
              <p class="book-card-price">₹{{ book.price | number }}</p>
            </div>
          </a>
        </div>
        <div *ngIf="books.length === 0 && query" class="empty-state">
          <h3>No results found</h3>
          <p>Try a different search term</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-page { padding-top: calc(var(--header-height) + 40px); min-height: 80vh; h1 { text-align: center; margin-bottom: 8px; } }
    .search-query { text-align: center; color: var(--color-gray-500); margin-bottom: 40px; }
    .book-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px 24px; }
    .book-card { text-decoration: none; color: inherit; }
    .book-card-image { aspect-ratio: 3/4; overflow: hidden; background: var(--color-gray-100); margin-bottom: 16px;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
    }
    .book-card:hover img { transform: scale(1.05); }
    .book-card-info { text-align: center; }
    .book-card-title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .book-card-subtitle { font-size: 13px; color: var(--color-gray-700); margin-bottom: 8px; }
    .book-card-price { font-weight: 600; }
    .empty-state { text-align: center; padding: 60px 0; h3 { margin-bottom: 8px; } p { color: var(--color-gray-500); } }
    @media (max-width: 768px) { .book-grid { grid-template-columns: repeat(2, 1fr); gap: 20px 12px; } }
  `]
})
export class SearchComponent implements OnInit {
  books: Book[] = [];
  query = '';
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) { this.api.searchBooks(this.query).subscribe(b => this.books = b); }
    });
  }
}
