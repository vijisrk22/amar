import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/interfaces';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-page" *ngIf="book">
      <div class="detail-inner">
        <div class="detail-images">
          <div class="main-image">
            <img [src]="selectedImage" [alt]="book.title" />
          </div>
          <div class="thumb-list" *ngIf="allImages.length > 1">
            <button *ngFor="let img of allImages; let i = index" class="thumb" [class.active]="selectedImage === img" (click)="selectedImage = img">
              <img [src]="img" [alt]="book.title + ' image ' + (i+1)" />
            </button>
          </div>
        </div>
        <div class="detail-info">
          <p class="detail-category">{{ book.category_name }}</p>
          <h1>{{ book.title }}</h1>
          <p class="detail-subtitle">{{ book.subtitle }}</p>
          <div class="detail-badges">
            <span class="badge badge-new" *ngIf="book.is_new">New</span>
            <span class="badge badge-limited" *ngIf="book.edition_type === 'limited'">Limited Edition</span>
            <span class="badge badge-sold-out" *ngIf="book.status === 'out_of_stock'">Sold Out</span>
            <span class="badge badge-pre-order" *ngIf="book.status === 'pre_order'">Pre-Order</span>
          </div>
          <p class="detail-price" *ngIf="book.status !== 'out_of_stock'">₹{{ book.price | number }}</p>
          <p class="detail-price sold-out" *ngIf="book.status === 'out_of_stock'">Currently Unavailable</p>
          <div class="detail-actions" *ngIf="book.status !== 'out_of_stock'">
            <div class="qty-selector">
              <button (click)="quantity > 1 ? quantity = quantity - 1 : null">−</button>
              <span>{{ quantity }}</span>
              <button (click)="quantity = quantity + 1">+</button>
            </div>
            <button class="btn btn-primary" (click)="addToCart()" id="add-to-cart-btn">
              {{ book.status === 'pre_order' ? 'Pre-Order Now' : 'Add to Cart' }}
            </button>
          </div>
          <div class="detail-series" *ngIf="book.series">
            <span class="label">Series:</span> {{ book.series }}
          </div>
          <div class="detail-description">
            <h3>About This Book</h3>
            <p>{{ book.description }}</p>
          </div>
          <div class="detail-features">
            <div class="feature"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Free shipping over ₹3,000</div>
            <div class="feature"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="22" height="18" rx="2"/><path d="M1 9h22"/></svg> Secure payment</div>
            <div class="feature"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Premium packaging</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  selectedImage = '';
  allImages: string[] = [];
  quantity = 1;

  constructor(private route: ActivatedRoute, private api: ApiService, private cartService: CartService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.api.getBook(params['slug']).subscribe(book => {
        this.book = book;
        this.allImages = [book.cover_image, ...book.detail_images];
        this.selectedImage = book.cover_image;
      });
    });
  }

  addToCart() {
    if (this.book) {
      this.cartService.addToCart(this.book.id, this.quantity);
    }
  }
}
