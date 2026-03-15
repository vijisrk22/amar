import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Book, Category } from '../../models/interfaces';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shop-page">
      <div class="shop-header">
        <div class="container">
          <h1>{{ pageTitle }}</h1>
          <p class="shop-count">{{ books.length }} {{ books.length === 1 ? 'Title' : 'Titles' }}</p>
        </div>
      </div>
      <div class="container">
        <div class="shop-filters">
          <div class="filter-group">
            <button class="filter-btn" [class.active]="!activeCategory" (click)="filterCategory(null)">All</button>
            <button *ngFor="let cat of categories" class="filter-btn" [class.active]="activeCategory === cat.slug" (click)="filterCategory(cat.slug)">{{ cat.name }}</button>
          </div>
          <select class="sort-select" (change)="sortBooks($event)">
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
        <div class="book-grid">
          <a *ngFor="let book of books" [routerLink]="'/book/' + book.slug" class="book-card" [id]="'shop-book-' + book.slug">
            <div class="book-card-image">
              <img [src]="book.cover_image" [alt]="book.title" loading="lazy" />
              <span *ngIf="getStatusBadge(book)" class="badge" [ngClass]="getBadgeClass(book)">{{ getStatusBadge(book) }}</span>
              <div class="book-card-overlay">
                <button class="btn btn-primary btn-small" (click)="addToCart(book); $event.preventDefault(); $event.stopPropagation()" *ngIf="book.status !== 'out_of_stock'">
                  {{ book.status === 'pre_order' ? 'Pre-Order' : 'Add to Cart' }}
                </button>
              </div>
            </div>
            <div class="book-card-info">
              <p class="book-card-category">{{ book.category_name }}</p>
              <h3 class="book-card-title">{{ book.title }}</h3>
              <p class="book-card-subtitle">{{ book.subtitle }}</p>
              <p class="book-card-price" *ngIf="book.status !== 'out_of_stock'">₹{{ book.price | number }}</p>
              <p class="book-card-price sold-out" *ngIf="book.status === 'out_of_stock'">Sold Out</p>
            </div>
          </a>
        </div>
        <div *ngIf="books.length === 0" class="empty-state">
          <h3>No books found</h3>
          <p>Try adjusting your filters</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  activeCategory: string | null = null;
  pageTitle = 'All Books';
  private editionFilter: string | null = null;

  constructor(private api: ApiService, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit() {
    this.api.getCategories().subscribe(cats => this.categories = cats);
    this.route.data.subscribe(data => {
      if (data['edition'] === 'limited') {
        this.pageTitle = 'Limited Editions';
        this.editionFilter = 'limited';
      } else if (data['gift']) {
        this.pageTitle = 'Gifts';
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['category']) { this.activeCategory = params['category']; }
      this.loadBooks(params);
    });
  }

  loadBooks(params: any = {}) {
    const filters: any = {};
    if (this.activeCategory) filters.category = this.activeCategory;
    if (this.editionFilter) filters.edition = this.editionFilter;
    if (params['series']) filters.series = params['series'];
    if (params['sort']) filters.sort = params['sort'];
    this.api.getBooks(filters).subscribe(books => this.books = books);
  }

  filterCategory(slug: string | null) {
    this.activeCategory = slug;
    this.loadBooks();
  }

  sortBooks(event: any) {
    this.loadBooks({ sort: event.target.value });
  }

  addToCart(book: Book) { this.cartService.addToCart(book.id); }

  getStatusBadge(book: Book): string {
    if (book.is_new) return 'NEW';
    if (book.edition_type === 'limited') return 'LIMITED';
    if (book.status === 'out_of_stock') return 'SOLD OUT';
    if (book.status === 'pre_order') return 'PRE-ORDER';
    return '';
  }

  getBadgeClass(book: Book): string {
    if (book.is_new) return 'badge-new';
    if (book.edition_type === 'limited') return 'badge-limited';
    if (book.status === 'out_of_stock') return 'badge-sold-out';
    if (book.status === 'pre_order') return 'badge-pre-order';
    return '';
  }
}
