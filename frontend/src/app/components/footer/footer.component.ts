import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/interfaces';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col brand-col">
              <h3 class="footer-logo">MARA LABS</h3>
              <p class="footer-tagline">Premium Coffee Table Books on Indian Heritage</p>
              <div class="social-links" *ngIf="settings">
                <a [href]="settings.instagram" target="_blank" rel="noopener" aria-label="Instagram">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a [href]="'mailto:' + settings.email" aria-label="Email">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 8 10-8"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Shop</h4>
              <a routerLink="/books">All Books</a>
              <a routerLink="/limited-editions">Limited Editions</a>
              <a routerLink="/gifts">Gifts</a>
              <a routerLink="/books" [queryParams]="{sort:'newest'}">New Arrivals</a>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <a routerLink="/our-story">Our Story</a>
              <a href="#">Careers</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div class="footer-col">
              <h4>Customer Service</h4>
              <a href="#">Contact Us</a>
              <a href="#">Shipping & Returns</a>
              <a href="#">Track Order</a>
              <a href="#">FAQ</a>
            </div>
            <div class="footer-col contact-col" *ngIf="settings">
              <h4>Contact</h4>
              <p>{{ settings.address }}</p>
              <p><a [href]="'tel:' + settings.phone">{{ settings.phone }}</a></p>
              <p><a [href]="'mailto:' + settings.email">{{ settings.email }}</a></p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>© {{ year }} Mara Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  settings: SiteSettings | null = null;
  year = new Date().getFullYear();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSettings().subscribe(s => this.settings = s);
  }
}
