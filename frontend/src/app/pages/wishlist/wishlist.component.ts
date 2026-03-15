import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-page">
      <div class="container">
        <h1>My Wishlist</h1>
        <div *ngIf="!isLoggedIn" class="auth-prompt">
          <p>Please log in to view your wishlist</p>
          <a routerLink="/account/login" class="btn btn-primary">Login</a>
        </div>
        <div *ngIf="isLoggedIn && items.length === 0" class="empty-state">
          <h3>Your wishlist is empty</h3>
          <a routerLink="/books" class="btn btn-primary">Browse Books</a>
        </div>
        <div class="book-grid" *ngIf="items.length > 0">
          <div *ngFor="let item of items" class="book-card">
            <a [routerLink]="'/book/' + item.slug" class="book-card-image">
              <img [src]="item.cover_image" [alt]="item.title" />
            </a>
            <div class="book-card-info">
              <h3>{{ item.title }}</h3>
              <p class="price">₹{{ item.price | number }}</p>
              <button class="remove-link" (click)="remove(item.book_id)">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page { padding-top: calc(var(--header-height) + 40px); min-height: 80vh; h1 { text-align: center; margin-bottom: 32px; } }
    .auth-prompt, .empty-state { text-align: center; padding: 60px 0; p, h3 { margin-bottom: 16px; color: var(--color-gray-500); } }
    .book-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px 24px; }
    .book-card-image { display: block; aspect-ratio: 3/4; overflow: hidden; background: var(--color-gray-100); margin-bottom: 12px;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
      &:hover img { transform: scale(1.05); }
    }
    .book-card-info { text-align: center;
      h3 { font-family: var(--font-heading); font-size: 15px; font-weight: 700; margin-bottom: 6px; }
      .price { font-weight: 600; margin-bottom: 8px; }
    }
    .remove-link { background: none; border: none; font-size: 12px; color: var(--color-gray-500); cursor: pointer; text-decoration: underline; &:hover { color: var(--color-error); } }
    @media (max-width: 768px) { .book-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class WishlistComponent implements OnInit {
  items: any[] = [];
  isLoggedIn = false;
  constructor(private api: ApiService, private auth: AuthService) {}
  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn;
    if (this.isLoggedIn) { this.api.getWishlist().subscribe(i => this.items = i); }
  }
  remove(bookId: number) {
    this.api.removeFromWishlist(bookId).subscribe(() => { this.items = this.items.filter(i => i.book_id !== bookId); });
  }
}
