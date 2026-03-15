import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Book, HeroSlide } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  heroSlides: HeroSlide[] = [];
  featuredBooks: Book[] = [];
  allBooks: Book[] = [];
  currentSlide = 0;
  private slideInterval: any;

  constructor(private api: ApiService, private cartService: CartService) {}

  ngOnInit() {
    this.api.getHeroSlides().subscribe(slides => {
      this.heroSlides = slides;
      this.startAutoPlay();
    });
    this.api.getFeaturedBooks().subscribe(books => this.featuredBooks = books);
    this.api.getBooks().subscribe(books => this.allBooks = books);
    this.initScrollReveal();
  }

  ngOnDestroy() { clearInterval(this.slideInterval); }

  startAutoPlay() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    clearInterval(this.slideInterval);
    this.startAutoPlay();
  }

  addToCart(book: Book) {
    this.cartService.addToCart(book.id);
  }

  getStatusBadge(book: Book): string {
    if (book.is_new) return 'NEW';
    if (book.edition_type === 'limited') return 'LIMITED';
    if (book.status === 'out_of_stock') return 'SOLD OUT';
    if (book.status === 'pre_order') return 'PRE-ORDER';
    return '';
  }

  getBadgeClass(book: Book): string {
    if (book.is_new) return 'badge-new';
    if (book.edition_type === 'limited') return 'badge-limited';
    if (book.status === 'out_of_stock') return 'badge-sold-out';
    if (book.status === 'pre_order') return 'badge-pre-order';
    return '';
  }

  private initScrollReveal() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 500);
  }
}
