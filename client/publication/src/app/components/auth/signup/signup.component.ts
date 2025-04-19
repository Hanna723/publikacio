import { Component } from '@angular/core';
import { AuthContainerComponent } from "../auth-container/auth-container.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [AuthContainerComponent]
})
export class SignupComponent {

}
