import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth-container',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss',
})
export class AuthContainerComponent {
  @Input() title: string = '';
}
