import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export class PasswordValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const errors: any = {};

      if (value.length < 8)
        errors.minLength = 'At least 8 characters in length';
      if (!/[A-Z]/.test(value)) errors.uppercase = 'Upper case letter (A-Z)';
      if (!/[a-z]/.test(value)) errors.lowercase = 'Lower case letter (a-z)';
      if (!/[0-9]/.test(value)) errors.number = 'At least one number (0-9)';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        errors.special = 'Special character required';

      return Object.keys(errors).length
        ? { passwordRequirements: errors }
        : null;
    };
  }

  static matchPassword(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.get(passwordKey);
      const confirmControl = formGroup.get(confirmPasswordKey);

      if (!passwordControl || !confirmControl) return null;

      if (confirmControl.errors && !confirmControl.errors['passwordMismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmControl.value) {
        confirmControl.setErrors({
          passwordMismatch: 'The password mismatched',
        });
      } else {
        confirmControl.setErrors(null);
      }

      return null;
    };
  }
}
