import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/interfaces';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-page" *ngIf="order">
      <div class="container">
        <div class="confirmation-card">
          <div class="check-mark">✓</div>
          <h1>Order Confirmed!</h1>
          <p class="order-number">Order {{ order.order_number }}</p>
          <p class="thank-you">Thank you for your order. We'll send you an email confirmation shortly.</p>
          <div class="order-details">
            <h3>Order Summary</h3>
            <div class="detail-row" *ngFor="let item of order.items">
              <span>{{ item.title }} × {{ item.quantity }}</span>
              <span>₹{{ item.price * item.quantity | number }}</span>
            </div>
            <div class="detail-row"><span>Subtotal</span><span>₹{{ order.subtotal | number }}</span></div>
            <div class="detail-row"><span>Shipping</span><span>{{ order.shipping === 0 ? 'Free' : '₹' + order.shipping }}</span></div>
            <div class="detail-row"><span>Tax</span><span>₹{{ order.tax | number }}</span></div>
            <div class="detail-row total"><span>Total</span><span>₹{{ order.total | number }}</span></div>
          </div>
          <a routerLink="/" class="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page { padding-top: calc(var(--header-height) + 40px); min-height: 80vh; }
    .confirmation-card { max-width: 600px; margin: 0 auto; text-align: center; padding: 40px 24px; }
    .check-mark { width: 64px; height: 64px; border-radius: 50%; background: var(--color-success); color: white; font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    h1 { margin-bottom: 8px; }
    .order-number { font-family: var(--font-heading); font-weight: 700; color: var(--color-gold); margin-bottom: 12px; }
    .thank-you { color: var(--color-gray-700); margin-bottom: 32px; }
    .order-details { text-align: left; background: var(--color-gray-100); padding: 24px; margin-bottom: 32px;
      h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
    }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid rgba(0,0,0,0.05);
      &.total { font-size: 18px; font-weight: 700; border-top: 1px solid var(--color-gray-300); border-bottom: none; padding-top: 12px; margin-top: 4px; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.api.getOrder(params['orderNumber']).subscribe(o => this.order = o);
    });
  }
}
