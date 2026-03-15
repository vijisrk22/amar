import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'books', loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent) },
  { path: 'limited-editions', loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent), data: { edition: 'limited' } },
  { path: 'gifts', loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent), data: { gift: true } },
  { path: 'book/:slug', loadComponent: () => import('./pages/book-detail/book-detail.component').then(m => m.BookDetailComponent) },
  { path: 'our-story', loadComponent: () => import('./pages/our-story/our-story.component').then(m => m.OurStoryComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'account/login', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'account/wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'account/orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'order-confirmation/:orderNumber', loadComponent: () => import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent) },
  { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) },
  { path: '**', redirectTo: '' },
];
