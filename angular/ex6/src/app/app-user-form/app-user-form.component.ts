import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app-user-form.component.html',
})
export class AppUserFormComponent {
  userForm: FormGroup;

  @Output()

  // Type for event
  event = new EventEmitter<{
    email: string;
    name: string;
    birthday: Date;
    address: { zip: number; city: string };
  }>();

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.maxLength(128)]],
      birthday: [null, [this.dateValidator]], // Call custom validator
      address: this.formBuilder.group({
        zip: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]], // Regex to only accept only alpha uppercase and lower and space
        city: ['', [Validators.required]],
      }),
    });
  }

  doSubmit(): void {
    // check if date is valid for emitting
    if (this.userForm.valid) {
      console.log('valid, emitting');
      this.event.emit({
        email: this.userForm.get('email')?.value,
        name: this.userForm.get('name')?.value,
        birthday: this.userForm.get('birthday')?.value,
        address: {
          zip: this.userForm.get('address.zip')?.value,
          city: this.userForm.get('address.city')?.value,
        },
      });
    }
  }

  dateValidator(control: FormControl): { isValidDate: boolean } {
    return {
      isValidDate:
        Date.parse(new Date().toDateString()) > Date.parse(control.value), // Parse both dates to timestamp, if provided is lower than today, means is valid date
    };
  }
}
