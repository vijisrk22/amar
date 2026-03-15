import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/interfaces';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <div class="container">
        <h1>My Orders</h1>
        <div *ngIf="!isLoggedIn" class="auth-prompt">
          <p>Please log in to view your orders</p>
          <a routerLink="/account/login" class="btn btn-primary">Login</a>
        </div>
        <div *ngIf="isLoggedIn && orders.length === 0" class="empty-state">
          <h3>No orders yet</h3>
          <a routerLink="/books" class="btn btn-primary">Shop Now</a>
        </div>
        <div *ngIf="orders.length > 0" class="orders-list">
          <div *ngFor="let order of orders" class="order-card">
            <div class="order-header">
              <div>
                <p class="order-number">{{ order.order_number }}</p>
                <p class="order-date">{{ order.created_at | date:'mediumDate' }}</p>
              </div>
              <div class="order-status">
                <span class="status-badge" [ngClass]="'status-' + order.status">{{ order.status }}</span>
              </div>
            </div>
            <div class="order-totals">
              <span>Total: ₹{{ order.total | number }}</span>
              <a [routerLink]="'/order-confirmation/' + order.order_number" class="view-link">View Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { padding-top: calc(var(--header-height) + 40px); min-height: 80vh; h1 { text-align: center; margin-bottom: 32px; } }
    .auth-prompt, .empty-state { text-align: center; padding: 60px 0; p, h3 { margin-bottom: 16px; color: var(--color-gray-500); } }
    .orders-list { max-width: 700px; margin: 0 auto; }
    .order-card { border: 1px solid var(--color-gray-100); padding: 20px 24px; margin-bottom: 12px; transition: border-color var(--transition-fast); &:hover { border-color: var(--color-gray-300); } }
    .order-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
    .order-number { font-family: var(--font-heading); font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .order-date { font-size: 13px; color: var(--color-gray-500); }
    .status-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 12px; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed, .status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-shipped { background: #e3f2fd; color: #1565c0; }
    .status-delivered { background: #e8f5e9; color: #2e7d32; }
    .status-cancelled { background: #fce4ec; color: #c62828; }
    .order-totals { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
    .view-link { color: var(--color-gold); text-decoration: underline; }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoggedIn = false;
  constructor(private api: ApiService, private auth: AuthService) {}
  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn;
    if (this.isLoggedIn) { this.api.getMyOrders().subscribe(o => this.orders = o); }
  }
}
