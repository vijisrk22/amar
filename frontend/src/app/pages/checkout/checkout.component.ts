import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CartResponse } from '../../models/interfaces';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-page">
      <div class="container">
        <h1>Checkout</h1>
        <div class="checkout-layout">
          <div class="checkout-form">
            <h3>Contact Information</h3>
            <div class="form-group"><label>Email *</label><input type="email" [(ngModel)]="form.email" required id="checkout-email" /></div>
            <div class="form-group"><label>Full Name *</label><input type="text" [(ngModel)]="form.name" required /></div>
            <div class="form-group"><label>Phone</label><input type="tel" [(ngModel)]="form.phone" /></div>

            <h3>Delivery Address</h3>
            <div class="form-group"><label>Address Line 1 *</label><input type="text" [(ngModel)]="form.address_line1" required /></div>
            <div class="form-group"><label>Address Line 2</label><input type="text" [(ngModel)]="form.address_line2" /></div>
            <div class="form-row">
              <div class="form-group"><label>City *</label><input type="text" [(ngModel)]="form.city" required /></div>
              <div class="form-group"><label>State *</label><input type="text" [(ngModel)]="form.state" required /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Postal Code *</label><input type="text" [(ngModel)]="form.postal_code" required /></div>
              <div class="form-group"><label>Country</label><input type="text" [(ngModel)]="form.country" /></div>
            </div>

            <h3>Payment Method</h3>
            <div class="payment-options">
              <label class="payment-option" [class.selected]="form.payment_method === 'cod'">
                <input type="radio" name="payment" value="cod" [(ngModel)]="form.payment_method" />
                <span class="radio-custom"></span>
                <span>Cash on Delivery</span>
              </label>
              <label class="payment-option" [class.selected]="form.payment_method === 'online'">
                <input type="radio" name="payment" value="online" [(ngModel)]="form.payment_method" />
                <span class="radio-custom"></span>
                <span>Online Payment (Coming Soon)</span>
              </label>
            </div>

            <p class="error" *ngIf="error">{{ error }}</p>
            <button class="btn btn-primary" style="width:100%;margin-top:24px" (click)="placeOrder()" [disabled]="isSubmitting" id="place-order-btn">
              {{ isSubmitting ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
          <div class="checkout-summary">
            <h3>Order Summary</h3>
            <div class="summary-items">
              <div class="summary-item" *ngFor="let item of cart.items">
                <img [src]="item.cover_image" [alt]="item.title" />
                <div class="summary-item-info">
                  <p class="summary-item-title">{{ item.title }}</p>
                  <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
                </div>
                <p class="summary-item-price">₹{{ item.price * item.quantity | number }}</p>
              </div>
            </div>
            <div class="summary-totals">
              <div class="summary-row"><span>Subtotal</span><span>₹{{ cart.subtotal | number }}</span></div>
              <div class="summary-row"><span>Shipping</span><span>{{ cart.subtotal >= 3000 ? 'Free' : '₹100' }}</span></div>
              <div class="summary-row"><span>Tax (5%)</span><span>₹{{ (cart.subtotal * 0.05) | number:'1.0-0' }}</span></div>
              <div class="summary-total"><span>Total</span><span>₹{{ cart.subtotal + (cart.subtotal >= 3000 ? 0 : 100) + (cart.subtotal * 0.05) | number:'1.0-0' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cart: CartResponse = { items: [], subtotal: 0, count: 0 };
  form = { email: '', name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'India', payment_method: 'cod' };
  error = '';
  isSubmitting = false;

  constructor(private api: ApiService, private cartService: CartService, private router: Router) {}

  ngOnInit() { this.cartService.cart$.subscribe(c => this.cart = c); }

  placeOrder() {
    if (!this.form.email || !this.form.name || !this.form.address_line1 || !this.form.city || !this.form.state || !this.form.postal_code) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.error = '';
    this.isSubmitting = true;

    const orderData = { ...this.form, session_id: this.cartService.getSessionId() };
    this.api.placeOrder(orderData).subscribe({
      next: (res) => {
        this.cartService.loadCart();
        this.router.navigate(['/order-confirmation', res.order.order_number]);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to place order. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
