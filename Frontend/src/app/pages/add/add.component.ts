import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../user.service";
import { User } from "../../../user.model";

@Component({
  selector: "app-add",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add.component.html",
})
export class AddComponent implements OnInit {
  addForm!: FormGroup;
  userId: string = '';
  user: User | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Extract user ID from URL parameter
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.loadUserInfo();
      }
    });

    // Initialize form
    this.addForm = this.fb.group({
      yubiUUID: ['', [Validators.required, Validators.pattern(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)]],
      description: ['', Validators.maxLength(100)]
    });
  }

  loadUserInfo(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.id === this.userId) || null;
        if (!this.user) {
          this.errorMessage = 'User not found. Please check the user ID.';
        }
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.errorMessage = 'Failed to load user information.';
      }
    });
  }

  onSubmit(): void {
    if (this.addForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const yubiUUID = this.addForm.get('yubiUUID')?.value;

      // Call the service to add the key to the user
      this.userService.addKeyToUser(this.userId, yubiUUID).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Security Key added successfully!';
          this.addForm.reset();
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error adding Security Key:', error);
          
          // Handle different error scenarios
          if (error.status === 404) {
            this.errorMessage = 'User not found. Please check the user ID.';
          } else if (error.status === 409) {
            this.errorMessage = 'This Security Key is already associated with a user.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid Security Key UUID format.';
          } else {
            this.errorMessage = 'Failed to add Security Key. Please try again.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addForm.controls).forEach(key => {
      const control = this.addForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.addForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName === 'yubiUUID' ? 'Security Key UUID' : 'Description'} is required`;
      }
      if (control.errors['pattern']) {
        return 'Security Key UUID must be in UUID format (e.g., 23bbd71d-16c7-471c-898b-00b9fa4d3e22)';
      }
      if (control.errors['maxlength']) {
        return 'Description must be less than 100 characters';
      }
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  // Helper method for template
  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }
}
