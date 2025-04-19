import { Component } from '@angular/core';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { NameChangeComponent } from '../name-change/name-change.component';

@Component({
  selector: 'app-profile',
  imports: [NameChangeComponent, PasswordChangeComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
