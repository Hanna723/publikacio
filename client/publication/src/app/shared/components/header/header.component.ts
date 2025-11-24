import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatToolbarModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAuth().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  navigate(to: string): void {
    this.router.navigateByUrl(to);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
      this.isAuthenticated = false;
    });
  }
}
