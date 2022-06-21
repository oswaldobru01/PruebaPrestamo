import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
export class Home {
  get(): FormGroup {
    return new FormBuilder().group({
      nombre: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      cedula: new FormControl('', [Validators.required]),
    });
  }
}
