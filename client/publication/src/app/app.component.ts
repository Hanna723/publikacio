import { Component, ComponentRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/user/profile/profile.component';

@Component({
  imports: [HeaderComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'publication';
  @ViewChild('header') header!: HeaderComponent;

  onComponentChange(componentRef: ComponentRef<unknown>): void {
    if (componentRef instanceof LoginComponent) {
      componentRef.loginEvent.subscribe(() => {
        this.header.isAuthenticated = true;
      });
    }

    if (componentRef instanceof ProfileComponent) {
      componentRef.deleteEvent.subscribe(() => {
        this.header.isAuthenticated = false;
      });
    }
  }
}
