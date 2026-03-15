import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, HeroSlide, AboutSection, Category, CartResponse, Order, User, SiteSettings } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Books
  getBooks(filters?: { category?: string; series?: string; edition?: string; status?: string; search?: string; sort?: string }): Observable<Book[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }
    return this.http.get<Book[]>(`${this.baseUrl}/books`, { params });
  }

  getFeaturedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books/featured`);
  }

  getBook(slug: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${slug}`);
  }

  // Content
  getHeroSlides(): Observable<HeroSlide[]> {
    return this.http.get<HeroSlide[]>(`${this.baseUrl}/hero`);
  }

  getAboutSections(): Observable<AboutSection[]> {
    return this.http.get<AboutSection[]>(`${this.baseUrl}/about`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.baseUrl}/settings`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search`, { params: { q: query } });
  }

  // Auth
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/auth/login`, { email, password });
  }

  register(name: string, email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/auth/register`, { name, email, password });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`, { headers: this.authHeaders() });
  }

  // Cart
  getCart(sessionId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/cart`, { params: { session_id: sessionId }, headers: this.authHeaders() });
  }

  addToCart(bookId: number, sessionId: string, quantity = 1): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, { book_id: bookId, session_id: sessionId, quantity }, { headers: this.authHeaders() });
  }

  updateCartItem(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/${id}`, { quantity }, { headers: this.authHeaders() });
  }

  removeCartItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/${id}`, { headers: this.authHeaders() });
  }

  mergeCart(sessionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/merge`, { session_id: sessionId }, { headers: this.authHeaders() });
  }

  // Orders
  placeOrder(orderData: any): Observable<{ order: Order }> {
    return this.http.post<{ order: Order }>(`${this.baseUrl}/orders`, orderData, { headers: this.authHeaders() });
  }

  getOrder(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderNumber}`, { headers: this.authHeaders() });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`, { headers: this.authHeaders() });
  }

  // Wishlist
  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/wishlist`, { headers: this.authHeaders() });
  }

  addToWishlist(bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { book_id: bookId }, { headers: this.authHeaders() });
  }

  removeFromWishlist(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${bookId}`, { headers: this.authHeaders() });
  }

  private authHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
