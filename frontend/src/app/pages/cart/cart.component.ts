import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartResponse } from '../../models/interfaces';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">
      <div class="container">
        <h1>Shopping Cart</h1>
        <div *ngIf="cart.items.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <h3>Your cart is empty</h3>
          <p>Discover our collection of premium books</p>
          <a routerLink="/books" class="btn btn-primary">Shop Now</a>
        </div>
        <div *ngIf="cart.items.length > 0" class="cart-layout">
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart.items">
              <a [routerLink]="'/book/' + item.slug"><img [src]="item.cover_image" [alt]="item.title" class="item-img" /></a>
              <div class="item-info">
                <a [routerLink]="'/book/' + item.slug" class="item-title">{{ item.title }}</a>
                <p class="item-subtitle">{{ item.subtitle }}</p>
                <p class="item-price">₹{{ item.price | number }}</p>
                <div class="item-qty">
                  <button (click)="updateQty(item.id, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQty(item.id, item.quantity + 1)">+</button>
                </div>
              </div>
              <div class="item-total">
                <p>₹{{ item.price * item.quantity | number }}</p>
                <button class="remove-btn" (click)="remove(item.id)">Remove</button>
              </div>
            </div>
          </div>
          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Subtotal</span><span>₹{{ cart.subtotal | number }}</span></div>
            <div class="summary-row"><span>Shipping</span><span>{{ cart.subtotal >= 3000 ? 'Free' : '₹100' }}</span></div>
            <div class="summary-row"><span>Tax (5%)</span><span>₹{{ (cart.subtotal * 0.05) | number:'1.0-0' }}</span></div>
            <div class="summary-total"><span>Total</span><span>₹{{ cart.subtotal + (cart.subtotal >= 3000 ? 0 : 100) + (cart.subtotal * 0.05) | number:'1.0-0' }}</span></div>
            <a routerLink="/checkout" class="btn btn-primary" style="width:100%">Proceed to Checkout</a>
            <a routerLink="/books" class="btn btn-outline" style="width:100%;margin-top:8px">Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: CartResponse = { items: [], subtotal: 0, count: 0 };
  constructor(private cartService: CartService) {}
  ngOnInit() { this.cartService.cart$.subscribe(c => this.cart = c); }
  updateQty(id: number, qty: number) { this.cartService.updateQuantity(id, qty); }
  remove(id: number) { this.cartService.removeItem(id); }
}
