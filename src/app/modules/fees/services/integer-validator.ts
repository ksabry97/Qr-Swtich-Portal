import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Allow empty values — required validator can handle those
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Check if it's not an integer
    if (!Number.isInteger(Number(value))) {
      return { notInteger: true };
    }

    return null;
  };
}
