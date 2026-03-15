import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { CartResponse, CartItem } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartResponse>({ items: [], subtotal: 0, count: 0 });
  cart$ = this.cartSubject.asObservable();

  private flyoutOpenSubject = new BehaviorSubject<boolean>(false);
  flyoutOpen$ = this.flyoutOpenSubject.asObservable();

  private sessionId: string;

  constructor(private api: ApiService) {
    this.sessionId = localStorage.getItem('cart_session') || this.generateSessionId();
    localStorage.setItem('cart_session', this.sessionId);
    this.loadCart();
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  loadCart() {
    this.api.getCart(this.sessionId).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: () => {}
    });
  }

  addToCart(bookId: number, quantity = 1) {
    this.api.addToCart(bookId, this.sessionId, quantity).subscribe({
      next: () => {
        this.loadCart();
        this.openFlyout();
      }
    });
  }

  updateQuantity(itemId: number, quantity: number) {
    this.api.updateCartItem(itemId, quantity).subscribe({
      next: () => this.loadCart()
    });
  }

  removeItem(itemId: number) {
    this.api.removeCartItem(itemId).subscribe({
      next: () => this.loadCart()
    });
  }

  openFlyout() { this.flyoutOpenSubject.next(true); }
  closeFlyout() { this.flyoutOpenSubject.next(false); }

  getSessionId(): string { return this.sessionId; }

  get cartCount(): number { return this.cartSubject.value.count; }
}
