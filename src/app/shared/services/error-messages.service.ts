import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class ErrorMessages {
  getErrorMessages(parentGroup: FormGroup, controlName: string, label: string) {
    const control = parentGroup.get(controlName);

    if (control && control.errors) {
      const errors = control.errors;

      if (errors['required']) {
        return `${label} is required`;
      }

      if (errors['minlength']) {
        return `${label} must be at least ${errors['minlength'].requiredLength} characters long`;
      }

      if (errors['maxlength']) {
        return `${label} must be at most ${errors['maxlength'].requiredLength} characters long`;
      }

      if (errors['email']) {
        return `Please enter a valid email address`;
      }

      if (errors['pattern']) {
        return `Invalid format`;
      }
    }

    return null;
  }
}
