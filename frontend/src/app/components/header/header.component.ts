import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header" [class.scrolled]="scrolled">
      <div class="header-inner">
        <button class="header-btn menu-btn" (click)="toggleMenu()" id="menu-toggle" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <a routerLink="/" class="logo" id="logo">MARA LABS</a>
        <div class="header-actions">
          <button class="header-btn" (click)="toggleSearch()" id="search-toggle" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <a routerLink="/account/wishlist" class="header-btn" id="wishlist-btn" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </a>
          <button class="header-btn cart-btn" (click)="openCart()" id="cart-toggle" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="cart-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </button>
          <a [routerLink]="isLoggedIn ? '/account/orders' : '/account/login'" class="header-btn" id="account-btn" aria-label="Account">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
        </div>
      </div>
      <!-- Search bar -->
      <div class="search-bar" [class.open]="searchOpen">
        <div class="search-bar-inner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search books..." [(ngModel)]="searchQuery" (keyup.enter)="doSearch()" id="search-input" autofocus />
          <button (click)="closeSearch()">✕</button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  scrolled = false;
  cartCount = 0;
  searchOpen = false;
  searchQuery = '';
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 10;
      });
    }
    this.cartService.cart$.subscribe(cart => this.cartCount = cart.count);
    this.authService.user$.subscribe(user => this.isLoggedIn = !!user);
    this.authService.searchOpen$.subscribe(open => this.searchOpen = open);
  }

  toggleMenu() { this.authService.toggleMenu(); }
  openCart() { this.cartService.openFlyout(); }
  toggleSearch() { this.authService.toggleSearch(); }
  closeSearch() { this.authService.closeSearch(); }

  doSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.closeSearch();
      this.searchQuery = '';
    }
  }
}
