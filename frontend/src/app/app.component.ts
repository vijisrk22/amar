import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CartFlyoutComponent } from './components/cart-flyout/cart-flyout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SideMenuComponent, CartFlyoutComponent],
  template: `
    <app-header></app-header>
    <app-side-menu></app-side-menu>
    <app-cart-flyout></app-cart-flyout>
    <main id="main">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    main {
      min-height: 100vh;
    }
  `]
})
export class AppComponent {}
