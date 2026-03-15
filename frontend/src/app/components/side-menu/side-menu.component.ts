import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overlay" [class.active]="isOpen" (click)="close()"></div>
    <nav class="side-menu" [class.open]="isOpen" id="side-menu">
      <div class="side-menu-header">
        <button (click)="close()" class="close-btn" aria-label="Close">✕</button>
      </div>
      <div class="side-menu-body">
        <div class="menu-section" *ngFor="let section of menuSections">
          <button class="menu-section-title" (click)="toggleSection(section)" [class.expanded]="section.expanded">
            {{ section.title }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="menu-section-items" [class.show]="section.expanded">
            <div class="menu-subsection" *ngFor="let sub of section.subsections">
              <p class="menu-subtitle">{{ sub.label }}</p>
              <a *ngFor="let item of sub.items" [routerLink]="item.link" [queryParams]="item.params || {}" class="menu-item" (click)="close()">
                {{ item.label }}
              </a>
            </div>
          </div>
        </div>
        <div class="menu-links">
          <a routerLink="/our-story" class="menu-link" (click)="close()">Our Story</a>
          <a routerLink="/account/login" class="menu-link" (click)="close()" *ngIf="!isLoggedIn">Login / Register</a>
          <a routerLink="/account/orders" class="menu-link" (click)="close()" *ngIf="isLoggedIn">My Orders</a>
          <a routerLink="/account/wishlist" class="menu-link" (click)="close()">Wishlist</a>
          <button class="menu-link" (click)="logout(); close()" *ngIf="isLoggedIn">Logout</button>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit {
  isOpen = false;
  isLoggedIn = false;

  menuSections: any[] = [
    {
      title: 'Books',
      expanded: false,
      subsections: [
        {
          label: 'Shop by Category',
          items: [
            { label: 'All Titles', link: '/books' },
            { label: 'Heritage', link: '/books', params: { category: 'heritage' } },
            { label: 'Architecture', link: '/books', params: { category: 'architecture' } },
            { label: 'Art', link: '/books', params: { category: 'art' } },
            { label: 'Photography', link: '/books', params: { category: 'photography' } },
            { label: 'Music & Culture', link: '/books', params: { category: 'music-culture' } },
            { label: 'Coffee Table', link: '/books', params: { category: 'coffee-table' } },
          ]
        },
        {
          label: 'Shop by Series',
          items: [
            { label: 'Signature Edition', link: '/books', params: { series: 'Signature Edition' } },
            { label: 'Collector\'s Edition', link: '/books', params: { series: "Collector's Edition" } },
            { label: 'Standard Edition', link: '/books', params: { series: 'Standard Edition' } },
          ]
        }
      ]
    },
    {
      title: 'Limited Editions',
      expanded: false,
      subsections: [
        {
          label: 'Shop by Type',
          items: [
            { label: 'All Limited Editions', link: '/limited-editions' },
            { label: 'Few Left', link: '/limited-editions', params: { status: 'available' } },
            { label: 'Sold Out', link: '/limited-editions', params: { status: 'out_of_stock' } },
          ]
        }
      ]
    },
    {
      title: 'Gifts',
      expanded: false,
      subsections: [
        {
          label: 'Shop by Price',
          items: [
            { label: 'All Gifts', link: '/gifts' },
            { label: 'Under ₹1000', link: '/gifts', params: { maxPrice: '1000' } },
            { label: '₹1000 – ₹3000', link: '/gifts', params: { minPrice: '1000', maxPrice: '3000' } },
            { label: 'Over ₹3000', link: '/gifts', params: { minPrice: '3000' } },
          ]
        },
        {
          label: 'Collections',
          items: [
            { label: 'Popular Picks', link: '/books', params: { sort: 'popular' } },
            { label: 'New Arrivals', link: '/books', params: { sort: 'newest' } },
          ]
        }
      ]
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.menuOpen$.subscribe(open => this.isOpen = open);
    this.authService.user$.subscribe(user => this.isLoggedIn = !!user);
  }

  close() { this.authService.closeMenu(); }

  toggleSection(section: any) {
    section.expanded = !section.expanded;
  }

  logout() { this.authService.logout(); }
}
