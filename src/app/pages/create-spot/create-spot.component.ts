import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCard, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-create-spot',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCard,
    MatCardTitle
  ],
  templateUrl: './create-spot.component.html',
})
export class CreateSpotComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    difficulty: ['Intermediate'],
    lat: [0],
    lng: [0],
    imageUrl: [''],
  });

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  submit() {
    if (this.form.valid) {
      const spot = {
        ...this.form.value,
        location: {
          lat: this.form.value.lat,
          lng: this.form.value.lng,
        }
      };
      this.api.postSpot(spot).subscribe(() => {
        alert('Surf spot created!');
        this.router.navigateByUrl('/');
      });
    }
  }
}
