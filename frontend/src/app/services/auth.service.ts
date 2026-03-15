import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  menuOpen$ = this.menuOpenSubject.asObservable();

  private searchOpenSubject = new BehaviorSubject<boolean>(false);
  searchOpen$ = this.searchOpenSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { this.userSubject.next(JSON.parse(savedUser)); } catch { }
    }
  }

  login(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  get isLoggedIn(): boolean { return !!this.userSubject.value; }
  get user(): User | null { return this.userSubject.value; }
  get token(): string | null { return localStorage.getItem('token'); }

  toggleMenu() { this.menuOpenSubject.next(!this.menuOpenSubject.value); }
  closeMenu() { this.menuOpenSubject.next(false); }
  openMenu() { this.menuOpenSubject.next(true); }

  toggleSearch() { this.searchOpenSubject.next(!this.searchOpenSubject.value); }
  closeSearch() { this.searchOpenSubject.next(false); }
}
