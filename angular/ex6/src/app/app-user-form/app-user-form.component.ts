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
        zip: ['', [Validators.required]], // Regex to only accept only alpha uppercase and lower and space
        city: ['', [Validators.required, Validators.pattern('^[A-Za-z ]*$')]],
      }),
    });
  }

  doSubmit(): void {
    // check if date is valid for emitting
    if (this.userForm.valid) {
      alert('All fields are valid, emitting event');
      this.event.emit({
        email: this.userForm.get('email')?.value,
        name: this.userForm.get('name')?.value,
        birthday: this.userForm.get('birthday')?.value,
        address: {
          zip: this.userForm.get('address.zip')?.value,
          city: this.userForm.get('address.city')?.value,
        },
      });
    } else {
      alert('Something is wrong, check the fields');
    }
  }

  dateValidator(input: FormControl): any {
    return Date.parse(new Date().toDateString()) > Date.parse(input.value)
      ? null
      : {
          dateError: 'Date must be before today',
        };
  }
}
