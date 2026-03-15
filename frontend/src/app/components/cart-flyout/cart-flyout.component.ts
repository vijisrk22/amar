import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartResponse } from '../../models/interfaces';

@Component({
  selector: 'app-cart-flyout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overlay" [class.active]="isOpen" (click)="close()"></div>
    <div class="cart-flyout" [class.open]="isOpen" id="cart-flyout">
      <div class="flyout-header">
        <h3>Your Cart</h3>
        <button (click)="close()" class="close-btn" aria-label="Close">✕</button>
      </div>
      <div class="flyout-body">
        <div *ngIf="cart.items.length === 0" class="empty-cart">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Your cart is empty</p>
          <a routerLink="/books" class="btn btn-primary btn-small" (click)="close()">Shop Now</a>
        </div>
        <div *ngFor="let item of cart.items" class="cart-item">
          <img [src]="item.cover_image" [alt]="item.title" class="cart-item-img" />
          <div class="cart-item-info">
            <a [routerLink]="'/book/' + item.slug" class="cart-item-title" (click)="close()">{{ item.title }}</a>
            <p class="cart-item-price">₹{{ item.price | number }}</p>
            <div class="cart-item-qty">
              <button (click)="updateQty(item.id, item.quantity - 1)">−</button>
              <span>{{ item.quantity }}</span>
              <button (click)="updateQty(item.id, item.quantity + 1)">+</button>
            </div>
          </div>
          <button class="remove-btn" (click)="remove(item.id)" aria-label="Remove">✕</button>
        </div>
      </div>
      <div class="flyout-footer" *ngIf="cart.items.length > 0">
        <div class="subtotal">
          <span>Subtotal</span>
          <span class="subtotal-amount">₹{{ cart.subtotal | number }}</span>
        </div>
        <a routerLink="/cart" class="btn btn-outline" style="width:100%;margin-bottom:8px" (click)="close()">View Cart</a>
        <a routerLink="/checkout" class="btn btn-primary" style="width:100%" (click)="close()">Checkout</a>
      </div>
    </div>
  `,
  styleUrl: './cart-flyout.component.scss'
})
export class CartFlyoutComponent implements OnInit {
  isOpen = false;
  cart: CartResponse = { items: [], subtotal: 0, count: 0 };

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.flyoutOpen$.subscribe(open => this.isOpen = open);
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  close() { this.cartService.closeFlyout(); }
  updateQty(id: number, qty: number) { this.cartService.updateQuantity(id, qty); }
  remove(id: number) { this.cartService.removeItem(id); }
}
