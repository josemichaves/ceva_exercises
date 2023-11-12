import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppUserFormComponent } from './app-user-form/app-user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppUserFormComponent],
  template: ` <app-app-user-form> </app-app-user-form> `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ex6';
}
